const mongoose = require('../../Connections/monodb.connection')

const parent_Category = mongoose.Schema({
    category_name: {
        type: String,
        match: /[a-zA-Z]/
    }
})
module.exports = mongoose.model('parent_Category', parent_Category)

