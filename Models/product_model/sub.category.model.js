const mongoose = require('../../Connections/monodb.connection')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2')

const sub_Category = mongoose.Schema({
    category_name: {
        type: mongoose.Schema.Types.String,
        match: /[a-zA-Z]/
    },
    parent_id: {
        type: [mongoose.Schema.Types.ObjectId]
    }
})
sub_Category.plugin(mongoosePaginate)
module.exports = mongoose.model('sub_Category', sub_Category)

