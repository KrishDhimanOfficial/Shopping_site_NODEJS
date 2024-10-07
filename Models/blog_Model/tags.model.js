const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')
const mongoose = require('../../Connections/monodb.connection')

const postTagSchema = mongoose.Schema({
    tag_name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
        trim: true
    },
})

postTagSchema.plugin(mongooseAggregatePaginate)
module.exports = mongoose.model('postTag', postTagSchema)

