const express = require('express');
const router = express.Router();
const blog = require('../controllers/blog.controller')

router.post('/api/createCategory', blog.createCategory)


module.exports = router;