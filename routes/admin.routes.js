const express = require('express');
const router = express.Router();
const login = require('../Middleware/login')
const renderHTML = require('../resource/admin.render')
const Admin = require('../controllers/admin.controllers')


router
    .get('/login', login, (req, res) => {
        res.render('admin/login')
    })
    .post('/login', Admin.handleAdminLogin)

router.get('/logout', Admin.handleAdminLogout)


router.use(renderHTML)

module.exports = router;