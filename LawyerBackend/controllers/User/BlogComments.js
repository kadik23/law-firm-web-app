require('dotenv').config();
const db = require('../../models')
const comments=db.blogcomments

/**
 * @swagger
 * paths:
 *   /user/blogs/addcomment:
 *     post:
 *       summary: "Comment a blog"
 *       tags:
 *         - Blogs comments
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogComments'
 *       responses:
 *         '200':
 *           description: "Comment added successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BlogComments'
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '500':
 *           description: "Internal Server Error"
 */

const addBlogComment = async (req,res)=> {
    try {
            const {body, blogId} = req.body;
            const userId=req.user.id
            let newBlogComment = await comments.create({
                body,userId,blogId,isAReply:false
            });

            if (!newBlogComment) {
                return res.status(401).send('Error creating blog comment');
            } else {
                return res.status(200).send(newBlogComment);
            }

    }
    catch (e) {
        console.error('Error creating blog', e);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    addBlogComment
};