const parent_Category = require('../Models/product_model/parent.category.model')
const sub_Category = require('../Models/product_model/sub.category.model')

module.exports = {
    createPcategory: async (req, res) => {
        try {
            await parent_Category.create(req.body)
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: 'Unsuccessfull!' })
        }
    },
    parenCategory: async (req, res) => {
        try {
            const data = await parent_Category.find({})
            res.json(data)
        } catch (error) {
            console.log(error.message);
        }
    },
    createScategory: async (req, res) => {
        try {
            await sub_Category.create(req.body)
            res.json({ message: 'Successfully Created!' })
        } catch (error) {
            console.log(error.message);
            res.json({ message: 'Unsuccessfull!' })
        }
    }
}