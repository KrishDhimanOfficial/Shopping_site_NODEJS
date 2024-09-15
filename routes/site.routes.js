const express = require('express');
const router = express.Router();
const { checkUserlogin, login } = require('../Middleware/checkUserlogin')
const user = require('../controllers/users.controllers')
const blogControllers = require('../controllers/blog.controller')
const productControllers = require('../controllers/product.controllers')


router.route('/login').get(login, (req, res) => {
    res.render('site/login')
})
    .post(login, user.handleUserLogin)

router.route('/register').get((req, res) => {
    res.render('site/register')
})
    .post(user.handleUserRegister)

router.get('/contact', checkUserlogin, (req, res) => {
    res.render('site/contact')
})

router.get('/home', checkUserlogin, productControllers.getProductByCategory)
router.get('/products/:name', checkUserlogin, productControllers.getProductByCategoryonShop)
router.get('/product/:id', checkUserlogin, productControllers.getSingleProductDetails)
router.get('/shop', checkUserlogin, productControllers.showAllproducts)
router.get('/category/:parent_category/:sub_category/:id', checkUserlogin, productControllers.getSub_categoryProduct)



router.get('/blogs', checkUserlogin, (req, res) => {
    res.render('site/blogPage');
})
router.get('/api/blogs/:loadPosts', blogControllers.getBlogs)
router.get('/singleblog/:id', checkUserlogin, blogControllers.getSingleBlog)
router.get('/category/:category_name', checkUserlogin, blogControllers.getCategoryBlogs)
router.post('/api/comment/:postId', blogControllers.createPostComment)
router.put('/api/comment/:id', blogControllers.updateBlogComments)



module.exports = router