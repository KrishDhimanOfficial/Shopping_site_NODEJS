const { getUser } = require('../Service/auth')
function LoginedUser(req, res, next) {
    try {
        const token = req.cookies?.token;

        const user = getUser(token)
        if (!token || !user) return res.redirect('/admin/login')
        next()
    } catch (error) {
        console.log(`auth : ${error}`);
    }
}


module.exports = LoginedUser;