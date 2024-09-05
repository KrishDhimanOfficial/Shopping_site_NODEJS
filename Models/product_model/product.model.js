const mongoose = require('../../Connections/monodb.connection')

const productColorSchema = mongoose.Schema({
    color_name: {
        type: String,
        require: true,
        unique: true
    }
})

module.exports = mongoose.model('productColor', productColorSchema)

