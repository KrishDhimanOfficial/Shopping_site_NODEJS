const admin = require('../Models/admin.model')
const bcrypt = require('bcryptjs')
const { setUser } = require('../Service/auth')

module.exports = {
    handleAdminLogin: async (req, res) => {
        try {
            const { name, password } = req.body;

            const data = await admin.findOne({ name })
            const isMatch = await bcrypt.compare(password, data.password);
            if (!isMatch) {
                res.redirect('/admin/login')
            } else {
                const user = { name: data.name }
                const token = setUser(user)
                res.cookie('authtoken', token)
                res.redirect('/admin/dashboard')
            }
        } catch (error) {
            res.render('admin/login', { error: 'Invalid Username or Password!' })
        }
    },
    handleAdminLogout: async (req, res) => {
        const token = req.cookies?.authtoken;
        console.log(token);
        
        if (token) {
            res.clearCookie('authtoken')
            return res.redirect('/admin/login')
        }
    }
}