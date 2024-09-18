const mongoose = require('../../Connections/monodb.connection')

const cartSchema = mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        ref: 'Product',
        required: true
    },
    product_id: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
        default:[],
        required: true
    }
})
module.exports = mongoose.model('product_Cart', cartSchema)