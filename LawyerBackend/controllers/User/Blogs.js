require('dotenv').config();
const db = require('../../models')
const blogs=db.blogs
/**
 * @swagger
 * /user/blogs/all:
 *   get:
 *     summary: Retrieve a list of all blogs
 *     description: This endpoint retrieves all blog entries from the database.
 *     tags:
 *       - Blogs
 *     responses:
 *       200:
 *         description: A list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Internal Server Error - An error occurred while fetching blogs
 */

const getAllBlogs= async (req,res)=>{
    try {
        let blogsList = await blogs.findAll();
        return res.status(200).send(blogsList);
    } catch (e) {
        console.error('Error fetching blogs', e);
        res.status(500).send('Internal Server Error');
    }
};
/**
 * @swagger
 * /user/blogs/:id:
 *   get:
 *     summary: Retrieve a single blog by ID
 *     description: This endpoint retrieves a single blog entry from the database based on the provided blog ID in the body.
 *     tags:
 *       - Blogs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the blog to retrieve
 *     responses:
 *       200:
 *         description: A single blog entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found - The blog with the given ID does not exist
 *       500:
 *         description: Internal Server Error - An error occurred while fetching the blog
 */

const getBlogById= async (req,res)=>{
    try {
        const {id} = req.params;
        let blog = await blogs.findOne({ where: { id } });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        return res.status(200).send(blog);
    } catch (e) {
        console.error('Error fetching blog', e);
        res.status(500).send('Internal Server Error');
    }
};
/**
 * @swagger
 * paths:
 *   /user/blogs/like:
 *     post:
 *       summary: "Like a blog"
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
 *                 - id
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       responses:
 *         '200':
 *           description: "Blog updated successfully"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '404':
 *           description: "Blog not found"
 *         '500':
 *           description: "Internal Server Error"
 */

const likeBlog= async (req,res)=> {
    try {
        const {id} = req.body;

        const blog = await blogs.findByPk(id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        const updatedBlog = await blogs.update(
            {likes: blog.likes + 1},
            {where: {id}}
        );

        if (!updatedBlog[0]) {
            return res.status(404).send('Error updating blog');
        } else {
            return res.status(200).send('Blog updated successfully');
        }

    } catch (e) {
        console.error('Error updating blog', e);
        res.status(500).send('Internal Server Error');
    }
}

/**
 * @swagger
 * paths:
 *   /user/blogs/sort:
 *     get:
 *       summary: Get filtered and sorted list of blogs
 *
 *       description: Retrieve blogs based on optional filtering and sorting criteria such as category, title, or sort order.
 *       tags:
 *         - Blogs
 *       parameters:
 *         - in: query
 *           name: categoryId
 *           schema:
 *             type: integer
 *           description: Filter blogs by the ID of the category.
 *           required: false
 *         - in: query
 *           name: sort
 *           schema:
 *             type: string
 *             enum: [new, best]
 *           description: Sort blogs by "new" (latest blogs) or "best" (blogs with the most likes).
 *           required: false
 *         - in: query
 *           name: title
 *           schema:
 *             type: string
 *           description: Search blogs by title starting with the provided letters (case insensitive).
 *           required: false
 *       responses:
 *         200:
 *           description: A list of blogs matching the filtering and sorting criteria.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Blog'
 *         500:
 *           description: Internal Server Error
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the blog.
 *         title:
 *           type: string
 *           description: Title of the blog.
 *         categoryId:
 *           type: integer
 *           description: The ID of the category this blog belongs to.
 *         likes:
 *           type: integer
 *           description: Number of likes the blog has received.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the blog was created.
 */
const sortBlogs= async (req,res)=>{
    try {
        const {categoryId,sort,title} = req.query;

        let blogsList = await blogs.findAll();

        if(categoryId){
            blogsList = blogsList.filter(blog => blog.categoryId === Number(categoryId));

        }
        if (title) {
            const searchTitle = title.toLowerCase();
            blogsList = blogsList.filter(blog => blog.title.toLowerCase().startsWith(searchTitle));
        }
        if (sort) {

            if (sort === "new") {
                blogsList = blogsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            if (sort === "best") {
                blogsList = blogsList.sort((a, b) => b.likes - a.likes);
            }
        }

        return res.status(200).send(blogsList);
    } catch (e) {
        console.error('Error fetching blogs', e);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {
    getAllBlogs,
    getBlogById,
    likeBlog,
    sortBlogs
};
