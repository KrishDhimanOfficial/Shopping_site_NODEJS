const userCartModel = require('../Models/product_model/addToCart.model');
const { getUser } = require('../Service/auth');


const checkCartDetails = async (req, res, next) => {
    try {
        const user = getUser(req.cookies.token)
        const data = await userCartModel.findOne({ username: user.username })
        if (data.product_cart == '' || !data.product_cart) res.redirect('/Shoppping/cart')
        data.product_cart.forEach(item => {
            if (item.product_details.quantity === null) res.redirect('/Shoppping/cart')
        })
        next()
    } catch (error) {
        console.log('checkCartDetails : ' + error.message)
    }
}
module.exports = checkCartDetails;