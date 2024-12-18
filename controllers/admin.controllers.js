const admin = require('../Models/admin.model')
const bcrypt = require('bcryptjs')
const { setUser } = require('../Service/auth')

module.exports = {
    handleAdminLogin: async (req, res) => {
        try {
            const { name, password } = req.body;
            const data = await admin.findOne({ name })
            console.log(data);
            
            const isMatch = await bcrypt.compare(password, data.password);
            console.log(isMatch);
            
            if (!isMatch) {
                return res.redirect('/admin/login')
            } else {
                const user = { name: data.name }
                const token = setUser(user)
                res.cookie('authtoken', token)
                return res.redirect('/admin/dashboard')
            }
        } catch (error) {
            return res.render('admin/login', { error: 'Invalid Username or Password!' })
        }
    },
    handleAdminLogout: async (req, res) => {
        const token = req.cookies?.authtoken;
        if (token) {
            res.clearCookie('authtoken')
            return res.redirect('/admin/login')
        }
    }
}