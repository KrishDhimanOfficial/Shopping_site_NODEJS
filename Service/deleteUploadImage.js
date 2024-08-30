const post = require('../Models/posts.collections');
const fs = require('fs');
const path = require('path')

const deleteImage = async (id) => {
    const postImage = await post.findOne({ _id: id })
    const imagePath = path.join(__dirname, '../uploads', postImage.image);
    if (fs.existsSync(imagePath)) {
        return await fs.promises.rm(imagePath);
    }
}

module.exports = deleteImage;