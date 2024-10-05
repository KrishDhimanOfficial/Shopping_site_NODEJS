const mongoose = require('../../Connections/monodb.connection')

const postTagSchema = mongoose.Schema({
    tag_name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
        trim: true
    },
    status:{
        type : mongoose.SchemaTypes.Boolean,
        default:false
    }
})

module.exports = mongoose.model('postTag', postTagSchema)

