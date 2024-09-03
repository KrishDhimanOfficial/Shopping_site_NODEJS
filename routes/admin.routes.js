const express = require('express');
const router = express.Router();
const login = require('../Middleware/login')
const upload = require('../Middleware/multer.middleware')
const checkLogin = require('../Middleware/checkLogin')
const Admin = require('../controllers/admin.controllers')
const blogControllers = require('../controllers/blog.controller')
const productControllers = require('../controllers/product.controllers.js')

router.get('/dashboard', checkLogin, (req, res) => {
    res.render('admin/adminPanel')
})
router.get('/product', checkLogin, (req, res) => {
    res.render('admin/product/index')
})
router.get('/create', checkLogin, (req, res) => {
    res.render('admin/product/create')
})
router.get('/category', checkLogin, (req, res) => {
    res.render('admin/product/category')
})
router.get('/blog/category', checkLogin, (req, res) => {
    res.render('admin/blog/blogCategory')
})


router
    .get('/login', login, (req, res) => {
        res.render('admin/login')
    })
    .post('/login', Admin.handleAdminLogin)

router.get('/logout', Admin.handleAdminLogout)


router.get('/blogs', checkLogin, blogControllers.allPosts)
router.route('/blog/create')
    .all(checkLogin)
    .get(blogControllers.allCategories)
    .post(upload.single('blog_image'), blogControllers.createPost)




router.get('/update/blog/:id', checkLogin, blogControllers.updateBlog)
router.get('/delete/blog/:id', checkLogin, blogControllers.deleteBlog)


// Product Routes   
router.route('/api/parent_category')
    .post(productControllers.createPcategory)
    .get(productControllers.parenCategory)

router.post('/api/sub_category', productControllers.createScategory)

module.exports = router;