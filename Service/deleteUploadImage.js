const fs = require('fs');
const path = require('path')

const deleteImage = async (image) => {
    const imagePath = path.join(__dirname, '../uploads',image);
    if (fs.existsSync(imagePath)) {
        return await fs.promises.rm(imagePath); 
    }
}

module.exports = deleteImage;