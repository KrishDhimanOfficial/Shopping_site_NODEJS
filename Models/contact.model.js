const mongoose = require('../Connections/monodb.connection')

const contactSchema = mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        require: true,
        unique: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        unique: true,
        require: true,
        match: [/^[a-z0-9]+@gmail.com$/]
    },
    website: {
        type: mongoose.Schema.Types.String,
    },
    message: {
        type: mongoose.Schema.Types.String
    }
})

module.exports = mongoose.model('contactMessage', contactSchema)

