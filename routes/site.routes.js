const express = require('express');
const router = express.Router();
const checkUserlogin = require('../Middleware/checkUserlogin')
const user = require('../controllers/users.controllers')
const blogControllers = require('../controllers/blog.controller')


router.route('/login').get((req, res) => {
    res.render('site/login')
})
    .post(user.handleUserLogin)

router.route('/register').get((req, res) => {
    res.render('site/register')
})
    .post(user.handleUserRegister)

router.get('/home', checkUserlogin, (req, res) => {
    res.render('site/home');
})
router.get('/blogs', checkUserlogin, (req, res) => {
    res.render('site/blogPage');
})

router.get('/api/blogs/:loadPosts', blogControllers.getBlogs)
router.get('/singleblog/:id', checkUserlogin, blogControllers.getSingleBlog)
router.get('/category/:category_name?/:id', checkUserlogin, blogControllers.getCategoryBlogs)


module.exports = router