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
 * /user/blogs/id:
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
        const {id} = req.body;
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
module.exports = {
    getAllBlogs,
    getBlogById
};