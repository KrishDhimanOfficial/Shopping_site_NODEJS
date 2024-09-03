const category = require('../Models/blog_Model/category.model')
const post = require('../Models/blog_Model/post.model')
const deleteImage = require('../Service/deleteUploadImage')
const handelAggregatePagination = require('../Service/handlePaginate.Aggregation')

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
            res.json({ message: 'Please Enter Category' })
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
            const options = { page: 1, limit: 4 }
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
            const data = await handelAggregatePagination(post, project, options)
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
    updateBlog: async (req, res) => {
        try {
           const data = await post.findOne({ _id: req.params.id })
           if(!data) res.redirect('/admin/blogs')
        } catch (error) {
            console.log(error.message)
        }
    }
}