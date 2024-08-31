const express = require('express');
const router = express.Router();
const upload = require('../Middleware/multer.middleware')
const blog = require('../controllers/blog.controller')

router.post('/api/createCategory', blog.createCategory)
router.get('/api/allCategory', blog.allCategories)
router.post('/api/createPost', upload.single('blog_image'), blog.createPost)

module.exports = router;