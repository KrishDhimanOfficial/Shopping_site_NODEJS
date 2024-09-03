const mongoose = require('../../Connections/monodb.connection')

const sub_Category = mongoose.Schema({
    category_name: {
        type: String,
        match: /[a-zA-Z]/
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId
    }
})
module.exports = mongoose.model('sub_Category', sub_Category)

