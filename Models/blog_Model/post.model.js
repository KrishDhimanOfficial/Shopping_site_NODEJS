const mongoose = require('../../Connections/monodb.connection')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")

const postSchema = mongoose.Schema({
    blog_title: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 30
    },
    blog_description: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
    },
    blog_image: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    blog_slug: {
        type: mongoose.Schema.Types.String,
        unique: true
    },
    status:{
        type: mongoose.Schema.Types.Boolean,
    },
    date: {
        type: mongoose.Schema.Types.Date
    },
    author: {
        type: mongoose.Schema.Types.String
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId
    }
})

postSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('post', postSchema)

