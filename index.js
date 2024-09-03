require('dotenv').config()
const express = require('express');
const app = express()
const cookie = require('cookie-parser')
const path = require('path');
const port = process.env.PORT ?? 8000;

const adminRoutes = require('./routes/admin.routes')

// Use Cookie parser to send cookie
app.use(cookie())

// TO Pass json Data
app.use(express.json())
app.use(express.urlencoded({ extended: false }))



// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads img to frontend
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('images'));

// Setup View ENgine To Excute EJS File
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')


app.use('/admin', adminRoutes)

app.listen(port, console.log('Running...'))