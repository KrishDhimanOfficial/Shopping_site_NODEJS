const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/E-Commerce')
    .then(() => {
        console.log('MongoDB Connected!')
    }).catch(() => {
        console.log('Not Connected!');
    });

module.exports = mongoose;
