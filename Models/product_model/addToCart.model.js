const mongoose = require('../../Connections/monodb.connection')

const cartSchema = mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        ref: 'users',
        required: true
    },
    product_cart: {
        type: mongoose.Schema.Types.Array,
        required: true,
        product_details: {
            pid: {
                type: mongoose.Schema.Types.ObjectId,
            },
            price: {
                type: mongoose.Schema.Types.Number,
            },
            quantity: {
                type: mongoose.Schema.Types.Number,
            },
            total: {
                type: mongoose.Schema.Types.Number,
            }
        },
    },
    grandTotal:{
        type: mongoose.Schema.Types.Number,
        required: true,
        default:0
    }
})
module.exports = mongoose.model('product_Cart', cartSchema)