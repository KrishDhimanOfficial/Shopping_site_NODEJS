// singel image
const createstorage = (dir) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `uploads/${dir}`)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})



const categoryImage = multer({ storage: createstorage('product_category_image') }).single("file")

module.exports = { categoryImage };