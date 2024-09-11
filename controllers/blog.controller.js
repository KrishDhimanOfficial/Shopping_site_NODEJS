const category = require('../Models/blog_Model/category.model')
const post = require('../Models/blog_Model/post.model')
const deleteImage = require('../Service/deleteUploadImage')
const mongoose = require('mongoose')

module.exports = {
    createCategory: async (req, res) => {
        try {
            const existingCategory = await category.findOne({
                category: { $regex: req.body.category, $options: "i" }
            })

            if (existingCategory) {
                res.json({ message: 'Category already exists!' });
            } else {
                await category.create(req.body);
                res.json({ message: 'Category created successfully' });
            }
        } catch (error) {
            console.log(error.message);
            res.json({ message: 'Please Enter Category' })
        }
    },
    allPostsByCategory: async (req, res) => {
        try {
            const data = await category.aggregate([
                {
                    $lookup: {
                        from: 'posts', localField: '_id',
                        foreignField: 'category_id', as: 'categoryPosts'
                    }
                },
                {
                    $group: {
                        _id: '$_id', category_name: { $first: '$category' },
                        posts: { $addToSet: '$categoryPosts' },
                    }
                },
                { $unwind: '$posts' },
                {
                    $addFields: { length: { $size: '$posts' } }
                },
            ])
            
            res.render('admin/blog/blogCategory', { allPostsByCategory: data })
        } catch (error) {
            console.log(error.message);
        }
    },
    allCategories: async (req, res) => {
        try {
            const data = await category.find()
            res.render('admin/blog/createBlog', { categories: data })
        } catch (error) {
            console.log(error.message);
        }
    },
    createPost: async (req, res) => {
        try {
            const { blog_title, blog_description, category_id } = req.body;
            date = new Date()
            author = 'Admin'
            blog_image = req.file.filename

            const data = await post.create({ blog_title, author, blog_description: blog_description[1], date, blog_image, category_id })
            if (data) res.json({ message: 'Post Created sucessfull!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: 'Post Created Unsucessfull!' })
        }
    },
    allPosts: async (req, res) => {
        try {
            const project = ([
                {
                    $lookup: {
                        from: 'categories', localField: 'category_id',
                        foreignField: '_id', as: 'postCategory'
                    }
                }, { $unwind: '$postCategory' },
                {
                    $project: {
                        blog_title: 1, blog_image: 1, postCategory: 1,
                        formattedDate: {
                            $dateToString: { format: "%d-%m-%Y", date: "$date" }
                        }
                    }
                }])
            const data = await post.aggregate(project)
            res.render('admin/blog/blogIndex', { posts: data });
        } catch (error) {
            console.log(error.message);
        }
    },
    deleteBlog: async (req, res) => {
        try {
            const image = await post.findOne({ _id: req.params.id })
            deleteImage(image.blog_image)
            await post.findByIdAndDelete({ _id: req.params.id })
            throw new Error('Successfully Deleted!')
        } catch (error) {
            console.log(error.message);
            res.json({ message: error.message })
        }
    },
    updateBlogPage: async (req, res) => {
        try {
            const categorydata = await category.find({})
            const data = await post.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(req.query.id) } },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'category_name'
                    }
                },
                {
                    $unwind: '$category_name'
                }
            ])
            res.render('admin/blog/updateBlog', { post: data[0], categories: categorydata })
            if (!data) res.redirect('/admin/blogs')
        } catch (error) {
            console.log(error.message)
            res.redirect('/admin/blogs')
        }
    },
    updateBlog: async (req, res) => {
        try {
            const { blog_title, blog_description, category_id } = req.body
            blog_image = req.file?.filename;
            if (blog_image) { deleteImage(req.query.id) }

            const data = await post.findByIdAndUpdate({ _id: req.query.id },
                {
                    blog_title, blog_image, category_id,
                    blog_description: blog_description[0]
                })

            if (!data) res.json({ message: 'Update Unsuccessfull!' })
            res.json({ message: 'Update Successfully!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: 'Update Unsuccessfull!' })
        }
    },
    getBlogs: async (req, res) => {
        try {
            const data = await post.aggregate([{
                $project: {
                    blog_title: 1, blog_description: 1, author: 1, blog_image: 1,
                    formattedDate: {
                        $dateToString: { format: '%d-%m-%Y', date: '$date' }
                    }
                }
            }]).limit(parseInt(req.params.loadPosts))

            res.status(200).json(data)
        } catch (error) {
            console.log("getBlogs :" + error.message);
        }
    },
    getSingleBlog: async (req, res) => {
        try {
            const featuredPosts = await post.aggregate([{
                $project: {
                    blog_title: 1, blog_image: 1,
                    formattedDate: {
                        $dateToString: { format: '%d-%m-%Y', date: '$date' }
                    }
                }
            }]).limit(3)
            const data = await post.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                { $unwind: '$category' },
                {
                    $project: {
                        blog_title: 1, blog_description: 1, author: 1, blog_image: 1, category: 1,
                        formattedDate: {
                            $dateToString: { format: '%d-%m-%Y', date: '$date' }
                        },
                    }
                }
            ])
            const Postcategories = await category.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'category_id',
                        as: 'posts'
                    }
                },
                { $unwind: '$posts' },
                {
                    $group: {
                        _id: '$posts.category_id',
                        category_name: { $first: '$category' },
                        postarry: { $push: '$posts' },
                    }
                },
                {
                    $addFields: {
                        length: { $size: '$postarry' }
                    }
                }
            ])
            if (!data) res.render('site/singleBlog', { message: 'NOT FOUND' })
            res.render('site/singleBlog', { blog: data, featuredPosts, Postcategories })
        } catch (error) {
            console.log('getSingleBlog' + error.message);
            res.render('site/singleBlog :', { message: error.message })
        }
    },
    getCategoryBlogs: async (req, res) => {
        try {
            const data = await category.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'category_id',
                        as: 'posts'
                    }
                },
                { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
                { $unwind: '$posts' },
                {
                    $group: {
                        _id: '$posts.category_id',
                        posts: { $addToSet: '$posts' },
                    }
                },
            ])
            res.render('site/categoriesBlogs', { Postcategories :data })
        } catch (error) {
            console.log('getCategoryBlogs :' + error.message);
        }
    }
}