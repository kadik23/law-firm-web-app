require('dotenv').config();
const db = require('../../models')
const {upload} = require("../../middlewares/FilesMiddleware");
const blogs=db.blogs
const fs = require('fs');
const {body: bd ,validationResult} = require("express-validator");


const uploadFile = upload.single("image");



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

const addBlog = async (req, res) => {
    try {
        uploadFile(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Error uploading files: ' + err.message);
            }


            await Promise.all([
                bd('title')
                    .isString().withMessage('Title must be a string')
                    .isLength({ max: 20 })
                    .notEmpty().withMessage('Title is required').run(req),
                bd('body')
                    .isString().withMessage('Body must be a string')
                    .notEmpty().withMessage('Body is required').run(req),
                bd('readingDuration')
                    .isInt().withMessage('readingDuration must be a number')
                    .notEmpty().withMessage('readingDuration is required').run(req),
                bd('categoryId')
                    .isInt().withMessage('categoryId must be a number')
                    .notEmpty().withMessage('categoryId is required').run(req)
            ]);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if (!req.file) {
                return res.status(400).json({ error: "Image is required." });
            }
            const { title, body, readingDuration, categoryId } = req.body;

            const imagePath = req.file.path;
            let newBlog = await blogs.create({
                title, likes: 0, body, readingDuration, image: imagePath, categoryId, userId: req.user.id, accepted: true,
            });

            if (!newBlog) {
                return res.status(401).send('Error creating blog');
            } else {
                return res.status(200).send('Blog created successfully');
            }
        });
    } catch (e) {
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
        uploadFile(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Error uploading files: ' + err.message);
            }
            await Promise.all([
                bd('id')
                    .isInt().withMessage('id must be a number')
                    .notEmpty().withMessage('id is required').run(req),
                bd('title')
                    .optional()
                    .isString().withMessage('Title must be a string')
                    .isLength({ max: 20 })
                    .run(req),
                bd('body')
                    .optional()
                    .isString().withMessage('Body must be a string')
                    .run(req),
                bd('readingDuration')
                    .optional()
                    .isInt().withMessage('readingDuration must be a number')
                    .run(req),
                bd('categoryId')
                    .optional()
                    .isInt().withMessage('categoryId must be a number')
                    .run(req)
            ]);


            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { id, title, body, categoryId } = req.body;
            const image = req.files?.image;


                const blog = await blogs.findByPk(id);
                if (!blog) {
                    return res.status(404).send('Blog not found');
                }

                if (image) {
                    deleteFile(blog.image);
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