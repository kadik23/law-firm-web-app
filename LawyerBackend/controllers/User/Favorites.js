require('dotenv').config();
const db = require('../../models');
const { users, blogs, favorites } = db;

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
const CreateFavoriteBlog = async (req, res) => {
  const userId = req.user.id;
  const { blogId } = req.body;

  if (!blogId) {
    return res.status(400).json({ message: "Blog ID is required." });
  }

  try {
    const blog = await blogs.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const user = await users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingFavorite = await favorites.findOne({ where: { userId, blogId } });
    if (existingFavorite) {
      return res.status(400).json({ message: "Blog is already favorited." });
    }

    const newFavorite = await favorites.create({ userId, blogId });
    res.status(201).json({ message: "Blog added to favorites successfully.", favorite: newFavorite });
  } catch (error) {
    console.error("Error creating favorite blog:", error);
    res.status(500).json({ message: "An error occurred while adding the blog to favorites." });
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
const GetAllFavoriteBlogs = async (req, res) => {
  const userId = req.user.id;
  const { limit = 10, offset = 0 } = req.query;

  try {
    const favoriteBlogs = await users.findOne({
      where: { id: userId },
      include: [
        {
          model: blogs,
          as: 'FavoriteBlogs',
          attributes: ['id', 'title', 'body'],
          through: { attributes: [] },
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    if (!favoriteBlogs) {
      return res.status(404).json({ message: 'User not found or no favorite blogs' });
    }

    res.status(200).json({
      total: favoriteBlogs.FavoriteBlogs.length,
      favorites: favoriteBlogs.FavoriteBlogs,
    });
  } catch (error) {
    console.error('Error retrieving favorite blogs:', error);
    res.status(500).json({ message: 'An error occurred while retrieving favorites.' });
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
const DeleteFavoriteBlog = async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.id;

  if (!blogId) {
    return res.status(400).json({ message: "Blog ID is missing in the request." });
  }

  try {
    const favoriteToDelete = await favorites.findOne({ where: { userId, blogId } });
    if (!favoriteToDelete) {
      return res.status(404).json({ message: "Favorite not found." });
    }

    await favoriteToDelete.destroy();
    res.status(200).json({ message: "Favorite deleted successfully." });
  } catch (error) {
    console.error("Error deleting favorite blog:", error);
    res.status(500).json({ message: "An error occurred while deleting the favorite." });
  }
};

module.exports = {
  CreateFavoriteBlog,
  GetAllFavoriteBlogs,
  DeleteFavoriteBlog,
};
