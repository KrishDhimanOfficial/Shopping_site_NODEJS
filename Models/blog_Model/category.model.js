const mongoose = require('../../Connections/monodb.connection')

const blogCategorySchema = mongoose.Schema({
    category: {
        type: String,
        require: true,
        unique: true,
        match: [/[a-zA-Z]/]
    }
})

module.exports = mongoose.model('category', blogCategorySchema)

