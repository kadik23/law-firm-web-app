require('dotenv').config();
const db = require('../../models')
const {upload} = require("../../middlewares/FilesMiddleware");
const blogs=db.blogs
const fs = require('fs');
const {body: bd ,validationResult} = require("express-validator");
const { Op } = require("sequelize");
const { resolve } = require('path');

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
                // Fetch the created blog with its category
                const blogWithCategory = await blogs.findOne({
                    where: { id: newBlog.id },
                    include: [{
                        model: db.categories,
                        attributes: ['id', 'name']
                    }]
                });
                return res.status(200).json(blogWithCategory);
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
 *       summary: "Delete one or multiple blogs"
 *       description: "Delete one or multiple blog posts by providing an array of IDs."
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
 *                 ids:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1, 2, 3]
 *               required:
 *                 - ids
 *       responses:
 *         '200':
 *           description: "Blogs deleted successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: "3 blogs deleted"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '403':
 *           description: "Forbidden - User is not an admin"
 *         '404':
 *           description: "One or more blogs not found"
 *         '500':
 *           description: "Internal Server Error"
 */

/**
 * @swagger
 * /user/blogs/all:
 *   get:
 *     summary: Retrieve a list of all blogs by user
 *     description: This endpoint retrieves all blog entries from the database with optional pagination.
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default is 1)
 *         required: false
 *     responses:
 *       200:
 *         description: A list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalBlogs:
 *                   type: integer
 *                   example: 50
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Internal Server Error - An error occurred while fetching blogs
 */


const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 6;
        const offset = (page - 1) * pageSize;

        const { count, rows: blogsList } = await blogs.findAndCountAll({
            limit: pageSize,
            offset: offset,
            where: {userId: req.user.id},
            include: [{
                model: db.categories,
                attributes: ['id', 'name']
            }]
        });

        const updatedBlogsList = await Promise.all(blogsList.map(async (blog) => {
            const filePath = resolve(__dirname, '..', '..', blog.image);

            let base64Image = null;
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath);
                base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
            }

            return {
                ...blog.toJSON(),
                image: base64Image
            };
        }));

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(count / pageSize),
            totalBlogs: count,
            blogs: updatedBlogsList
        });

    } catch (e) {
        console.error('Error fetching blogs', e);
        res.status(500).send('Internal Server Error');
    }
};

const deleteBlog = async (req, res) => {
    try {
      const { ids } = req.body;
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid request, provide an array of IDs" });
      }
  
      const blogsToDelete = await blogs.findAll({ where: { id: { [Op.in]: ids } } });
  
      if (blogsToDelete.length === 0) {
        return res.status(404).json({ success: false, message: "No matching blogs found" });
      }
  
      // Delete associated images
      blogsToDelete.forEach(blog => {
        if (blog.image) deleteFile(blog.image);
      });
  
      // Delete blogs from the database
      const result = await blogs.destroy({ where: { id: { [Op.in]: ids } } });
  
      return res.status(200).json({ success: true, message: `${result} blogs deleted` });
    } catch (error) {
      console.error("Error deleting blogs:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
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
            const image = req.file;


                const blog = await blogs.findByPk(id);
                if (!blog) {
                    return res.status(404).send('Blog not found');
                }

                if (image) {
                    deleteFile(blog.image);
                }

                const imagePath = image ? image.path : blog.image;

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

const filterBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 6;
        const offset = (page - 1) * pageSize;
        const { category, time } = req.query;

        let whereCondition = { userId: req.user.id };
        let dateFilter = {};

        // Handle category filter
        if (category && category !== "Tous") {
            const categoryRecord = await db.categories.findOne({
                where: { name: category }
            });
            if (categoryRecord) {
                whereCondition.categoryId = categoryRecord.id;
            }
        }

        // Handle date filter
        if (time && time !== "Date de poste") {
            const now = new Date();
            switch (time) {
                case "Aujourd'hui":
                    dateFilter = {
                        createdAt: {
                            [Op.gte]: new Date(now.setHours(0, 0, 0, 0))
                        }
                    };
                    break;
                case "7 derniers jours":
                    dateFilter = {
                        createdAt: {
                            [Op.gte]: new Date(now.setDate(now.getDate() - 7))
                        }
                    };
                    break;
                case "30 derniers jours":
                    dateFilter = {
                        createdAt: {
                            [Op.gte]: new Date(now.setDate(now.getDate() - 30))
                        }
                    };
                    break;
                case "cette année (2024)":
                    dateFilter = {
                        createdAt: {
                            [Op.gte]: new Date('2024-01-01'),
                            [Op.lt]: new Date('2025-01-01')
                        }
                    };
                    break;
                case "cette année (2025)":
                    dateFilter = {
                        createdAt: {
                            [Op.gte]: new Date('2025-01-01'),
                            [Op.lt]: new Date('2026-01-01')
                        }
                    };
                    break;
            }
        }

        const { count, rows: blogsList } = await blogs.findAndCountAll({
            where: {
                ...whereCondition,
                ...dateFilter
            },
            limit: pageSize,
            offset: offset,
            include: [{
                model: db.categories,
                attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']]
        });

        const updatedBlogsList = await Promise.all(blogsList.map(async (blog) => {
            const filePath = resolve(__dirname, '..', '..', blog.image);

            let base64Image = null;
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath);
                base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
            }

            return {
                ...blog.toJSON(),
                image: base64Image
            };
        }));

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(count / pageSize),
            totalBlogs: count,
            blogs: updatedBlogsList
        });

    } catch (e) {
        console.error('Error filtering blogs', e);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    addBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    filterBlogs
};