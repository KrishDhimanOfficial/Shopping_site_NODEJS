const user = require('../Models/user.model')
const bcrypt = require('bcryptjs')
const { setUser } = require('../Service/auth')
module.exports = {
    handleUserRegister: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password,
                await bcrypt.genSalt(10));
            const User = user.create({ username, email, password: hashedPassword })
            if (!req.body || !User) res.render('register', { message: 'Unscuccessfull' })
            res.redirect('/home');
        } catch (error) {
            console.log(error.message);
        }
    },
    handleUserLogin: async (req, res) => {
        try {
            const { email, password } = req.body
            const data = await user.findOne({ email })
            const ismatch = await bcrypt.compare(password, data.password)

            if (!ismatch) {
                res.render('login', { message: 'NOT FOUND' })
            } else {
                const setuser = { username: data.username }
                const token = setUser(setuser)
                res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
                res.redirect('/home')
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}