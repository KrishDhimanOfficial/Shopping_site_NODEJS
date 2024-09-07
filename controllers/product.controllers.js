const mongoose = require('mongoose')
const parent_Category = require('../Models/product_model/parent.category.model')
const sub_Category = require('../Models/product_model/sub.category.model')
const productSize = require('../Models/product_model/product.size.model')
const productColor = require('../Models/product_model/product.color.model')
const productBrand = require('../Models/product_model/product.brand.model')
const product = require('../Models/product_model/product.model')
const productQuery = require('../Service/query')
const deleteImage = require('../Service/deleteUploadImage')

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
            res.json({ message: 'Unsuccessfull!' || error.message })
        }
    },
    showAllCategories: async (req, res) => {
        try {
            const color = await productColor.find({})
            const size = await productSize.find({})
            const brand = await productBrand.find({})
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
            res.render('admin/product/category', {
                categories: data,
                sizes: size,
                brands: brand,
                colors: color,
            })
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
    createProduct: async (req, res) => {
        try {
            const { product_title, product_parent_category_id, product_sub_category_id,
                product_price, product_discount, product_stock,
                product_description, availableColor, availableSize,
                shipping, brand_name } = req.body;

            product_image = req.files.map(file => file.filename)
            date = new Date()
            const data = await product.create({
                product_title, product_parent_category_id,
                product_sub_category_id, date, product_price, product_discount,
                product_image, product_stock, shipping, brand_name,
                product_description: product_description[1],
                availableColor, availableSize
            })
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            res.json({ message: 'Unsuccessfull!' })
            console.log(error.message)
        }
    },
    getProductsOnAdmin: async (req, res) => {
        try {
            const data = await product.aggregate(productQuery)
            res.render('admin/product/index', { products: data })
        } catch (error) {
            console.log(error.message);
        }
    },
    updateProductPage: async (req, res) => {
        try {
            const color = await productColor.find({})
            const size = await productSize.find({})
            const category = await parent_Category.find({})
            const sub_category = await sub_Category.find({})
            const brand = await productBrand.find({})

            productQuery.push({ $match: { _id: new mongoose.Types.ObjectId(req.params.id) } })
            const productData = await product.aggregate(productQuery)

            res.render('admin/product/updateProduct', {
                product: productData,
                sizes: size,
                colors: color,
                brands: brand,
                parent_Categories: category,
                sub_categories: sub_category
            })
        } catch (error) {
            console.log(error.message);
        }
    },
    updateProduct: async (req, res) => {
        try {

            // await product.findByIdAndUpdate({ _id: req.params.id }, req.body)
            // throw new Error('Update Successfully!')
        } catch (error) {
            console.log(error.message)
            res.json({ message: error.message ?? 'Update Unsuccessfull!' })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const Image = await product.findOne({ _id: req.params.id })
            Image.product_image.map(image => deleteImage(image))
            await product.findByIdAndDelete({ _id: req.params.id })
            throw new Error('Successfully Deleted!')
        } catch (error) {
            console.log(error.message);
            res.json({ message: error.message })
        }
    },
    showProductAttributes: async (req, res) => {
        try {
            const color = await productColor.find({})
            const size = await productSize.find({})
            const category = await parent_Category.find({})
            const sub_category = await sub_Category.find({})
            const brand = await productBrand.find({})
            res.render('admin/product/create', {
                sizes: size,
                colors: color,
                brands: brand,
                parent_Categories: category,
                sub_categories: sub_category
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
                size_name: { $regex: req.body.size_name, $options: "i" }
            })
            if (existingSize) throw new Error('Already exists!')

            await productSize.create(req.body)
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    deleteSize: async (req, res) => {
        try {
            await productSize.findByIdAndDelete({ _id: req.params.id })
            res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log(error.message);
        }
    },
    deleteColor: async (req, res) => {
        try {
            await productColor.findByIdAndDelete({ _id: req.params.id })
            res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log(error.message);
        }
    },
    createBrand: async (req, res) => {
        try {
            const existingBrand = await productBrand.findOne({
                brand_name: { $regex: req.body.brand_name, $options: "i" }
            })
            if (existingBrand) throw new Error('Already exists!')

            await productBrand.create(req.body)
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    deleteBrand: async (req, res) => {
        try {
            await productBrand.findByIdAndDelete({ _id: req.params.id })
            res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log(error.message);
        }
    },
}