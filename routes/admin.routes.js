const express = require('express');
const router = express.Router();
const login = require('../Middleware/login')
const { blogImageupload, productImageupload, categoryImageupload } = require('../Middleware/multer.js')
const checkLogin = require('../Middleware/checkLogin')
const Admin = require('../controllers/admin.controllers')
const blogControllers = require('../controllers/blog.controller')
const productControllers = require('../controllers/product.controllers.js');
const usersControllers = require('../controllers/users.controllers.js');

router.get('/dashboard', checkLogin, (req, res) => {
    res.render('admin/adminPanel')
})

router
    .get('/login', login, (req, res) => {
        res.render('admin/login')
    })
    .post('/login', Admin.handleAdminLogin)

router.get('/logout', Admin.handleAdminLogout)


// To Get Blog Category AND Perform Update Delete Operation
router.route('/blog/category/:id?')
    .all(checkLogin)
    .post(blogControllers.createCategory)
    .get(blogControllers.allPostsAttributes)
    .delete(blogControllers.deletePostCategory)
    .put(blogControllers.updatePostCategory)

// To Get Blog Tag AND Perform Update Delete Operation
router.route('/blog/tag/:id?')
    .all(checkLogin)
    .post(blogControllers.createTag)
    .put(blogControllers.updateTag)
    .delete(blogControllers.deleteTag)

router.route('/blog/create')
    .all(checkLogin)
    .get(blogControllers.getAttributes)
    .post(blogImageupload.single('blog_image'), blogControllers.createPost)

router.route('/update/blog')
    .all(checkLogin)
    .get(blogControllers.updateBlogPage)
    .put(blogImageupload.single('blog_image'), blogControllers.updateBlog)

router.get('/blogs', checkLogin, blogControllers.allPosts)
router.delete('/delete/blog/:id', checkLogin, blogControllers.deleteBlog)
router.get('/blog/comments', checkLogin, blogControllers.getBlogComments)

router.route('/blog/comment/:id')
    .all(checkLogin)
    .put(blogControllers.updateBlogComments)
    .delete(blogControllers.deleteBlogComment)

// Product Routes   
router.route('/product/create')
    .all(checkLogin)
    .get(productControllers.showProductAttributes)
    .post(productImageupload.fields([
        { name: 'product_image', maxCount: 5 },
        { name: 'featured_image', maxCount: 1 }
    ]), productControllers.createProduct)

router.get('/api/subCategory', productControllers.showsubcategory)
router.get('/products', checkLogin, productControllers.getProductsOnAdmin)
router.route('/product/:id')
    .all(checkLogin)
    .get(productControllers.updateProductPage)
    .delete(productControllers.deleteProduct)
    .put(productImageupload.fields([
        { name: 'product_image', maxCount: 5 },
        { name: 'featured_image', maxCount: 1 }
    ]), productControllers.updateProduct)

router.put('/product/image/:id', checkLogin, productControllers.handlePreviewImage)

router.post('/api/sub_category', productControllers.createScategory)
router.route('/api/parent_category')
    .post(categoryImageupload.single('image'), productControllers.createPcategory)
    .get(productControllers.parenCategory)
router.get('/productcategory/:id?', checkLogin, productControllers.showAllCategories)

router.delete('/product/category/delete/:id', checkLogin, productControllers.deleteParentCategory)

router.post('/api/attributes/color', checkLogin, productControllers.createColor)
router.delete('/api/attributes/color/:id', checkLogin, productControllers.deleteColor)

router.post('/api/attributes/size', checkLogin, productControllers.createSize)
router.delete('/api/attributes/size/:id', checkLogin, productControllers.deleteSize)

router.route('/api/attributes/brand/:id?')
    .all(checkLogin)
    .post(productControllers.createBrand)
    .put(productControllers.updatebrand)
    .delete(productControllers.deleteBrand)

// Product orders Routes
router.get('/products/orders', checkLogin, productControllers.getOrders)

router.route('/order/:id')
    .all(checkLogin)
    .get(productControllers.getorderDetails)
    .put(productControllers.updateOrderStatus)
// Contact Form Routes
router.get('/contact/messages', checkLogin, usersControllers.getAllMessages)
router.get('/message/:id', checkLogin, usersControllers.getSingleContactMessage)
router.post('/send/response', checkLogin, usersControllers.sendEmailResponse)
module.exports = router;