const express = require('express');
const router = express.Router();
const { checkUserlogin, login } = require('../Middleware/checkUserlogin')
const user = require('../controllers/users.controllers')
const blogControllers = require('../controllers/blog.controller')
const productControllers = require('../controllers/product.controllers')
const userControllers = require('../controllers/users.controllers')
const checkCartDetails = require('../Middleware/checkUserCart.middleware')


router.route('/login').get(login, (req, res) => {
    res.render('site/login')
})
    .post(login, user.handleUserLogin)

router.get('/logout', userControllers.handleUserLogout)

router.route('/register').get(login, (req, res) => {
    res.render('site/register')
})
    .post(login, user.handleUserRegister)

router.get('/contact', (req, res) => {
    res.render('site/contact', { route: req.path })
})

router.get('/blogs', checkUserlogin, (req, res) => {
    res.render('site/blogPage', { route: req.path })
})

router.get('/account', checkUserlogin, (req, res) => {
    res.render('site/UserAccount')
})

router.get('/home', productControllers.getProductByCategory)
router.get('/products/:parent_name/:page?', productControllers.getProductByCategoryonShop)
router.get('/shop/:page?', productControllers.showAllproducts)
router.get('/category/:parent_category/:sub_category/:page?', checkUserlogin, productControllers.getSub_categoryProduct)
router.get('/api/singleproduct/:id', productControllers.singleproductonCart)
router.get('/api/blogs/:loadPosts', blogControllers.getBlogs)
router.get('/singleblog/:slug', checkUserlogin, blogControllers.getSingleBlog)
router.get('/category/:category_name', checkUserlogin, blogControllers.getCategoryBlogs)
router.get('/blog/:tag_name', checkUserlogin, blogControllers.getblogsByTagName)
router.post('/api/comment/:id', blogControllers.createPostComment)
router.put('/api/comment/:id', blogControllers.updateBlogComments)

router.route('/product/:id')
    .all(checkUserlogin)
    .get(productControllers.getSingleProductDetails)
    .put(productControllers.updateProductRating)

router.put('/addtocart', checkUserlogin, productControllers.productcart)
router.put('/updatecart/:id', checkUserlogin, productControllers.updatecart)
router.get('/Shoppping/cart', checkUserlogin, productControllers.getProductonAddtoCart)
router.put('/Shoppping/cart/:id', checkUserlogin, productControllers.deleteShoppingcartOptions)
router.get('/checkout', checkUserlogin, checkCartDetails, productControllers.getcartdetails)
router.post('/orders', checkUserlogin, productControllers.order)
router.post('/order/validate', checkUserlogin, productControllers.validateOrder)
router.post('/send/confirm/order', checkUserlogin, productControllers.sendConfirmedOrderEmail)
router.get('/myorders/:page?', checkUserlogin, productControllers.getuserOrders)

router.get('/api/cart/length', checkUserlogin, productControllers.getCartLength)

router.post('/filter', productControllers.getfilterProducts)
router.post('/filter/price', checkUserlogin, productControllers.getpriceRangeProducts)

router.post('/contact/details', userControllers.contactMessage)
module.exports = router