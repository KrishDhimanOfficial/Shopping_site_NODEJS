const parent_Category = require('../Models/product_model/parent.category.model')
const sub_Category = require('../Models/product_model/sub.category.model')
const productSize = require('../Models/product_model/product.size.model')
const productColor = require('../Models/product_model/product.color.model')

module.exports = {
    // Product Category Controllers
    createPcategory: async (req, res) => {
        try {
            const existingCategory = parent_Category.findOne({
                category_name: { $regex: req.body.category_name, $options: "i" }
            })
            if (existingCategory) throw new Error('Already exists!')

            await parent_Category.create(req.body)
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: error.message ?? 'Unsuccessfull!' })
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
            const existingCategory = sub_Category.findOne({
                category_name: { $regex: req.body.category_name, $options: "i" }
            })
            if (existingCategory) { throw new Error('Already exists!') }
            await sub_Category.create(req.body)
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: error.message ?? 'Unsuccessfull!' })
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
        } catch (error) {
            console.log(error.message);
        }
    },
    // Product Category Controllers
    // Product Attributes Controllers
    showProductAttributes: async (req, res) => {
        try {
            const color = await productColor.find({})
            const size = await productSize.find({})
            res.render('admin/product/create',{
                sizes: size,
                colors: color
            })
        } catch (error) {
            console.log(error.message);
        }
    },
    createColor: async (req, res) => {
        try {
            const existingColor = await productColor.findOne({
                color_name: { $regex: req.body.color_name, $options: "i" }
            })
            if (existingColor) throw new Error('Already exists!')

            await productColor.create(req.body)
            res.json({ message: 'Successfully Created!' })

        } catch (error) {
            console.log(error.message);
            res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    createSize: async (req, res) => {
        try {
            const existingSize = await productSize.findOne({
                size_name_name: { $regex: req.body.size_name, $options: "i" }
            })
            if (existingSize) throw new Error('Already exists!')

            await productSize.create(req.body)
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    }
}