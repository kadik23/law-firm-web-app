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
 *               type: object
 *               required:
 *                 - body
 *                 - blogId
 *               properties:
 *                 body:
 *                   type: string
 *                 blogId:
 *                   type: integer
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
/**
 * @swagger
 * paths:
 *   /user/blogs/deletecomment:
 *     delete:
 *       summary: "Delete a blog comment"
 *       tags:
 *         - Blogs comments
 *       security:
 *         - BearerAuth: []
 *       requestParams:
 *         required: true
 *       responses:
 *         '200':
 *           description: "Blog comment deleted successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BlogComments'
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '403':
 *           description: "Forbidden - This comment does not belong to this user"
 *         '404':
 *           description: "comment not found"
 *         '500':
 *           description: "Internal Server Error"
 */


const deleteBlogComment= async (req,res)=>{
    try {
        const {id} = req.params;
        let comment = await comments.findByPk(id);

        if (!comment) {
            return res.status(404).json("Blog not found");
        }
        if(comment.userId!==req.user.id)
        {
            return res.status(403).json("Forbidden - This comment does not belong to this user");
        }

        await comment.destroy();
        return res.status(200).send(comment);
    } catch (e) {
        console.error('Error deleting comment', e);
        res.status(500).send('Internal Server Error');
    }
};

/**
 * @swagger
 * paths:
 *   /user/blogs/updatecomment:
 *     put:
 *       summary: "Update a blog comment"
 *       tags:
 *         - Blogs comment
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               schema:
 *               type: object
 *               required:
 *                 - id
 *                 - body
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 body:
 *                   type: string
 *       responses:
 *         '200':
 *           description: "comment updated successfully"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '403':
 *           description: "Forbidden - This comment does not belong to this user"
 *         '404':
 *           description: "comment not found"
 *         '500':
 *           description: "Internal Server Error"
 */

const updateBlogComment= async (req,res)=>{
    try {
        const {id ,body} = req.body;
        let comment = await comments.findByPk(id);

        if (!comment) {
            return res.status(404).json("comment not found");
        }
        if(comment.userId!==req.user.id)
        {
            return res.status(403).json("Forbidden - This comment does not belong to this user");
        }

        const updatedComments = await comment.update(
            { body:body },
            { where: { id } }
        );

        if (!updatedComments[0]) {
            return res.status(404).send('Error updating comment');
        } else {
            return res.status(200).send('Comment updated successfully');
        }

    }
    catch (e) {
        console.error('Error updating comment', e);
        res.status(500).send('Internal Server Error');
    }

};
/**
 * @swagger
 * paths:
 *   /user/blogs/replycomment:
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
 *               body:
 *                   type: string
 *               originalCommentId:
 *                   type: integer
 *       responses:
 *         '200':
 *           description: "Comment added successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BlogComments'
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '404':
 *           description: "original comment not found"
 *         '500':
 *           description: "Internal Server Error"
 */

const replyComment = async (req,res)=> {
    try {
        const {body, originalCommentId} = req.body;
        const userId=req.user.id
        let originalComment = await comments.findByPk(originalCommentId);
        if(!originalComment){
            return res.status(404).json("original comment not found");
        }
        let newBlogComment = await comments.create({
            body,userId,blogId:originalComment.blogId,isAReply:true,originalCommentId
        });

        if (!newBlogComment) {
            return res.status(401).send('Error creating comment reply');
        } else {
            return res.status(200).send(newBlogComment);
        }

    }
    catch (e) {
        console.error('Error creating reply', e);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {
    addBlogComment,
    updateBlogComment,
    deleteBlogComment,
    replyComment
};