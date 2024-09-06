const mongoose = require('../../Connections/monodb.connection')

const productSchema = mongoose.Schema({
    product_title: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
        maxlength: 60,
        match: [/^[a-zA-Z0-9\s]+$/],
        trim: true
    },
    product_price: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 0
    },
    product_discount: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 0
    },
    shipping:{
        type: mongoose.Schema.Types.String,
    },
    product_image: {
        type: mongoose.Schema.Types.Array,
        required: true
    },
    product_parent_category_id: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    product_sub_category_id: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    product_stock: {
        type: mongoose.Schema.Types.String,
        required: true,
        min: 0
    },
    product_rating: {
        type: mongoose.Schema.Types.Number,
        min: 0,
        max: 5
    },
    details: {
        type: Object,
        product_description: {
            type: mongoose.Schema.Types.String,
            required: true,
            maxlength: 2000,
            trim: true
        },
        availableColor: {
            type: mongoose.Schema.Types.Array,
            require: true
        },
        availableSize: {
            type: mongoose.Schema.Types.Array
        }
    },
    product_comment_id: {
        type: mongoose.Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('product', productSchema)

