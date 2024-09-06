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
            deleteImage(req.params.id)
            await post.findByIdAndDelete({ _id: req.params.id })
            res.redirect('/admin/blogs');
        } catch (error) {
            console.log(error.message);
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
    }
}