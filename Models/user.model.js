const mongoose = require('../Connections/monodb.connection')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        match:[/^[a-z0-9]+@gmail.com$/]
    },
    password: {
        type: String,
        minlength:6,
        require: true
    }
})

module.exports = mongoose.model('user',userSchema)

