const user = require('../Models/user.model')
const bcrypt = require('bcryptjs')
const product_Cart = require('../Models/product_model/addToCart.model')
const contact = require('../Models/contact.model')
const { setUser } = require('../Service/auth')
const transporter = require('../Service/mailTransporter')
const { default: mongoose } = require('mongoose')
'use strict'

module.exports = {
    handleUserRegister: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password,
                await bcrypt.genSalt(10))
            const existingUser = await user.findOne({ username })


            if (!existingUser) {
                const User = user.create({ username, email, password: hashedPassword })
                if (!req.body || !User) res.render('site/register', { message: 'Unscuccessfull' })

                const setuser = { username: req.body.username }
                const token = setUser(setuser)
                res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
                return res.redirect('/home')
            } else {
                res.render('site/register', { message: 'Username Already Taken!' })
            }
            res.redirect('/home');
        } catch (error) {
            console.log(' handleUserRegister : ' + error.message);
        }
    },
    handleUserLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const data = await user.findOne({ email })
            const ismatch = await bcrypt.compare(password, data.password)

            if (!ismatch) {
                res.render('login', { message: 'NOT FOUND' })
            } else {
                const setuser = { username: data.username }
                const token = setUser(setuser)
                const existing_user = await product_Cart.findOne({ username: data.username })
                if (!existing_user) await product_Cart.create({ username: data.username })
                res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
                res.redirect('/home')
            }
        } catch (error) {
            console.log('handleUserLogin : ' + error.message);
        }
    },
    handleUserLogout: async (req, res) => {
        try {
            const token = req.cookies?.token;
            if (token) {
                res.clearCookie('token')
                res.redirect('/login')
            }
        } catch (error) {
            console.log('handleUserLogout :' + error.message);
        }
    },
    contactMessage: async (req, res) => {
        try {
            const data = await contact.create(req.body)
            if (!data) res.json({ message: 'unsuccessfully!' })
            res.json({ message: 'successfully Sent!' })
        } catch (error) {
            res.json({ message: 'unsuccessfully!' })
            console.log('contactMessage : ' + error.message)
        }
    },
    getAllMessages: async (req, res) => {
        try {
            const data = await contact.find({})
            res.render('admin/contactMessage', { contactsMessages: data })
        } catch (error) {
            console.log('getAllMessages : ' + error.message);
        }
    },
    getSingleContactMessage: async (req, res) => {
        try {
            const data = await contact.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
            if (!data) res.render('admin/sendResponseMessage', { message: 'NOT FOUND' })
            res.render('admin/sendResponseMessage', { singleMessage: data })
        } catch (error) {
            console.log('sendResponse : ' + error.message);
        }
    },
    sendEmailResponse: async (req, res) => {
        try {
            const mailOptions = {
                from: process.env.USER,
                to: 'dhimany149@gmail.com',
                subject: req.body.EmailSubject,
                html: req.body.message
            }
            const email = await transporter.sendMail(mailOptions)
            if (!email) res.json({ message: 'unsuccessfully!' })
            res.json({ message: 'successfully Sent!' })
        } catch (error) {
            console.log('sendReponse : ' + error.message);
        }
    }
}