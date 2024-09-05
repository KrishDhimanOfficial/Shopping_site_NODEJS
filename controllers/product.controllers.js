const categoryModel = require('../Models/blog_Model/category.model')
const parent_Category = require('../Models/product_model/parent.category.model')
const sub_Category = require('../Models/product_model/sub.category.model')

module.exports = {
    createPcategory: async (req, res) => {
        try {
            await parent_Category.create(req.body)
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: 'Unsuccessfull!' })
        }
    },
    parenCategory: async (req, res) => {
        try {
            const data = await parent_Category.find({})
            res.json(data)
        } catch (error) {
            console.log(error.message);
        }
    },
    createScategory: async (req, res) => {
        try {
            const data = await sub_Category.create(req.body)
            if (data) res.json({ message: 'Unsuccessfull!' })
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: 'Unsuccessfull!' })
        }
    },
    showAllCategories: async (req, res) => {
        try {
            const data = await parent_Category.aggregate([
                {
                    $lookup: {
                        from: 'sub_categories', localField: '_id',
                        foreignField: 'parent_id', as: 'main_categories'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        parent_Category: { $first: '$category_name' },
                        sub_categories: { $addToSet: '$main_categories' }
                    }
                },
                { $unwind: '$sub_categories' }
            ])
            res.render('admin/product/category', { categories: data })
        } catch (error) {
            console.log(error.message);
        }
    },
    deleteParentCategory: async (req, res) => {
        try {
            const data = req.body;
            console.log(data);
            
        } catch (error) {
            console.log(error.message);
        }
    }
}