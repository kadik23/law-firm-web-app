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
/**
 * @swagger
 * paths:
 *   /admin/blogs/add:
 *     post:
 *       summary: "Create a new blog"
 *       description: "Create a new blog post with an uploaded image."
 *       tags:
 *         - Blogs
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - body
 *                 - categoryId
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "My First Blog"
 *                 body:
 *                   type: string
 *                   example: "This is the content of the blog post."
 *                 categoryId:
 *                   type: integer
 *                   example: 1
 *               encoding:
 *                 image:
 *                   contentType: "image/*"
 *       responses:
 *         '200':
 *           description: "Blog created successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Blog'
 *         '400':
 *           description: "Error uploading files"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '500':
 *           description: "Internal Server Error"
 */

const addBlog = async (req,res)=> {
    try {
        uploadFiles(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Error uploading files: ' + err.message);
            }

            const {title, body, readingDuration, categoryId} = req.body;
            const {image} = req.files;

            const imagePath = image ? image[0].path : null;
            let newBlog = await blogs.create({
                title,likes:0, body, readingDuration, image: imagePath, categoryId, userId: 3, accepted: true, 
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
/**
 * @swagger
 * paths:
 *   /admin/blogs/delete:
 *     delete:
 *       summary: "Delete a blog"
 *       description: "Delete an existing blog post by its ID."
 *       tags:
 *         - Blogs
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       responses:
 *         '200':
 *           description: "Blog deleted successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Blog'
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '403':
 *           description: "Forbidden - User is not an admin"
 *         '404':
 *           description: "Blog not found"
 *         '500':
 *           description: "Internal Server Error"
 */


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

/**
 * @swagger
 * paths:
 *   /admin/blogs/update:
 *     put:
 *       summary: "Update a blog"
 *       description: "Update an existing blog post by its ID."
 *       tags:
 *         - Blogs
 *       security:
 *         - BearerAuth: []
 *         - AdminAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *                 - title
 *                 - body
 *                 - categoryId
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   maxLength: 20
 *                   example: "Updated Blog Title"
 *                 body:
 *                   type: string
 *                   maxLength: 500
 *                   example: "Updated content for the blog post."
 *                 categoryId:
 *                   type: integer
 *                   example: 1
 *                 image:
 *                   type: string
 *                   format: binary
 *                   example: "image.jpg"
 *       responses:
 *         '200':
 *           description: "Blog updated successfully"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '403':
 *           description: "Forbidden - User is not an admin"
 *         '404':
 *           description: "Blog not found"
 *         '500':
 *           description: "Internal Server Error"
 */

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