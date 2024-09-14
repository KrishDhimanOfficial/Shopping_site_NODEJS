const { getUser } = require('../Service/auth')
async function checkUserlogin(req, res, next) {
    try {
        const token = req.cookies?.token;

        const user = getUser(token)
        
        if (!token || !user) res.redirect('/login')
        next()
    } catch (error) {
        console.log(`auth : ${error}`);
    }
}

async function login(req, res, next) {
    try {
        const token = await req.cookies?.token;

        if (!token) {
            next()
        } else {
            res.redirect('/home')
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { checkUserlogin, login };