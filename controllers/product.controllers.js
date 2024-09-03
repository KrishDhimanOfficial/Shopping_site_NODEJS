const parent_Category = require('../Models/product_model/parent.category.model')
const sub_Category = require('../Models/product_model/sub.category.model')

module.exports = {
    createPcategory: async (req, res) => {
        try {
            const data = await parent_Category.create(req.body)
            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    },
    parenCategory: async (req, res) => {
        try {
            const data = await parent_Category.find({})
            res.json(data)
        } catch (error) {
            console.log(error.message)
        }
    },
    createScategory: async (req, res) => {
        try {
            const data = await sub_Category.create(req.body)
            console.log(data);
        } catch (error) {
            console.log(error.message);

        }
    }
}