const mongoose = require('../../Connections/monodb.connection')

const blogCommentSchema = mongoose.Schema({
    user_image: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    user_name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    comment: {
        type: mongoose.Schema.Types.String,
        required: true,
        maxlength: 300
    },
    date: {
        type: Date,
        required: true
    },
    likes: {
        type: mongoose.Schema.Types.Number,
        default: 0,
        required: true
    },
    status: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
})

module.exports = mongoose.model('blogComment', blogCommentSchema)

