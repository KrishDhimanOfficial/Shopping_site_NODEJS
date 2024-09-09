const { getUser } = require('../Service/auth')
function checkUserlogin(req, res, next) {
    try {
        const token = req.cookies?.token;

        const user = getUser(token)
        if (!token || !user) res.redirect('/login')
        next()
    } catch (error) {
        console.log(`auth : ${error}`);
    }
}


module.exports = checkUserlogin;