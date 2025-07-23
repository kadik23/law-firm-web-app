import { Request, Response } from "express";
import { db } from "@/models/index";
import { Model, ModelCtor } from "sequelize";
import { createNotification } from "@/controllers/createNotification";
import { IBlogComment } from "@/interfaces/BlogComment";
import { IBlog } from "@/interfaces/Blog";
import { IUser } from "@/interfaces/User";
import { Sequelize } from "sequelize";

const comments: ModelCtor<Model<IBlogComment>> = db.blogcomments;
const Blog: ModelCtor<Model<IBlog>> = db.blogs;
const likes: ModelCtor<Model<any>> = db.commentsLikes;
const User: ModelCtor<Model<IUser>> = db.users;

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

export const addBlogComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { body, blogId } = req.body;
    const userId = (req as any).user.id;
    const blogExists = await Blog.findByPk(blogId);
    if (!blogExists) {
      res.status(400).json({ error: "Blog not found" });
      return;
    }
    let newBlogComment: Model<IBlogComment> = await comments.create({
      body: body,
      userId: userId,
      blogId: blogId,
      isAReply: false,
    } as IBlogComment);
    if (!newBlogComment) {
      res.status(401).send("Error creating blog comment");
      return;
    } else {
      const commentId = newBlogComment.getDataValue("id");
      if (typeof commentId !== "number") {
        res.status(500).send("Internal Server Error: Comment ID missing");
        return;
      }
      const commentWithUser = await comments.findOne({
        where: { id: commentId },
        include: [
          {
            model: User,
            attributes: ["id", "name", "surname"],
          },
        ],
      });
      res.status(200).send(commentWithUser);
    }
  } catch (e: any) {
    console.error("Error creating blog", e);
    res.status(500).send("Internal Server Error");
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

export const deleteBlogComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params;
    let comment: Model<IBlogComment> | null = await comments.findByPk(
      commentId
    );
    if (!comment) {
      res.status(404).json("Comment not found");
      return;
    }
    if (comment.getDataValue("userId") !== (req as any).user.id) {
      res
        .status(403)
        .json("Forbidden - This comment does not belong to this user");
      return;
    }
    await comment.destroy();
    res.status(200).send(comment);
  } catch (e: any) {
    console.error("Error deleting comment", e);
    res.status(500).send("Internal Server Error");
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

export const updateBlogComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { body } = req.body;
    const { commentId } = req.params;
    let comment: Model<IBlogComment> | null = await comments.findByPk(
      commentId
    );
    if (!comment) {
      res.status(404).json("comment not found");
      return;
    }
    if (comment.getDataValue("userId") !== (req as any).user.id) {
      res
        .status(403)
        .json("Forbidden - This comment does not belong to this user");
      return;
    }
    const updatedComments = await comment.update(
      { body: body },
      { where: { id: commentId } }
    );
    if (!updatedComments) {
      res.status(404).send("Error updating comment");
      return;
    }
    res.status(200).send(updatedComments);
  } catch (e: any) {
    console.error("Error updating comment", e);
    res.status(500).send("Internal Server Error");
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

export const replyComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { body, originalCommentId } = req.body;
    const userId = (req as any).user.id;
    let originalComment: Model<IBlogComment> | null = await comments.findByPk(
      originalCommentId
    );
    if (!originalComment) {
      res.status(404).json("original comment not found");
      return;
    }
    let newBlogComment: Model<IBlogComment> = await comments.create({
      body,
      userId,
      blogId: originalComment.getDataValue("blogId"),
      isAReply: true,
      originalCommentId,
    } as IBlogComment);
    if (!newBlogComment) {
      res.status(401).send("Error creating comment reply");
      return;
    } else {
      let notif = await createNotification(
        "Comments",
        "Vous avez une nouvelle réponse à votre commentaire",
        originalComment.getDataValue("userId"),
        originalComment.getDataValue("blogId") as number,
        userId
      );
      if (!notif) {
        res.status(200).send("Reply created but notification no");
      } else {
        res.status(200).send("Reply sent successfully");
      }
    }
  } catch (e: any) {
    console.error("Error creating reply", e);
    res.status(500).send("Internal Server Error");
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

export const likeComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;
    let comment: Model<IBlogComment> | null = await comments.findByPk(id);
    if (!comment) {
      res.status(404).json("comment not found");
      return;
    }
    let like = await likes.findOne({
      where: { userId: (req as any).user.id, commentId: id },
    });
    if (!like) {
      const commentLikeId = comment.getDataValue("id");
      if (typeof commentLikeId !== "number") {
        res.status(500).send("Internal Server Error: Comment ID missing");
        return;
      }
      await likes.create({
        userId: (req as any).user.id,
        commentId: commentLikeId,
      });
      res.status(200).send("Like comment");
    } else {
      await like.destroy();
      res.status(200).send("Unlike comment");
    }
  } catch (e: any) {
    console.error("Error updating comment", e);
    res.status(500).send("Internal Server Error");
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

export const getCommentsByBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 4;
    const offset = (page - 1) * pageSize;
    const { count, rows: commentsList } = await db.blogcomments.findAndCountAll(
      {
        where: { blogId: id, isAReply: false },
        limit: pageSize,
        offset: offset,
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "body",
          "userId",
          "blogId",
          "createdAt",
          "isAReply",
          "originalCommentId",
          "updatedAt",
          [
            Sequelize.fn("COUNT", Sequelize.col("commentLikes.commentId")),
            "likesCount",
          ],
          [
            Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM blog_comments AS replies
                        WHERE replies.originalCommentId = blog_comments.id
                    )`),
            "replies",
          ],
        ],
        include: [
          {
            model: User,
            attributes: ["id", "name", "surname"],
          },
          {
            model: db.commentsLikes,
            as: "commentLikes",
            attributes: [],
          },
        ],
        group: ["blog_comments.id"],
        subQuery: false,
      }
    );
    res.status(200).json({
      total: count,
      comments: commentsList,
    });
  } catch (e: any) {
    console.error("Error fetching comments", e);
    res.status(500).send("Internal Server Error");
  }
};

export const getRepliesByComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params;
    
    const replies = await comments.findAll({
        where: { originalCommentId: commentId, isAReply: true },
        order: [["createdAt", "DESC"]],
        attributes: [
            "id",
            "body",
            "userId",
            "blogId",
            "createdAt",
            "isAReply",
            "originalCommentId",
            "updatedAt",
            [Sequelize.fn("COUNT", Sequelize.col("commentLikes.commentId")), "likesCount"],
            [
                Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM blog_comments AS replies
                    WHERE replies.originalCommentId = blog_comments.id
                )`),
                "replies",
            ],
        ],
        include: [
            {
                model: User,
                attributes: ["id", "name", "surname"],
            },
            {
                model: db.commentsLikes, 
                as: "commentLikes",
                attributes: [],
            },
        ],
        group: ["blog_comments.id"],
        subQuery: false, 
    });
    
    res.status(200).json({
      replies: replies,
    });
  } catch (e: any) {
    console.error("Error fetching replies", e);
    res.status(500).send("Internal Server Error");
  }
};

export const IsCommentLiked = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user.id;
  const commentId = req.params.commentId;
  if (!commentId) {
    res.status(400).json({ message: "Comment ID is required." });
    return;
  }
  try {
    const commentExists: Model<IBlogComment> | null = await comments.findByPk(
      commentId
    );
    if (!commentExists) {
      res.status(404).json({ message: "Comment not found." });
      return;
    }
    const likeDb = await likes.findOne({ where: { userId, commentId } });
    res.status(200).json({ isliked: !!likeDb });
  } catch (error: any) {
    console.error("Error checking if Comment is liked:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
