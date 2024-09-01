const mongoose = require('../../Connections/monodb.connection')

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
        maxlength: 150
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

module.exports = mongoose.model('post', postSchema)

