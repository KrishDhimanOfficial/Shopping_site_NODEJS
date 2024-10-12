const mongoose = require('../../Connections/monodb.connection')

const productBrandSchema = mongoose.Schema({
    brand_name: {
        type: mongoose.Schema.Types.String,
        require: true,
        unique: true,
        maxlength: 30,
        match: [/^[a-zA-Z]+$/]
    },
    category_id: {
        type: mongoose.Schema.Types.Array,
        require: true
    }
})

module.exports = mongoose.model('productBrand', productBrandSchema)

