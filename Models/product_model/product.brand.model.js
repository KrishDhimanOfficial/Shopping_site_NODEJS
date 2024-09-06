const mongoose = require('../../Connections/monodb.connection')

const productBrandSchema = mongoose.Schema({
    brand_name: {
        type: String,
        require: true,
        unique: true,
        maxlength: 30,
        match: [/^[a-zA-Z]+$/]
    }
})

module.exports = mongoose.model('productBrand', productBrandSchema)

