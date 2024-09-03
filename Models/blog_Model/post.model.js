const mongoose = require('../../Connections/monodb.connection')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")

const postSchema = mongoose.Schema({
    blog_title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    blog_description: {
        type: String,
        required: true,
        trim: true,
    },
    blog_image: {
        type: String,
        required: true,
    },
    date:{
        type: Date
    },
    author:{
        type: String
    },
    category_id:{
        type: mongoose.Schema.Types.ObjectId
    }

})

postSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('post', postSchema)

