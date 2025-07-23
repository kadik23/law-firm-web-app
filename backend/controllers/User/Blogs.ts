import dotenv from 'dotenv';
dotenv.config();
import { db } from '@/models/index';
import { resolve } from 'path';
import fs, { existsSync, readFileSync } from 'fs';
import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize';
import { IBlog } from '@/interfaces/Blog';
import { ILike } from '@/interfaces/Like';
import { Op } from 'sequelize';

const blogs: ModelCtor<Model<IBlog>> = db.blogs;
const like: ModelCtor<Model<ILike>> = db.like;

/**
 * @swagger
 * /user/blogs/all:
 *   get:
 *     summary: Retrieve a list of all blogs
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

const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = 6;
        const offset = (page - 1) * pageSize;
        const { count, rows: blogsList } = await blogs.findAndCountAll({
            limit: pageSize,
            offset: offset,
        });
        const updatedBlogsList: any[] = await Promise.all(blogsList.map(async (blog: Model<IBlog>) => {
            const filePath = resolve(__dirname, '..', '..', blog.getDataValue('image'));
            let base64Image: string | null = null;
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath);
                base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
            }
            return {
                ...blog.toJSON(),
                image: base64Image
            };
        }));
        res.status(200).json({
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

const getBlogById= async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        let blog = await blogs.findOne({ where: { id } });

        if (!blog) {
            res.status(404).json({ message: 'Blog not found' });
            return;
        }
        const filePath = resolve(__dirname, '..', '..', blog.getDataValue('image'));

        let base64Image = null;
        if (existsSync(filePath)) {
            const fileData = readFileSync(filePath);
            base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
        }
        res.status(200).send({
            ...blog.toJSON(),
            image: base64Image
        });
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
 *           description: "Blog liked successfully"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '404':
 *           description: "Blog not found"
 *         '500':
 *           description: "Internal Server Error"
 */

const likeBlog= async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.body;
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
            return;
        }
        const userId = req.user.id;
        const blog = await blogs.findByPk(id);
        if (!blog) {
            res.status(404).send('Blog not found');
            return;
        }
        const existingLike = await like.findOne({
            where: { userId, blogId: id },
        });
        if (existingLike) {
            res.status(400).json({ message: "Blog is already like." });
            return;
        }
        await like.create({ userId, blogId: id });
        const likesValue = blog.getDataValue('likes') ?? 0;
        const updatedBlog = await blogs.update(
            {likes: likesValue + 1},
            {where: {id}}
        );
        if (!updatedBlog[0]) {
            res.status(404).send('Error updating blog');
            return;
        } else {
            res.status(200).send('Blog updated successfully');
        }
    } catch (e) {
        console.error('Error updating blog', e);
        res.status(500).send('Internal Server Error');
    }
}


/**
 * @swagger
 * paths:
 *   /user/blogs/dislike:
 *     post:
 *       summary: "Dislike a blog"
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
 *           description: "Blog liked successfully"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '404':
 *           description: "Blog not found"
 *         '500':
 *           description: "Internal Server Error"
 */

const dislikeBlog= async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.body;
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
            return;
        }
        const userId = req.user.id;
        const blog = await blogs.findByPk(id);
        if (!blog) {
            res.status(404).send('Blog not found');
            return;
        }
        const likeToDelete = await like.findOne({
            where: { userId, blogId: id },
        });
        if (!likeToDelete) {
            res.status(404).json({ message: "Like not found." });
            return;
        }
        await likeToDelete.destroy();
        const likesValue = blog.getDataValue('likes') ?? 0;
        const updatedBlog = await blogs.update(
            {likes: likesValue - 1},
            {where: {id}}
        );
        if (!updatedBlog[0]) {
            res.status(404).send('Error updating blog');
            return;
        } else {
            res.status(200).send('Blog updated successfully');
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
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *           description: The page number for pagination.
 *           required: false
 *       responses:
 *         200:
 *           description: A list of blogs matching the filtering and sorting criteria.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   currentPage:
 *                     type: integer
 *                     example: 1
 *                   totalPages:
 *                     type: integer
 *                     example: 5
 *                   totalBlogs:
 *                     type: integer
 *                     example: 50
 *                   blogs:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Blog'
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
 *           example: 1
 *         title:
 *           type: string
 *           description: Title of the blog.
 *           example: "Introduction to Next"
 *         categoryId:
 *           type: integer
 *           description: The ID of the category this blog belongs to.
 *           example: 3
 *         likes:
 *           type: integer
 *           description: Number of likes the blog has received.
 *           example: 150
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the blog was created.
 *           example: "2024-02-24T12:34:56Z"
 */

const sortBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId, sort, title, page } = req.query;
        const pageSize = 6;
        const currentPage = parseInt(page as string) || 1;
        const offset = (currentPage - 1) * pageSize;
        let whereCondition: any = {};
        if (categoryId) whereCondition.categoryId = categoryId;
        if (title) whereCondition.title = { [Op.like]: `${title}%` };
        let order: any[] = [];
        if (sort === "new") order.push(["createdAt", "DESC"]);
        if (sort === "best") order.push(["likes", "DESC"]);
        const { count, rows: blogsList } = await blogs.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: offset,
            order: order.length ? order : [["createdAt", "DESC"]]
        });
        const updatedBlogsList = await Promise.all(blogsList.map(async (blog: Model<IBlog>) => {
            const filePath = resolve(__dirname, '..', '..', blog.getDataValue('image'));
            let base64Image: string | null = null;
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath);
                base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
            }
            return {
                ...blog.toJSON(),
                image: base64Image
            };
        }));
        res.status(200).json({
            success: true,
            currentPage,
            totalPages: Math.ceil(count / pageSize),
            totalBlogs: count,
            blogs: updatedBlogsList
        });
    } catch (e) {
        console.error("Error fetching blogs", e);
        res.status(500).send("Internal Server Error");
    }
};


/**
 * @swagger
 * /user/blogs/IsBlogliked/{blogId}:
 *   get:
 *     summary: Check if a blog is liked by the user
 *     description: This endpoint checks if a specific blog is liked by the authenticated user.
 *     tags:
 *       - Blogs
 *     parameters:
 *       - name: blogId
 *         in: path
 *         description: The ID of the blog to check
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Status indicating if the blog is liked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLiked:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal Server Error
 */
const IsBlogLiked = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
        return;
    }
    const userId = req.user.id;
    const blogId = req.params.blogId;
    if (!blogId) {
      res.status(400).json({ message: "Blog ID is required." });
      return;
    }
    try {
      const blogExists = await blogs.findByPk(blogId);
      if (!blogExists) {
        res.status(404).json({ message: "Blog not found." });
        return;
      }
      const likeDb = await like.findOne({
        where: { userId, blogId },
      });
      res.status(200).json({ isLiked: !!likeDb });
    } catch (error) {
      console.error("Error checking if blog is liked:", error);
      res.status(500).json({ message: "An error occurred while checking like status." });
    }
};

/**
 * @swagger
 * /user/blogs/like/count/:id:
 *   get:
 *     summary: Get total count of like blogs
 *     description: Returns the total number of blogs in the user's likes
 *     tags:
 *       - Blogs
 *     responses:
 *       200:
 *         description: Successfully retrieved likes count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLikes:
 *                   type: integer
 *                   example: 50
 *       500:
 *         description: Internal Server Error
 */
const GetLikesCount = async (req: Request, res: Response): Promise<void> => {
    const blogId = req.params.id;
    try {
      const count = await like.count({
        where: { blogId },
      });
      res.status(200).json({
        totalLikes: count,
      });
    } catch (error) {
      console.error("Error counting likes:", error);
      res.status(500).json({ message: "An error occurred while counting likes." });
    }
};

export {
  getAllBlogs,
  getBlogById,
  likeBlog,
  dislikeBlog,
  sortBlogs,
  IsBlogLiked,
  GetLikesCount
};
