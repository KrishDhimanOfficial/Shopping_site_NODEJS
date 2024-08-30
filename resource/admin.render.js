const express = require('express');
const router = express.Router();
const checkLogin = require('../Middleware/checkLogin')



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
    res.render('admin/category')
})
router.get('/blog', checkLogin, (req, res) => {
    res.render('admin/blog/blogIndex')
})
router.get('/blog/create', checkLogin, (req, res) => {
    res.render('admin/blog/createBlog')
})

module.exports = router;