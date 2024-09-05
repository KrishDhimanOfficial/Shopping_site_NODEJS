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
router.get('/product', checkLogin, (req, res) => {
    res.render('admin/product/index')
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
router.get('/delete/blog/:id', checkLogin, blogControllers.deleteBlog)


// Product Routes   
router.get('/product/create', checkLogin, productControllers.showProductAttributes)
router.route('/api/parent_category')
    .post(productControllers.createPcategory)
    .get(productControllers.parenCategory)

router.post('/api/sub_category', productControllers.createScategory)
router.route('/product/category')
    .all(checkLogin)
    .get(productControllers.showAllCategories)
router.get('/product/category/delete/:id', checkLogin, productControllers.deleteParentCategory)

router.post('/api/attributes/color', checkLogin, productControllers.createColor)
router.post('/api/attributes/size', checkLogin, productControllers.createSize)

module.exports = router;