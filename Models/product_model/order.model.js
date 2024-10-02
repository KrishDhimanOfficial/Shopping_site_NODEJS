const mongoosePaginate = require('mongoose-aggregate-paginate-v2')
const mongoose = require('../../Connections/monodb.connection')

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    razorpay_order_id: {
        type: mongoose.Schema.Types.String
    },
    razorpay_payment_id: {
        type: mongoose.Schema.Types.String
    },
    items:{
        type: mongoose.Schema.Types.Array,
        pid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: mongoose.Schema.Types.Number,
            required: true,
            min: 1
        }
    },
    totalAmount: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    status: {
        type: mongoose.Schema.Types.String,
        default: 'pending'
    },
    shippingAddress: {
        main_address: {
            type: mongoose.Schema.Types.String, required: true
        },
        optional_address: {
            type: mongoose.Schema.Types.String,
            default: ''
        },
        city: {
            type: mongoose.Schema.Types.String, required: true
        },
        state: {
            type: mongoose.Schema.Types.String, required: true
        },
        pincode: {
            type: mongoose.Schema.Types.String, required: true
        },
        country: {
            type: mongoose.Schema.Types.String, required: true
        }
    },
    contact: {
        first_name: {
            type: mongoose.Schema.Types.String, required: true
        },
        last_name: {
            type: mongoose.Schema.Types.String, required: true
        },
        phone_no: {
            type: mongoose.Schema.Types.Number, required: true
        },
        email: {
            type: mongoose.Schema.Types.String, required: true
        }
    },
    order_note: {
        type: mongoose.Schema.Types.String,
        default:'No Instructions'
    },
    createdAt: {
        type: mongoose.Schema.Types.Date,
    }
})

orderSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('order', orderSchema)