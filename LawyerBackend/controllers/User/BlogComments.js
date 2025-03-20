require('dotenv').config();
const db = require('../../models')
const {Sequelize} = require("sequelize");
const comments=db.blogcomments
const Blog=db.blogs
const likes=db.commentsLikes

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
 *                 $ref: '#/components/schemas/BlogComment'
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '500':
 *           description: "Internal Server Error"
 */

const addBlogComment = async (req,res)=> {
    try {
            const {body, blogId} = req.body;
            const userId=req.user.id
            const blogExists = await Blog.findByPk(blogId);
            if (!blogExists) {
                return res.status(400).json({ error: "Blog not found" });
            }
            let newBlogComment = await comments.create({
               body: body,userId:userId,blogId:blogId,isAReply:false
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
 *       responses:
 *         '200':
 *           description: "Blog comment deleted successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BlogComment'
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '403':
 *           description: "Forbidden - This comment does not belong to this user"
 *         '404':
 *           description: "Comment not found"
 *         '500':
 *           description: "Internal Server Error"
 */



const deleteBlogComment= async (req,res)=>{
    try {
        const {id} = req.body;
        let comment = await comments.findByPk(id);

        if (!comment) {
            return res.status(404).json("Comment not found");
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
            { where: { id:id } }
        );
        if (!updatedComments) {
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
 *       summary: "Reply a comment"
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
 *                 - originalCommentId
 *               properties:
 *                 body:
 *                   type: string
 *                 originalCommentId:
 *                   type: integer
 *       responses:
 *         '200':
 *           description: "Comment added successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BlogComment'
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
/**
 * @swagger
 * paths:
 *   /user/blogs/likecomment:
 *     post:
 *       summary: "like a comment"
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
 *                 - id
 *               properties:
 *                 id:
 *                   type: integer
 *       responses:
 *         '200':
 *           description: "Comment added successfully"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '500':
 *           description: "Internal Server Error"
 */

const likeComment = async (req,res)=> {
    try {
        const {id} = req.body;
        let comment = await comments.findByPk(id);

        if (!comment) {
            return res.status(404).json("comment not found");
        }
        let like = await likes.findOne({userId:req.user.id});

        if (!like) {
            await likes.create({userId:req.user.id,commentId:comment.id})
            return res.status(200).send('Like comment');

        }else {
            await like.destroy()
            return res.status(200).send('Unlike comment');
        }

    }
    catch (e) {
        console.error('Error updating comment', e);
        res.status(500).send('Internal Server Error');
    }
};
/**
 * @swagger
 * /user/blogs/commentsByBlog/:id:
 *   get:
 *     summary: Retrieve a list of all comments of a blog
 *     tags:
 *       - Blogs comments
 *     parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *           description: page number
 *           required: false
 *
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlogComment'
 *       500:
 *         description: Internal Server Error
 */

const getCommentsByBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const pageSize = 6;
        const offset = (page - 1) * pageSize;


        const { count, rows: commentsList } = await db.blogcomments.findAndCountAll({
            where: { blogId: id },
            limit: pageSize,
            offset: offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.commentsLikes,  // Ensure this references the correct model
                    as: "blogComment",  // Use the alias EXACTLY as defined in the association
                    attributes: [
                        [Sequelize.fn("COUNT", Sequelize.col("blogComment.comment")), "likesCount"]
                    ],
                },
            ],
            group: ["commentsLikes.commentId"],
            subQuery: false,
        });



        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(count / pageSize),
            totalComments: count,
            comments: commentsList,
        });
    } catch (e) {
        console.error("Error fetching comments", e);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    addBlogComment,
    updateBlogComment,
    deleteBlogComment,
    replyComment,
    likeComment,
    getCommentsByBlog
};