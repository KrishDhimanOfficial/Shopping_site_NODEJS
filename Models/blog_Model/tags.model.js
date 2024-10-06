const mongoose = require('../../Connections/monodb.connection')

const postTagSchema = mongoose.Schema({
    tag_name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
        trim: true
    },
})

module.exports = mongoose.model('postTag', postTagSchema)

