require('dotenv').config()
const express = require('express')
const cookie = require('cookie-parser')
const path = require('path')
const cluster = require('cluster')
const os = require('os')
const totalCPUs = os.cpus().length;


if (cluster.isPrimary) {
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork()
    }
    cluster.fork().on('online', () => {
        console.log(`worker online`)
    })
} else {
    const app = express()
    const port = process.env.PORT;
    const adminRoutes = require('./routes/admin.routes')
    const siteRoutes = require('./routes/site.routes')
    // Use Cookie parser to send cookie
    app.use(cookie())

    // TO Pass json Data
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))


    // Serve static files from the "public" directory
    app.use(express.static(path.join(__dirname, 'public')));

    // Serve uploads img to frontend
    app.use('/uploads', express.static('uploads'))
    app.use('/images', express.static('images'))

    // Setup View ENgine To Excute EJS File
    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'ejs')


    app.use('/admin', adminRoutes)
    app.use('/', siteRoutes)

    app.use('/admin', (req, res) => {
        res.status(404).render('partials/404')
    })
    app.use('/', (req, res) => {
        res.status(404).render('Site_partials/404')
    })
    app.listen(port, console.log('Running...'))
}