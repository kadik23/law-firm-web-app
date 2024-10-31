require('dotenv').config();
const db = require('../../models')
const {upload} = require("../../middlewares/FilesMiddleware");
const blogs=db.blogs
const fs = require('fs');
const uploadFiles = upload.fields([
    { name: 'image', maxCount: 1 },
]);

// Delete old files if new files are provided
const deleteFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
const addBlog = async (req,res)=> {
    try {
        uploadFiles(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Error uploading files: ' + err.message);
            }

            const {title, body, categoryId} = req.body;
            const {image} = req.files;

            const imagePath = image ? image[0].path : null;
            let newBlog = await blogs.create({
                title, body, image: imagePath, categoryId, userId: 3, accepted: true
            });

            if (!newBlog) {
                return res.status(401).send('Error creating blog');
            } else {
                return res.status(200).send(newBlog);
            }
        });
    }
    catch (e) {
        console.error('Error creating blog', e);
        res.status(500).send('Internal Server Error');
    }
};
const deleteBlog= async (req,res)=>{
    try {
        const {id} = req.body;
        let blog = await blogs.findByPk(id);

        if (!blog) {
            return res.status(404).json("Blog not found");
        }
            deleteFile(blog.image);

        await blog.destroy();
        return res.status(200).send(blog);
    } catch (e) {
        console.error('Error deleting blog', e);
        res.status(500).send('Internal Server Error');
    }
};
const updateBlog= async (req,res)=>{
    try {
        uploadFiles(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Error uploading files: ' + err.message);
            }

            const { id, title, body, categoryId } = req.body;
            const image = req.files?.image;


                const blog = await blogs.findByPk(id);
                if (!blog) {
                    return res.status(404).send('Blog not found');
                }

                if (image) {
                    deleteFile(blog.image);
                    console.log("exe")
                }

                const imagePath = image ? image[0].path : blog.image;


                const updatedBlog = await blogs.update(
                    { title, body, categoryId, image: imagePath },
                    { where: { id } }
                );

                if (!updatedBlog[0]) {
                    return res.status(404).send('Error updating blog');
                } else {
                    return res.status(200).send('Blog updated successfully');
                }
        });
    }
    catch (e) {
        console.error('Error updating blog', e);
        res.status(500).send('Internal Server Error');
    }

};
module.exports = {
    addBlog,
    updateBlog,
    deleteBlog
};