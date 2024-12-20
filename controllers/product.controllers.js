const mongoose = require('mongoose')
const parent_Category = require('../Models/product_model/parent.category.model')
const sub_Category = require('../Models/product_model/sub.category.model')
const productSize = require('../Models/product_model/product.size.model')
const productColor = require('../Models/product_model/product.color.model')
const productBrand = require('../Models/product_model/product.brand.model')
const product = require('../Models/product_model/product.model')
const product_Cart = require('../Models/product_model/addToCart.model')
const order = require('../Models/product_model/order.model')
const userModel = require('../Models/user.model')
const queries = require('../Service/query')
const { getUser } = require('../Service/auth')
const handleAggregatePagination = require('../Service/handlepagePagination')
const deleteImage = require('../Service/deleteUploadImage')
const transporter = require('../Service/mailTransporter')
const Razorpay = require('razorpay')
const crypto = require("crypto")


module.exports = {
    // Product Category Controllers
    createPcategory: async (req, res) => {
        try {
            const existingCategory = await parent_Category.findOne({
                category_name: { $regex: `^${req.body.category_name}$`, $options: "i" }
            })

            if (existingCategory) throw new Error('Already exists!')
            const { category_name, category_desc } = req.body;
            image = req.file ? req.file.filename : null;
            await parent_Category.create({ category_name, image, category_desc })

            return res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log('createPcategory :' + error);
            return res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    parenCategory: async (req, res) => {
        try {
            const data = await parent_Category.find({})
            return res.json(data)
        } catch (error) {
            console.log('parenCategory : ' + error.message);
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
            return res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log('createScategory :' + error.message);
            return res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    getsubcategory: async (req, res) => {
        try {
            const sub_categories = await sub_Category.find({})
            const data = await productBrand.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
                },
                {
                    $lookup: {
                        from: 'sub_categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'sub_categories'
                    }
                },
                {
                    $project: {
                        sub_categories: 1, brand_name: 1
                    }
                }
            ])
            return res.status(200).json({ sub_categories, selectedcategories: data })
        } catch (error) {
            console.log('getsubcategory :' + error.message)
        }
    },
    showAllCategories: async (req, res) => {
        try {
            const color = await productColor.find({})
            const size = await productSize.find({})
            const sub_categories = await sub_Category.find({})
            const findEditBrandId = await productBrand.findOne({ _id: req.params.id })
            const brand = await productBrand.find({})
            const products = await product.aggregate([{ $project: { brand_name: 1, _id: 0 } }])
            const data = await parent_Category.aggregate([
                {
                    $lookup: {
                        from: 'sub_categories', localField: '_id',
                        foreignField: 'parent_id', as: 'sub_categories'
                    }
                },
            ])
            return res.render('admin/product/category', {
                categories: data,
                sizes: size,
                brands: brand,
                colors: color,
                products,
                sub_categories,
                findEditBrandId
            })
        } catch (error) {
            console.log('showAllCategories :' + error.message);
        }
    },
    deleteParentCategory: async (req, res) => {
        try {
            const data = await parent_Category.findByIdAndDelete({ _id: req.params.id })
            if (!data) res.json({ message: 'Unsuccessfully' })
            deleteImage(`/categoryImages/${data.image}`)
            return res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log('deleteParentCategory : ' + error.message);
        }
    },
    // Product Category Controllers
    // Product Attributes Controllers
    createProduct: async (req, res) => {
        try {
            const { product_title, product_parent_category_id, product_sub_category_id,
                product_price, product_discount, product_stock, discounted_price,
                product_slug, product_description, availableColor, availableSize,
                shipping, brand_name, product_on_sales, product_new } = req.body;

            const product_image = req.files['product_image']?.map(file => file.filename)
            const featured_image = req.files['featured_image'][0].filename
            const date = new Date()
            const data = await product.create({
                product_title, product_parent_category_id, featured_image,
                discounted_price, product_slug, product_sub_category_id, date,
                product_price, product_discount, product_stock, product_image,
                shipping, brand_name, product_description: product_description[1],
                availableColor, availableSize, product_on_sales, product_new
            })
            if (!data) {
                product_image?.map(file => deleteImage(`productImages/${file.filename}`))
                deleteImage(`productImages/${featured_image}`)
            }
            return res.json({ message: 'Successfully Created!' })
        } catch (error) {
            res.json({ message: 'Unsuccessfull!' })
            req.files['product_image']?.map(file => deleteImage(`productImages/${file.filename}`))
            if (req.files['featured_image'] != undefined) deleteImage(`productImages/${req.files['featured_image'][0].filename}`)
            console.log('createProduct :' + error.message);
        }
    },
    getProductsOnAdmin: async (req, res) => {
        try {
            const data = await product.aggregate([
                {
                    $lookup: {
                        from: 'parent_categories',
                        localField: 'product_parent_category_id',
                        foreignField: '_id',
                        as: 'parent_category',
                    }
                },
                { $unwind: '$parent_category' },
                { $project: { product_title: 1, parent_category: 1, featured_image: 1, date: 1 } }
            ])
            const getorder = await order.find({}, { items: 1 })
            if (data.length == 0 || !data) return res.render('admin/product/index', { message: 'NOT FOUND' })
            return res.render('admin/product/index', { products: data, getorder })
        } catch (error) {
            console.log('getProductsOnAdmin :' + error.message);
        }
    },
    updateProductPage: async (req, res) => {
        try {
            const pid = req.params.id.length === 24 ? req.params.id : '';
            const productData = await product.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(pid) } },
                {
                    $lookup: {
                        from: 'productcolors', localField: 'availableColor',
                        foreignField: '_id', as: 'colorDetails',
                    }
                },
                {
                    $lookup: {
                        from: 'productsizes', localField: 'availableSize',
                        foreignField: '_id', as: 'sizeDetails',
                    }
                },
                {
                    $lookup: {
                        from: 'parent_categories', localField: 'product_parent_category_id',
                        foreignField: '_id', as: 'parent_category',
                    }
                },
                { $unwind: '$parent_category' },
                {
                    $lookup: {
                        from: 'sub_categories', localField: 'product_sub_category_id',
                        foreignField: '_id', as: 'sub_category',
                    }
                },
                { $unwind: '$sub_category' },
                {
                    $lookup: {
                        from: 'productbrands', localField: 'brand_name',
                        foreignField: '_id', as: 'brand',
                    }
                },
                { $unwind: '$brand' }
            ])
            const [color, size, category] = await Promise.all([
                productColor.find({}),
                productSize.find({}),
                parent_Category.find({}),
            ])
            return res.render('admin/product/updateProduct', {
                product: productData, sizes: size,
                colors: color, parent_Categories: category,
            })
        } catch (error) {
            console.log('updateProductPage :' + error);
        }
    },
    updateProduct: async (req, res) => {
        try {
            const existingImages = await product.findOne({ _id: req.params.id })
            const new_images = req.files['product_image'] ? req.files['product_image']?.map(file => file.filename) : ''
            const featured_image = req.files['featured_image'] ? req.files['featured_image'][0].filename : existingImages.featured_image

            const updatedImage = [...existingImages.product_image, ...new_images]
            const data = await product.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    ...req.body,
                    product_image: updatedImage, featured_image,
                    product_description: req.body.product_description[0]
                },
                { new: true })
            if (!data) req.files['product_image']?.map(file => deleteImage(`productImages/${file.filename}`))
            throw new Error('Update Successfully!')
        } catch (error) {
            if (error.message != 'Update Successfully!') req.files['product_image']?.map(file => deleteImage(`productImages/${file.filename}`))
            console.log('updateProduct :' + error.message);
            return res.json({ message: error.message ?? 'Update Unsuccessfull!' })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const Image = await product.findOne({ _id: req.params.id })
            Image.featured_image
            deleteImage(`productImages/${Image.featured_image}`)
            Image.product_image.map(image => deleteImage(`productImages/${image}`))
            await product.findByIdAndDelete({ _id: req.params.id })
            throw new Error('Successfully Deleted!')
        } catch (error) {
            console.log('deleteProduct :' + error.message);
            return res.json({ message: error.message })
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
            deleteImage(`productImages/${previewImage.image}`)
        } catch (error) {
            console.log('handlePreviewImage :' + error.message);
        }
    },
    showsubcategory: async (req, res) => {
        try {
            const sub_category = await sub_Category.find({})
            return res.status(200).json(sub_category)
        } catch (error) {
            console.log('showsubcategory :' + error.message)
        }
    },
    showProductAttributes: async (req, res) => {
        try {
            const color = await productColor.find({})
            const size = await productSize.find({})
            const category = await parent_Category.find({})
            const sub_category = await sub_Category.find({})
            const brand = await productBrand.find({})
            return res.render('admin/product/create', {
                sizes: size,
                colors: color,
                brands: brand,
                parent_Categories: category,
                sub_categories: sub_category
            })
        } catch (error) {
            console.log('showProductAttributes : ' + error.message);
        }
    },
    createColor: async (req, res) => {
        try {
            const existingColor = await productColor.findOne({
                color_name: { $regex: req.body.color_name, $options: "i" }
            })
            if (existingColor) throw new Error('Already exists!')

            await productColor.create(req.body)
            return res.json({ message: 'Successfully Created!' })

        } catch (error) {
            console.log('createColor : ' + error.message);
            return res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    createSize: async (req, res) => {
        try {
            const existingSize = await productSize.findOne({
                size_name: { $regex: req.body.size_name, $options: "i" }
            })
            if (existingSize) throw new Error('Already exists!')

            await productSize.create(req.body)
            return res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log('createSize : ' + error.message);
            return res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    deleteSize: async (req, res) => {
        try {
            await productSize.findByIdAndDelete({ _id: req.params.id })
            return res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log('deleteSize' + error.message);
        }
    },
    deleteColor: async (req, res) => {
        try {
            await productColor.findByIdAndDelete({ _id: req.params.id })
            return res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log('deleteColor' + error.message);
        }
    },
    createBrand: async (req, res) => {
        try {
            const category_id = req.body.info.category_id.map(id => new mongoose.Types.ObjectId(id))
            const existingBrand = await productBrand.findOne({
                brand_name: { $regex: req.body.info.brand_name, $options: "i" }
            })
            if (existingBrand) throw new Error('Already exists!')
            await productBrand.create({
                brand_name: req.body.info.brand_name,
                category_id
            })
            return res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log('createBrand : ' + error.message);
            return res.json({ message: error.message ?? 'Unsuccessfull!' })
        }
    },
    updatebrand: async (req, res) => {
        try {
            const category_id = req.body.info.category_id.map(id => new mongoose.Types.ObjectId(id))
            await productBrand.findByIdAndUpdate({ _id: req.params.id },
                { brand_name: req.body.info.brand_name, category_id })
            return res.status(200).json({ message: 'Successfull!' })
        } catch (error) {
            console.log('updatebrand : ' + error.message)
        }
    },
    getBrandsapi: async (req, res) => {
        try {
            const data = await productBrand.find({})
            return res.status(200).json(data)
        } catch (error) {
            console.log('getBrandsapi : ' + error.message)
        }
    },
    deleteBrand: async (req, res) => {
        try {
            await productBrand.findByIdAndDelete({ _id: req.params.id })
            return res.json({ message: 'Successfully Deleted!' })
        } catch (error) {
            console.log('deleteBrand : ' + error.message);
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
            return res.render('site/home', {
                products, product_categories,
                route: req.path
            })
        } catch (error) {
            console.log('getProductByCategory : ' + error.message)
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
            const projection = ([
                {
                    $match: {
                        category_name: {
                            $regex: new RegExp(`^${req.params.parent_name}$`, 'i')
                        }
                    }
                },
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
                        image: 0, category_desc: 0, _id: 0,
                    }
                }
            ])
            const products = await handleAggregatePagination(parent_Category, projection, req.params)
            return res.render('site/shop', { products, categories, colors, sizes, route: req.path })
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
                { $match: { status: true } }, {
                    $project: {
                        product_title: 1, product_image: 1, product_on_sales: 1, product_new: 1,
                        product_discount: 1, featured_image: 1, product_slug: 1, discounted_price: 1,
                        product_price: 1
                    }
                }]
            const allProducts = await handleAggregatePagination(product, projection, req.params)
            return res.render('site/shop', { allProducts, categories, colors, sizes, route: req.path })
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
                {
                    $lookup: {
                        from: 'parent_categories',
                        localField: 'product_parent_category_id',
                        foreignField: '_id',
                        as: 'parent_category',
                    }
                },
                { $unwind: '$parent_category' },
                {
                    $match: {
                        'parent_category.category_name': {
                            $regex: req.params.parent_category,
                            $options: 'i'
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'sub_categories',
                        localField: 'product_sub_category_id',
                        foreignField: '_id',
                        as: 'sub_category',
                    }
                },
                { $unwind: '$sub_category' },
                {
                    $match: {
                        'sub_category.category_name': {
                            $regex: req.params.sub_category,
                            $options: 'i'
                        }
                    }
                },
                {
                    $project: {
                        sub_category: 0, parent_category: 0
                    }
                }
            ]

            const sub_category_products = await handleAggregatePagination(product, projection, req.params)
            return res.render('site/shop', { sub_category_products, colors, sizes, categories, route: req.path })
        } catch (error) {
            console.log('getSub_categoryProduct :' + error.message);
        }
    },
    getSingleProductDetails: async (req, res) => {
        try {
            const relatedProducts = await product.find({}).limit(4)
            const products = await product.find({})
            const checkSlug = products.filter(product => product.product_slug == req.params.slug)
            if (checkSlug.length == 0) res.status(404).render('Site_partials/404')

            const singleProduct = await product.aggregate([
                { $match: { product_slug: req.params.slug } },
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
                        discounted_price: 1, product_description: 1
                    }
                }
            ])
            return res.render('site/productDetails', { singleProduct, relatedProducts })
        } catch (error) {
            if (error.message) return res.status(404).render('Site_partials/404')
            console.log('getSingleProductDetails :' + error.message);
        }
    },
    singleproductonCart: async (req, res) => {
        try {
            const singleProduct = await product.findOne({ _id: req.params.id })
            if (!singleProduct) return res.json({ message: "NOT FOUND" })
            return res.json(singleProduct)
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
            if (!user) res.redirect('/login')
            const pid = new mongoose.Types.ObjectId(req.body.product_cart.product_details.pid)
            const quantity = req.body.product_cart.product_details.quantity;

            const userShoppingCart = await product_Cart.findOne({ username: user.username })
            const existingpId = userShoppingCart.product_cart.filter(id => id.product_details.pid.equals(pid))

            if (existingpId == '') {
                const Updatedcart = [...userShoppingCart.product_cart, {
                    product_details: {
                        pid: pid,
                        quantity: quantity
                    }
                }]

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
            const user = getUser(req.cookies.token)
            const productid = new mongoose.Types.ObjectId(req.params.id)
            const { price, quantity, total } = req.body.product_details;
            const { grandTotal } = req.body;

            await product_Cart.findOneAndUpdate({
                username: user.username,
                "product_cart.product_details.pid": productid
            },
                {
                    $set: {
                        "product_cart.$.product_details": {
                            pid: productid, price, quantity, total
                        },
                        grandTotal
                    },
                },
                { new: true })
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
                }
            ])
            return res.render('site/shop-cart', { products: data })
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
    },
    getCartLength: async (req, res) => {
        try {
            const user = getUser(req.cookies.token)
            const cart = await product_Cart.findOne({ username: user.username })
            return res.status(200).json(cart?.product_cart.length)
        } catch (error) {
            console.log('getCartLength :' + error.message);
        }
    },
    getcartdetails: async (req, res) => {
        try {
            const user = getUser(req.cookies.token)
            const userDetails = await userModel.find({ username: user.username })
            const data = await product_Cart.aggregate([
                {
                    $match: { username: user.username }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product_cart.product_details.pid',
                        foreignField: '_id',
                        as: 'cartproduct'
                    }
                }
            ])
            return res.render('site/checkout', { products: data[0], grandTotal: data[0].grandTotal, userDetails })
        } catch (error) {
            console.log('getcartdetails :' + error.message);
        }
    },
    order: async (req, res) => {
        try {
            const razorpay = new Razorpay({
                key_id: process.env.RazorpayID,
                key_secret: process.env.RazorpayKEY
            })
            const options = req.body;
            const order = await razorpay.orders.create(options)

            if (!order) return res.status(500).json('Error')
            return res.status(200).json(order)
        } catch (error) {
            console.log('orders : ' + error.message)
        }
    },
    validateOrder: async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            const hmac = crypto.createHmac('sha256', process.env.RazorpayKEY)
            hmac.update(razorpay_order_id + "|" + razorpay_payment_id)
            const generatedSignature = hmac.digest('hex')

            if (generatedSignature === razorpay_signature) {
                const { razorpay_order_id, razorpay_payment_id, contact, shippingAddress,
                    userId, order_note, totalAmount } = req.body;

                const items = []
                for (let i = 0; i < req.body.items.length; ++i) {
                    let obj = {
                        pid: new mongoose.Types.ObjectId(req.body.items[i].pid),
                        quantity: req.body.items[i].quantity
                    }
                    items.push(obj)
                }
                await order.create({
                    razorpay_order_id, razorpay_payment_id, contact, shippingAddress,
                    userId, order_note, totalAmount, items, createdAt: new Date()
                })
                return res.status(200).json({ message: "Payment is successful" })
            } else {
                return res.status(200).json({ message: "Payment verification failed" })
            }
        } catch (error) {
            console.log('validateOrder :' + error.message)
        }
    },
    sendConfirmedOrderEmail: async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id } = req.body;

            const mailOptions = {
                from: process.env.USER,
                to: 'dhimany149@gmail.com',
                subject: 'Confirmed Order',
                text: `${razorpay_order_id},${razorpay_payment_id}`
            }
            await transporter.sendMail(mailOptions)
        } catch (error) {
            console.log('sendConfirmedOrderEmail : ' + error.message)
        }
    },
    getOrders: async (req, res) => {
        try {
            const data = await order.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: '$userDetails'
                },
                {
                    $project: {
                        'userDetails.username': 1,
                        shippingAddress: 1,
                        status: 1,
                        totalAmount: 1,
                        formattedDate: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        }
                    }
                }
            ])
            return res.render('admin/product/orders', { orders: data })
        } catch (error) {
            console.log('getOrders : ' + error.message);
        }
    },
    getorderDetails: async (req, res) => {
        try {
            queries.getOrderData.push({ $match: { _id: new mongoose.Types.ObjectId(req.params.id) } })
            const data = await order.aggregate(queries.getOrderData)
            if (!data) res.render('partials/404')
            return res.render('admin/product/singleOrderDetails', { orderDetails: data })
        } catch (error) {
            console.log('getorderDetais : ' + error.message)
        }
    },
    updateOrderStatus: async (req, res) => {
        try {
            const data = await order.findByIdAndUpdate({ _id: req.params.id }, { status: req.body.status })
            if (!data) res.json({ message: 'Unsuccessful!' })
            return res.json({ message: 'updated!' })
        } catch (error) {
            console.log('updateOrderStatus :' + error.message);
        }
    },
    getuserOrders: async (req, res) => {
        try {
            const userToken = getUser(req.cookies.token)
            const user = await userModel.findOne({ username: userToken.username })
            const projection = [
                {
                    $match: { userId: user._id }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'items.pid',
                        foreignField: '_id',
                        as: 'products'
                    }
                },
                {
                    $project: {
                        'products.product_new': 0,
                        'products.product_on_sales': 0,
                        'products.product_description': 0,
                        'products.availableColor': 0,
                        'products.availableSize': 0,
                        'products.product_sub_category_id': 0,
                        'products.product_parent_category_id': 0,
                        'products.product_stock': 0,
                        'products.brand_name': 0
                    }
                }
            ]
            const userOrder = await handleAggregatePagination(order, projection, req.params)
            return res.render('site/UserAccount', { userorderDetails: userOrder })
        } catch (error) {
            console.log('getuserOrders : ' + error.message)
        }
    },
    getpriceRangeProducts: async (req, res) => {
        try {
            const obj = req.body;
            if (obj.minamount || obj.maxamount) {
                const priceFilter = await product.aggregate([{
                    $match: {
                        product_price: { $gte: parseInt(obj.minamount), $lte: parseInt(obj.maxamount) }
                    }
                }])
                return res.status(200).json({ products: priceFilter })
            }
        } catch (error) {
            console.log('getpriceRangeProducts :' + error.message);
        }
    },
    getfilterProducts: async (req, res) => {
        try {
            const obj = req.body;

            if (obj.colorArray?.length > 0) {
                const priceFilter = await product.aggregate([{ $match: { product_price: { $gte: parseInt(obj.minamount), $lte: parseInt(obj.maxamount) } } }])

                const colorFilter = priceFilter.filter(item => {
                    return item.availableColor.some(colorId => obj.colorArray.includes(colorId.toString()))
                })

                if (obj.sizeArray?.length > 0) {
                    const sizeColorFilter = colorFilter.filter(item => {
                        return item.availableSize.some(sizeId => obj.sizeArray.includes(sizeId.toString()))
                    })
                    res.status(200).json({ products: sizeColorFilter })
                }
                res.status(200).json({ products: colorFilter })
            }

            if (obj.sizeArray?.length > 0) {
                const priceFilter = await product.aggregate([{ $match: { product_discount: { $gte: parseInt(obj.minamount), $lte: parseInt(obj.maxamount) } } }])

                const sizeFilter = priceFilter.filter(item => {
                    return item.availableSize.some(sizeId => obj.sizeArray.includes(sizeId.toString()))
                })

                if (obj.colorArray?.length > 0) {
                    const colorSizeFilter = sizeFilter.filter(item => {
                        return item.availableColor.some(colorId => obj.colorArray.includes(colorId.toString()))
                    })
                    res.status(200).json({ products: colorSizeFilter })
                }
                res.status(200).json({ products: sizeFilter })
            }
        } catch (error) {
            console.log('getfilterProducts : ' + error.message);
        }
    }
}