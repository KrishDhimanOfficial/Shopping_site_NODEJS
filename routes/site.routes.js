const express = require('express');
const router = express.Router();
const checkUserlogin = require('../Middleware/checkUserlogin')
const user = require('../controllers/users.controllers')

router.get('/home', checkUserlogin, (req, res) => {
    res.render('site/home');
})

router.route('/login').get((req, res) => {
    res.render('site/login')
})
    .post(user.handleUserLogin)

router.route('/register').get((req, res) => {
    res.render('site/register')
})
    .post(user.handleUserRegister)



module.exports = router