const mongoose = require('mongoose')
const parent_Category = require('../Models/product_model/parent.category.model')
const sub_Category = require('../Models/product_model/sub.category.model')
const productSize = require('../Models/product_model/product.size.model')
const productColor = require('../Models/product_model/product.color.model')
const productBrand = require('../Models/product_model/product.brand.model')
const product = require('../Models/product_model/product.model')
const product_Cart = require('../Models/product_model/addToCart.model')
const queries = require('../Service/query')
const { getUser } = require('../Service/auth')
const handleAggregatePagination = require('../Service/handlepagePagination')
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
            if (existingCategory) {
                const existing = [...existingCategory.parent_id, req.body.parent_id]
                await sub_Category.updateOne({
                    category_name: { $regex: `^${req.body.category_name}$`, $options: "i" }
                }, { parent_id: existing })
            } else {
                await sub_Category.create(req.body)
            }
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log('createScategory :' + error.message);
            res.json({ message: error.message ?? 'Unsuccessfull!' })
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
                        foreignField: 'parent_id', as: 'sub_categories'
                    }
                },
            ])
            res.render('admin/product/category', {
                categories: data,
                sizes: size,
                brands: brand,
                colors: color,
            })
        } catch (error) {
            console.log('showAllCategories :' + error.message);
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
            console.log('updateProduct :' + error.message);
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
            console.log('deleteProduct :' + error.message);
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
            console.log('handlePreviewImage :' + error.message);
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

            const products = await product.aggregate(queries.productQuery).limit(8)

            res.render('site/home', {
                products, product_categories
            })
        } catch (error) {
            console.log('getProductByCategory : ' + error.message);

        }
    },
    getProductByCategoryonShop: async (req, res) => {
        try {
            const colors = await productColor.find({})
            const sizes = await productSize.find({})
            const categories = await parent_Category.aggregate([
                {
                    $lookup: {
                        from: 'sub_categories',
                        localField: '_id',
                        foreignField: 'parent_id',
                        as: 'sub'
                    }
                },
                { $project: { category_name: 1, sub: 1 } }
            ])

            const projection = [
                { $match: { category_name: { $regex: req.params.name, $options: 'i' } } },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'product_parent_category_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        image: 0, category_desc: 0
                    }
                }
            ]
            const products = await handleAggregatePagination(parent_Category, projection, req.params)
            res.render('site/shop', { products, categories, colors, sizes })
        } catch (error) {
            console.log('getProductByCategoryonShop :' + error.message);
        }
    },
    showAllproducts: async (req, res) => {
        try {
            const colors = await productColor.find({})
            const sizes = await productSize.find({})
            const categories = await parent_Category.aggregate([
                {
                    $lookup: {
                        from: 'sub_categories',
                        localField: '_id',
                        foreignField: 'parent_id',
                        as: 'sub'
                    }
                },
                { $project: { category_name: 1, sub: 1 } }
            ])

            const projection = [
                {
                    $project: {
                        product_title: 1, product_image: 1, product_on_sales: 1, product_new: 1,
                        product_price: 1
                    }
                }
            ]
            const allProducts = await handleAggregatePagination(product, projection, req.params)
            res.render('site/shop', { allProducts, categories, colors, sizes })
        } catch (error) {
            console.log('showAllproducts :' + error.message);
        }
    },
    getSub_categoryProduct: async (req, res) => {
        try {
            const colors = await productColor.find({})
            const sizes = await productSize.find({})
            const categories = await parent_Category.aggregate([
                {
                    $lookup: {
                        from: 'sub_categories',
                        localField: '_id',
                        foreignField: 'parent_id',
                        as: 'sub'
                    }
                },
                { $project: { category_name: 1, sub: 1 } }
            ])
            const projection = [
                { $match: { category_name: { $regex: req.params.parent_category, $options: 'i' } } },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'product_parent_category_id',
                        as: 'product'
                    }
                },
                {
                    $addFields: {
                        sub_category_products: {
                            $filter: {
                                input: "$product",
                                cond: {
                                    $eq: [
                                        '$$this.product_sub_category_id',
                                        new mongoose.Types.ObjectId(req.params.id)
                                    ]
                                }
                            }
                        },
                    }
                },
                { $project: { sub: 0, product: 0, image: 0, category_desc: 0, _id: 0 } }
            ]

            const sub_category_products = await handleAggregatePagination(parent_Category, projection, req.params)
            res.render('site/shop', { sub_category_products, colors, sizes, categories })
        } catch (error) {
            console.log('getSub_categoryProduct :' + error.message);
        }
    },
    getSingleProductDetails: async (req, res) => {
        try {
            const singleProduct = await product.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
                {
                    $lookup: {
                        from: 'productcolors',
                        localField: 'availableColor',
                        foreignField: '_id',
                        as: 'colors',
                    }
                },
                {
                    $lookup: {
                        from: 'productsizes',
                        localField: 'availableSize',
                        foreignField: '_id',
                        as: 'sizeDetails',
                    }
                },
                {
                    $lookup: {
                        from: 'productbrands',
                        localField: 'brand_name',
                        foreignField: '_id',
                        as: 'brand',
                    }
                },
                { $unwind: '$brand' },
                {
                    $project: {
                        product_title: 1, product_price: 1, product_discount: 1, product_image: 1,
                        sizeDetails: 1, brand: 1, colors: 1, product_stock: 1, shipping: 1,
                        product_description: 1
                    }
                }
            ])
            res.render('site/productDetails', { singleProduct })
        } catch (error) {
            console.log('getSingleProductDetails :' + error.message);
        }
    },
    singleproductonCart: async (req, res) => {
        try {
            const singleProduct = await product.findOne({ _id: req.params.id })
            if (!singleProduct) res.json({ message: "NOT FOUND" })
            res.json(singleProduct)
        } catch (error) {
            console.log('singleproductonCart' + error.message);
        }
    },
    updateProductRating: async (req, res) => {
        try {
            await product.findByIdAndUpdate({ _id: req.params.id }, req.body)
        } catch (error) {
            console.log('updateProductRating : ' + error.message);
        }
    },
    productcart: async (req, res) => {
        try {
            const user = getUser(req.cookies.token)
            const pid = new mongoose.Types.ObjectId(req.body.product_cart.product_details.pid)
            const userShoppingCart = await product_Cart.findOne({ username: user.username })
            const Updatedcart = [...userShoppingCart.product_cart, { product_details: { pid: pid } }]

            if (userShoppingCart) {
                await product_Cart.updateOne(
                    { username: user.username },
                    { product_cart: Updatedcart })
            }
        } catch (error) {
            console.log('productcart : ' + error.message);
        }
    },
    updatecart: async (req, res) => {
        try {
            const productid = new mongoose.Types.ObjectId(req.params.id)
            const { price, quantity, total } = req.body.product_details;
            const { grandTotal } = req.body;
            await product_Cart.findOneAndUpdate(
                { "product_cart.product_details.pid": productid },
                {
                    $set: {
                        "product_cart.$.product_details": { pid: productid, price, quantity, total },
                    },
                    $set: { grandTotal }
                },
                { new: true }
            )
        } catch (error) {
            console.log('updatecart : ' + error.message);
        }
    },
    getProductonAddtoCart: async (req, res) => {
        try {
            const user = getUser(req.cookies.token)
            const data = await product_Cart.aggregate([
                { $match: { username: user.username } },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product_cart.product_details.pid',
                        foreignField: '_id',
                        as: 'cartproduct'
                    }
                },
            ])
            res.render('site/shop-cart', { products: data })
        } catch (error) {
            console.log('getProductAddtoCart : ' + error.message);
        }
    },
    deleteShoppingcartOptions: async (req, res) => {
        try {
            const user = getUser(req.cookies.token)
            const req_id = new mongoose.Types.ObjectId(req.params.id);
            const userShoppingCart = await product_Cart.findOne({ username: user.username })

            const new_cart = userShoppingCart.product_cart.filter(cart => !cart.product_details.pid.equals(req_id))
            await product_Cart.updateOne(
                { username: user.username },
                { $set: { product_cart: new_cart } }
            )
        } catch (error) {
            console.log('deleteShoppingcartOptions : ' + error.message);
        }
    }
}