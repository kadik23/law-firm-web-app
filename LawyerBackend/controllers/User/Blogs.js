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
module.exports = {
   getAllBlogs
};