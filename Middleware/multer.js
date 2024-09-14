const multer = require('multer')
const path = require('path')

const uploadDir = './uploads';

const createStorage = (dir) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${uploadDir}/${dir}`)
  },
  filename: (req, file, cb) => {
    const newFileName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, newFileName)
  },
})

const blogImageupload = multer({ storage: createStorage('blogImages') })
const productImageupload = multer({ storage: createStorage('') })
const categoryImageupload = multer({ storage: createStorage('categoryImages') })
module.exports = { blogImageupload, productImageupload, categoryImageupload }