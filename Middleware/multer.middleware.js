const multer = require('multer')
const path = require('path')

const uploadDir = './uploads';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${uploadDir}/`)
    },
    filename: (req, file, cb) => {
        const newFileName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, newFileName)
    },
})

const upload = multer({ storage })
module.exports = upload;