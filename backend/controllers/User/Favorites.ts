import dotenv from 'dotenv';
dotenv.config();
import { db } from '@/models/index';
import { Op, Model, ModelCtor } from 'sequelize';
import { Request, Response } from 'express';
import { IUser } from '@/interfaces/User';
import { IBlog } from '@/interfaces/Blog';
import { IFavorite } from '@/interfaces/Favorite';
import { getFileBase64FromDrive } from '@/middlewares/FilesMiddleware';
/**
 * @swagger
 * /user/favorites:
 *   post:
 *     summary: Add a blog to the user's favorites
 *     description: This endpoint adds a blog to the authenticated user's favorites list.
 *     tags:
 *       - Favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blogId:
 *                 type: integer
 *                 description: The ID of the blog to favorite
 *                 example: 1
 *     responses:
 *       201:
 *         description: Blog successfully added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog added to favorites successfully."
 *                 favorite:
 *                   $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Blog ID is required or already favorited
 *       404:
 *         description: Blog or User not found
 *       500:
 *         description: Internal Server Error - An error occurred while adding the blog to favorites
 */
const users: ModelCtor<Model<IUser>> = db.users;
const blogs: ModelCtor<Model<IBlog>> = db.blogs;
const favorites: ModelCtor<Model<IFavorite>> = db.favorites;

const CreateFavoriteBlog = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    return;
  }
  const userId = req.user.id;
  const { blogId } = req.body;
  if (!blogId) {
    res.status(400).json({ message: "Blog ID is required." });
    return;
  }
  try {
    await db.sequelize.transaction(async (t) => {
      const blog = await blogs.findByPk(blogId, { transaction: t });
      if (!blog) {
        res.status(404).json({ message: "Blog not found" });
        return;
      }
      const user = await users.findByPk(userId, { transaction: t });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const existingFavorite = await favorites.findOne({
        where: { userId, blogId },
        transaction: t
      });
      if (existingFavorite) {
        res.status(400).json({ message: "Blog is already favorited." });
        return;
      }
      const newFavorite = await favorites.create({ userId, blogId }, { transaction: t });
      res.status(201).json({
        message: "Blog added to favorites successfully.",
        favorite: newFavorite,
      });
    });
  } catch (error) {
    console.error("Error creating favorite blog:", error);
    res.status(500).json({
      message: "An error occurred while adding the blog to favorites.",
    });
  }
};

/**
 * @swagger
 * /user/favorites:
 *   get:
 *     summary: Retrieve all favorite blogs for the user
 *     description: This endpoint retrieves all favorite blogs for the authenticated user.
 *     tags:
 *       - Favorites
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: The number of favorite blogs to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: offset
 *         in: query
 *         description: The offset for the pagination of favorite blogs
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: A list of favorite blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 favorites:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *       404:
 *         description: User not found or no favorite blogs
 *       500:
 *         description: Internal Server Error - An error occurred while retrieving favorite blogs
 */
const GetAllFavoriteBlogs = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    return;
  }
  const userId = req.user.id;
  const { limit = 10, offset = 0 } = req.query;
  try {
    let favBlogs = await users.findOne({
      where: { id: userId },
      include: [
        {
          model: blogs,
          as: "FavoriteBlogs",
          attributes: ["id", "title", "file_id", "body","image","likes", "createdAt"],
          through: { attributes: [] },
        },
      ],
      limit: parseInt(String(limit), 10),
      offset: parseInt(String(offset), 10),
    });
    if (!favBlogs || !(favBlogs as any).FavoriteBlogs) {
      res.status(404).json({ message: "User not found or no favorite blogs" });
      return;
    }
    (favBlogs as any).FavoriteBlogs = await Promise.all((favBlogs as any).FavoriteBlogs.map( async (blog: Model<IBlog>) => {

      let base64Image = null;
      if (blog.getDataValue("file_id") && blog.getDataValue("file_id") !== '') {
          base64Image = await getFileBase64FromDrive(blog.getDataValue("file_id"));
      }
      return {
          ...blog.toJSON(),
          image: base64Image
      };
    }));
    res.status(200).json({
      total: (favBlogs as any).FavoriteBlogs.length,
      favorites: (favBlogs as any).FavoriteBlogs,
    });
  } catch (error) {
    console.error("Error retrieving favorite blogs:", error);
    res.status(500).json({ message: "An error occurred while retrieving favorites." });
  }
};

/**
 * @swagger
 * /user/favorites/{id}:
 *   delete:
 *     summary: Remove a blog from the user's favorites
 *     description: This endpoint removes a blog from the authenticated user's favorites list.
 *     tags:
 *       - Favorites
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the blog to remove from favorites
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Blog successfully removed from favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Favorite deleted successfully."
 *       400:
 *         description: Blog ID is missing or invalid
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Internal Server Error - An error occurred while deleting the favorite
 */
const DeleteFavoriteBlog = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    return;
  }
  const userId = req.user.id;
  const blogId = req.params.id;
  if (!blogId) {
    res.status(400).json({ message: "Blog ID is missing in the request." });
    return;
  }
  try {
    await db.sequelize.transaction(async (t) => {
      const favoriteToDelete = await favorites.findOne({
        where: { userId, blogId },
        transaction: t
      });
      if (!favoriteToDelete) {
        res.status(404).json({ message: "Favorite not found." });
        return;
      }
      await favoriteToDelete.destroy({ transaction: t });
      res.status(200).json({ message: "Favorite deleted successfully." });
    });
  } catch (error) {
    console.error("Error deleting favorite blog:", error);
    res.status(500).json({ message: "An error occurred while deleting the favorite." });
  }
};

/**
 * @swagger
 * /user/favorites:
 *   delete:
 *     summary: Delete all favorites for the user
 *     description: This endpoint removes all blogs from the authenticated user's favorites list.
 *     tags:
 *       - Favorites
 *     responses:
 *       200:
 *         description: All favorites successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All favorites deleted successfully"
 *                 deletedCount:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Internal Server Error
 */
const DeleteAllFavorites = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    return;
  }
  const userId = req.user.id;
  try {
    const deletedCount = await favorites.destroy({
      where: { userId },
    });
    res.status(200).json({
      message: "All favorites deleted successfully",
      deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all favorites:", error);
    res.status(500).json({ message: "An error occurred while deleting all favorites." });
  }
};

/**
 * @swagger
 * /user/favorites/search:
 *   get:
 *     summary: Search favorite blogs with filters and pagination
 *     description: Search through user's favorite blogs by title, description, and update date
 *     tags:
 *       - Favorites
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Items per page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *       - name: title
 *         in: query
 *         description: Search by blog title
 *         required: false
 *         schema:
 *           type: string
 *       - name: description
 *         in: query
 *         description: Search by blog description
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of favorite blogs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: List of favorite blogs
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "My First Blog"
 *                       body:
 *                         type: string
 *                         example: "This is the content of the blog post."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-01T12:00:00Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     totalItems:
 *                       type: integer
 *                       example: 30
 *                     itemsPerPage:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: User ID is required
 *       500:
 *         description: An error occurred
 *     security:
 *       - bearerAuth: []
 */
const SearchFavoriteBlogs = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    return;
  }
  const userId = req.user.id;
  const { page = 1, limit = 10, q } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  try {
    const blogWhereClause: any = {};
    blogWhereClause[Op.or] = [
      { title: { [Op.like]: `%${q}%` } },
      { body: { [Op.like]: `%${q}%` } },
    ];
    const { count, rows } = await favorites.findAndCountAll({
      where: { userId },
      include: [
        {
          model: blogs,
          as: "blog", 
          where: blogWhereClause,
          attributes: ["id", "title", "body", "createdAt"],
        },
      ],
      limit: parseInt(String(limit), 10),
      offset: parseInt(String(offset), 10),
    });
    let favoriteBlogs = rows.map((favorite: any) => favorite.blog).filter(Boolean);
    favoriteBlogs = await Promise.all(favoriteBlogs.map(async (blog: Model<IBlog>) => {
      let base64Image = null;
      if (blog.getDataValue("file_id") && blog.getDataValue("file_id") !== '') {
        base64Image = await getFileBase64FromDrive(blog.getDataValue("file_id"));
      }
      return {
        ...blog.toJSON(),
        image: base64Image
      };
    }));
    res.status(200).json({
      data: favoriteBlogs,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalItems: count,
        itemsPerPage: Number(limit),
      },
    });
  } catch (error: any) {
    console.error("Error searching favorite blogs:", error);
    if (error.name === "SequelizeEagerLoadingError") {
      res.status(500).json({ message: "Database association error. Check your model associations." });
      return;
    }
    res.status(500).json({ message: "An error occurred while searching favorite blogs." });
  }
};

/**
 * @swagger
 * /user/favorites/count:
 *   get:
 *     summary: Get total count of favorite blogs
 *     description: Returns the total number of blogs in the user's favorites
 *     tags:
 *       - Favorites
 *     responses:
 *       200:
 *         description: Successfully retrieved favorites count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalFavorites:
 *                   type: integer
 *                   example: 50
 *       500:
 *         description: Internal Server Error
 */
const GetFavoritesCount = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    return;
  }
  const userId = req.user.id;
  try {
    const count = await favorites.count({
      where: { userId },
    });
    res.status(200).json({
      totalFavorites: count,
    });
  } catch (error) {
    console.error("Error counting favorites:", error);
    res.status(500).json({ message: "An error occurred while counting favorites." });
  }
};

/**
 * @swagger
 * /user/favorites/IsBlogFavorited/{blogId}:
 *   get:
 *     summary: Check if a blog is favorited by the user
 *     description: This endpoint checks if a specific blog is favorited by the authenticated user.
 *     tags:
 *       - Favorites
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
 *         description: Status indicating if the blog is favorited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorited:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal Server Error
 */
const IsBlogFavorited = async (req: Request, res: Response): Promise<void> => {
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
    const favorite = await favorites.findOne({
      where: { userId, blogId },
    });
    res.status(200).json({ isFavorited: !!favorite });
  } catch (error) {
    console.error("Error checking if blog is favorited:", error);
    res.status(500).json({ message: "An error occurred while checking favorite status." });
  }
};

export {
  CreateFavoriteBlog,
  GetAllFavoriteBlogs,
  DeleteFavoriteBlog,
  DeleteAllFavorites,
  SearchFavoriteBlogs,
  GetFavoritesCount,
  IsBlogFavorited
};