const jwt = require('jsonwebtoken')

function setUser(user) {
    return jwt.sign(user, process.env.PRIVATE_KEY)
}
function getUser(token) {
    if (!token) { return null }
    return jwt.verify(token, process.env.PRIVATE_KEY)
}
module.exports = { setUser, getUser };