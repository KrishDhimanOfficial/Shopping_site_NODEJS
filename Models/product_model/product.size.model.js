const mongoose = require('../../Connections/monodb.connection')

const productSizeSchema = mongoose.Schema({
    size_name: {
        type: String,
        require: true,
        unique: true,
        match: [/[a-zA-Z]\D/]
    }
})

module.exports = mongoose.model('productSize', productSizeSchema)

