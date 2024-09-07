const express = require('express');
const router = express.Router();
const login = require('../Middleware/login')
const upload = require('../Middleware/multer.middleware')
const checkLogin = require('../Middleware/checkLogin')
const Admin = require('../controllers/admin.controllers')
const blogControllers = require('../controllers/blog.controller')
const productControllers = require('../controllers/product.controllers.js');

router.get('/dashboard', checkLogin, (req, res) => {
    res.render('admin/adminPanel')
})

router
    .get('/login', login, (req, res) => {
        res.render('admin/login')
    })
    .post('/login', Admin.handleAdminLogin)

router.get('/logout', Admin.handleAdminLogout)

// Post Routes
router.post('/api/createCategory', checkLogin, blogControllers.createCategory)
router.get('/blog/category', checkLogin, blogControllers.allPostsByCategory)
router.route('/blog/create')
    .all(checkLogin)
    .get(blogControllers.allCategories)
    .post(upload.single('blog_image'), blogControllers.createPost)

router.route('/update/blog')
    .all(checkLogin)
    .get(blogControllers.updateBlogPage)
    .put(upload.single('blog_image'), blogControllers.updateBlog)

router.get('/blogs', checkLogin, blogControllers.allPosts)
router.delete('/delete/blog/:id', checkLogin, blogControllers.deleteBlog)


// Product Routes   
router.route('/product/create')
    .all(checkLogin)
    .get(productControllers.showProductAttributes)
    .post(upload.array('product_image', 5), productControllers.createProduct)

router.get('/products', checkLogin, productControllers.getProductsOnAdmin)
router.route('/product/:id')
    .all(checkLogin)
    .get(productControllers.updateProductPage)
    .delete(productControllers.deleteProduct)
    .put(upload.array('product_image', 5), productControllers.updateProduct)

router.post('/api/sub_category', productControllers.createScategory)
router.route('/api/parent_category')
    .post(productControllers.createPcategory)
    .get(productControllers.parenCategory)
router.route('/product/category')
    .all(checkLogin)
    .get(productControllers.showAllCategories)

router.get('/product/category/delete/:id', checkLogin, productControllers.deleteParentCategory)
router.post('/api/attributes/color', checkLogin, productControllers.createColor)
router.delete('/api/attributes/color/:id', checkLogin, productControllers.deleteColor)
router.post('/api/attributes/size', checkLogin, productControllers.createSize)
router.delete('/api/attributes/size/:id', checkLogin, productControllers.deleteSize)
router.post('/api/attributes/brand', checkLogin, productControllers.createBrand)
router.delete('/api/attributes/brand/:id', checkLogin, productControllers.deleteBrand)

module.exports = router;