async function login(req, res, next) {
    try {
        const token = await req.cookies?.token;
        
        if (!token) {
            next()
        } else {
            res.redirect('/admin/dashboard')
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = login;