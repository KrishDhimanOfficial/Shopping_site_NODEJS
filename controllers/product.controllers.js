const mongoose = require('mongoose')
const parent_Category = require('../Models/product_model/parent.category.model')
const sub_Category = require('../Models/product_model/sub.category.model')
const productSize = require('../Models/product_model/product.size.model')
const productColor = require('../Models/product_model/product.color.model')
const productBrand = require('../Models/product_model/product.brand.model')
const product = require('../Models/product_model/product.model')
const queries = require('../Service/query')
const deleteImage = require('../Service/deleteUploadImage')

module.exports = {
    // Product Category Controllers
    createPcategory: async (req, res) => {
        try {
            const existingCategory = await parent_Category.findOne({
                category_name: { $regex: `^${req.body.category_name}$`, $options: "i" }
            })
            console.log(existingCategory);


            if (existingCategory) throw new Error('Already exists!')
            const { category_name, category_desc } = req.body;
            image = req.file ? req.file.filename : null;
            const data = await parent_Category.create({ category_name, image, category_desc })

            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log('createPcategory :' + error);
            res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    parenCategory: async (req, res) => {
        try {
            const data = await parent_Category.find({})
            res.json(data)
        } catch (error) {
            console.log('32' + error.message);
        }
    },
    createScategory: async (req, res) => {
        try {
            const existingCategory = await sub_Category.findOne({
                category_name: { $regex: `^${req.body.category_name}$`, $options: "i" }
            })

            if (existingCategory) { throw new Error('Already exists!') }
            await sub_Category.create(req.body)
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log('createScategory :' + error.message);
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
                        image: { $first: '$image' },
                        sub_categories: { $addToSet: '$main_categories' }
                    }
                },
                { $unwind: '$sub_categories' },
            ])
            res.render('admin/product/category', {
                categories: data,
                sizes: size,
                brands: brand,
                colors: color,
            })
        } catch (error) {
            console.log('76' + error.message);
        }
    },
    deleteParentCategory: async (req, res) => {
        try {
            const data = req.body;
        } catch (error) {
            console.log('83' + error.message);
        }
    },
    // Product Category Controllers
    // Product Attributes Controllers
    createProduct: async (req, res) => {
        try {
            const { product_title, product_parent_category_id, product_sub_category_id,
                product_price, product_discount, product_stock,
                product_description, availableColor, availableSize,
                shipping, brand_name, product_on_sales, product_new } = req.body;

            product_image = req.files.map(file => file.filename)

            date = new Date()
            await product.create({
                product_title, product_parent_category_id,
                product_sub_category_id, date, product_price, product_discount,
                product_image, product_stock, shipping, brand_name,
                product_description: product_description[1],
                availableColor, availableSize, product_on_sales, product_new
            })
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            res.json({ message: 'Unsuccessfull!' })
            console.log('createProduct :' + error.message);
        }
    },
    getProductsOnAdmin: async (req, res) => {
        try {
            const data = await product.aggregate(queries.productQuery)
            console.log(data);
            res.render('admin/product/index', { products: data })
        } catch (error) {
            console.log('getProductsOnAdmin :' + error.message);
        }
    },
    updateProductPage: async (req, res) => {
        try {
            const color = await productColor.find({})
            const size = await productSize.find({})
            const category = await parent_Category.find({})
            const sub_category = await sub_Category.find({})
            const brand = await productBrand.find({})

            queries.productQuery.push({ $match: { _id: new mongoose.Types.ObjectId(req.params.id) } })
            const productData = await product.aggregate(queries.productQuery)

            res.render('admin/product/updateProduct', {
                product: productData,
                sizes: size,
                colors: color,
                brands: brand,
                parent_Categories: category,
                sub_categories: sub_category
            })
        } catch (error) {
            console.log('updateProductPage :' + error);
        }
    },
    updateProduct: async (req, res) => {
        try {
            const existingImages = await product.findOne({ _id: req.params.id })
            const new_image = req.files.map(file => file?.filename)
            const updatedIMages = [...existingImages.product_image, ...new_image]

            await product.findByIdAndUpdate(
                { _id: req.params.id },
                { ...req.body, product_image: updatedIMages },
                { new: true })

            throw new Error('Update Successfully!')
        } catch (error) {
            console.log('156' + error.message);
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
            console.log('167' + error.message);
            res.json({ message: error.message })
        }
    },
    handlePreviewImage: async (req, res) => {
        try {
            const SingleProduct = await product.findOne({ _id: req.params.id })
            const previewImage = req.body;
            const result = SingleProduct.product_image.filter(img => img !== previewImage.image)
            await product.findByIdAndUpdate(
                { _id: req.params.id },
                { product_image: result }
            )
            deleteImage(previewImage.image)
        } catch (error) {
            console.log('182' + error.message);
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
            console.log('200' + error.message);
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
            console.log('214' + error.message);
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
            console.log('228' + error.message);
            res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    deleteSize: async (req, res) => {
        try {
            await productSize.findByIdAndDelete({ _id: req.params.id })
            res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log('237' + error.message);
        }
    },
    deleteColor: async (req, res) => {
        try {
            await productColor.findByIdAndDelete({ _id: req.params.id })
            res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log('245' + error.message);
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
            console.log('258' + error.message);
            res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    deleteBrand: async (req, res) => {
        try {
            await productBrand.findByIdAndDelete({ _id: req.params.id })
            res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log('267' + error.message);
        }
    },
    getProductByCategory: async (req, res) => {
        try {
            const product_categories = await parent_Category.aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'product_parent_category_id',
                        as: 'product'
                    }
                },
                { $addFields: { length: { $size: '$product' } } },
                { $project: { product: 0 } }
            ])
            console.log(product_categories);

            const products = await product.aggregate(queries.productQuery)

            res.render('site/home', {
                products, product_categories
            })
        } catch (error) {
            console.log('getProductByCategory : ' + error.message);

        }
    }
}