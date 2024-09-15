const mongoose = require('../../Connections/monodb.connection')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2')

const parent_Category = mongoose.Schema({
    category_name: {
        type: mongoose.Schema.Types.String,
        match: /[a-zA-Z]/
    },
    image: {
        type: mongoose.Schema.Types.String,
        require: true,
    },
    category_desc: {
        type: mongoose.Schema.Types.String,
        require: true
    }
})
parent_Category.plugin(mongoosePaginate)
module.exports = mongoose.model('parent_Category', parent_Category)

