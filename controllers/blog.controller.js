const category = require('../Models/blog_Model/category.model')
const comment = require('../Models/blog_Model/comment.model')
const post = require('../Models/blog_Model/post.model')
const deleteImage = require('../Service/deleteUploadImage')
const mongoose = require('mongoose')
const { getUser } = require('../Service/auth')
const query = require('../Service/query')
const tagsModel = require('../Models/blog_Model/tags.model')

module.exports = {
    createCategory: async (req, res) => {
        try {
            const existingCategory = await category.findOne({
                category: { $regex: req.body.info, $options: "i" }
            })
            if (existingCategory) {
                res.json({ message: 'Category already exists!' })
            } else {
                await category.create({ category: req.body.info });
                res.json({ message: 'Successfull!' });
            }
        } catch (error) {
            console.log(error.message);
            res.json({ message: 'Please Enter Category' })
        }
    },
    allPostsAttributes: async (req, res) => {
        try {
            const tags = await tagsModel.find({})
            const data = await category.aggregate([
                {
                    $lookup: {
                        from: 'posts', localField: '_id',
                        foreignField: 'category_id', as: 'Posts'
                    }
                },
                {
                    $addFields: { length: { $size: '$Posts' } }
                },
            ])
            res.render('admin/blog/blogCategory', { allPostsByCategory: data, tags })
        } catch (error) {
            console.log('allPostsByCategory :' + error.message);
        }
    },
    deletePostCategory: async (req, res) => {
        try {
            const data = await category.findByIdAndDelete({ _id: req.params.id })
            if (!data) res.status(200).json({ message: 'Unsuccessfull!' })
            res.status(200).json({ message: 'Successfull!' })
        } catch (error) {
            console.log('deletePostCategory : ' + error.message);
        }
    },
    updatePostCategory: async (req, res) => {
        try {
            const data = await category.findByIdAndUpdate({ _id: req.params.id }, { category: req.body.info })
            if (!data) res.status(200).json({ message: 'Unsuccessfull!' })
            res.status(200).json({ message: 'Successfull!' })
        } catch (error) {
            console.log('updatePostCategory : ' + error.message)
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
    createTag: async (req, res) => {
        try {
            const existingTag = await tagsModel.findOne({ tag_name: req.body.info })
            if (existingTag) res.json({ message: 'Category already exists!' })
            const data = await tagsModel.create({ tag_name: req.body.info })
            if (!data) res.status(200).json({ message: 'Unsuccessfull!' })
            res.status(200).json({ message: 'Successfull!' })
        } catch (error) {
            console.log('createTag : ' + error.message)
        }
    },
    updateTag: async (req, res) => {
        try {
            const data = await tagsModel.findByIdAndUpdate({ _id: req.params.id }, { tag_name: req.body.info })
            if (!data) res.status(200).json({ message: 'Unsuccessfull!' })
            res.status(200).json({ message: 'Successfull!' })
        } catch (error) {
            console.log('updateTag :' + error.message)
        }
    },
    deleteTag: async (req, res) => {
        try {
            const data = await tagsModel.findByIdAndDelete({ _id: req.params.id })
            if (!data) res.status(200).json({ message: 'Unsuccessfull!' })
            res.status(200).json({ message: 'Successfull!' })
        } catch (error) {
            console.log('deleteTag : ' + error.message)
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
            deleteImage(`/blogsImages/${image.blog_image}`)
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
            console.log('updateBlogPage :' + error.message)
            res.redirect('/admin/blogs')
        }
    },
    updateBlog: async (req, res) => {
        try {
            const { blog_title, blog_description, category_id } = req.body
            const blog_image = req.file?.filename;
            console.log(req.query.id);

            const data = await post.findByIdAndUpdate({ _id: req.query.id },
                {
                    blog_title, blog_image, category_id,
                    blog_description: blog_description[0]
                })
            if (blog_image) deleteImage(`/blogsImages/${data.blog_image}`)
            if (!data) res.json({ message: 'Update Unsuccessfull!' })
            res.json({ message: 'Update Successfully!' })
        } catch (error) {
            console.log("updateBlog : " + error.message);
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
            const featuredPosts = await post.aggregate(query.featuredPosts).limit(3)
            const Postcategories = await category.aggregate(query.getCategoryPostLength)
            const comments = await post.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
                {
                    $lookup: {
                        from: 'blogcomments',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'comments'
                    }
                },
                {
                    $addFields: {
                        comments: {
                            $filter: {
                                input: '$comments',
                                as: 'comment',
                                cond: { $eq: ['$$comment.status', true] }
                            }
                        }
                    }
                },
                { $unwind: '$comments' },
                {
                    $group: {
                        _id: '_id',
                        comments: { $push: '$comments' }
                    }
                },
            ])
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
            if (!data) res.render('site/singleBlog', { message: 'NOT FOUND' })
            res.render('site/singleBlog', { blog: data, featuredPosts, Postcategories, postComments: comments })
        } catch (error) {
            console.log('getSingleBlog' + error.message);
        }
    },
    getCategoryBlogs: async (req, res) => {
        try {
            const data = await category.aggregate([
                { $match: { category: { $regex: req.params.category_name, $options: 'i' } } },
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
                        posts: { $addToSet: '$posts' },
                    }
                },
            ])
            res.render('site/categoriesBlogs', { Postcategories: data })
        } catch (error) {
            console.log('getCategoryBlogs :' + error.message);
        }
    },
    // Admin
    createPostComment: async (req, res) => {
        try {
            const token = req.cookies.token;
            const user = getUser(token)

            const data = await comment.create({
                comment: req.body.comment,
                post_id: new mongoose.Types.ObjectId(req.params.postId),
                user_name: user.username,
                date: new Date(),
                user_image: 'user.webp'
            })
            res.json(data)
        } catch (error) {
            console.log('getPostComment : ' + error.message);
        }
    },
    getBlogComments: async (req, res) => {
        try {
            const data = await comment.find({})
            res.render('admin/blog/blogComments', { comments: data })
        } catch (error) {
            console.log('getBlogComments :' + error.message);
        }
    },
    updateBlogComments: async (req, res) => {
        try {

            const data = await comment.findByIdAndUpdate({ _id: req.params.id },
                req.body,
                { new: true }
            )
            res.status(200).json(data)
        } catch (error) {
            console.log('updateBlogComments :' + error.message);
        }
    },
    deleteBlogComment: async (req, res) => {
        try {
            await comment.findByIdAndDelete({ _id: req.params.id })
            res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log('deleteBlogComment :' + error.message);
        }
    },
    // Admin
}