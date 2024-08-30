const category = require('../Models/blog_Model/category.model')
const post = require('../Models/blog_Model/post.model')

module.exports = {
    createCategory: async (req, res) => {
        try {
            const existingCategory = await category.findOne({
                category: { $regex: req.body.category, $options: "i" }
            })

            if (existingCategory) {
                res.json({ message: 'Category already exists' });
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
            res.json(data)
        } catch (error) {
            console.log(error.message);
        }
    },
    createPost: async (req, res) => {
        try {
            const { blog_title, blog_description, category_id } = req.body;
            date = new Date()
            blog_image = req.file.filename
            const data = await post.create({ blog_title, blog_description, date, blog_image, category_id })
            if (data) res.json({ message: 'Post Created sucessfull!' })
        } catch (error) {
            res.json({ message: 'Post Created Unsucessfull!' })
        }
    }
}