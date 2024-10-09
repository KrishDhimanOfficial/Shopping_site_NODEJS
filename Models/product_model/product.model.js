const mongoosePaginate = require('mongoose-aggregate-paginate-v2')
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
    date: {
        type: mongoose.Schema.Types.Date,
        require: true
    },
    shipping: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    featured_image: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    product_image: {
        type: mongoose.Schema.Types.Array,
        required: true
    },
    product_new: {
        type: mongoose.Schema.Types.Boolean,
        default: true
    },
    product_slug: {
        type: mongoose.Schema.Types.String,
        require: true
    },
    product_on_sales: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    product_parent_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    product_sub_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    product_stock: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    brand_name: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    product_rating: {
        type: mongoose.Schema.Types.Number,
        min: 0,
        max: 5
    },
    product_description: {
        type: mongoose.Schema.Types.String,
        required: true,
        maxlength: 2000,
        trim: true
    },
    availableColor: {
        type: [mongoose.Schema.Types.ObjectId],
        require: true
    },
    availableSize: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    product_comment_id: {
        type: mongoose.Schema.Types.ObjectId
    }
})

productSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('product', productSchema)

