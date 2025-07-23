import { Request, Response } from 'express';
import { db } from '@/models/index';
import { upload } from '@/middlewares/FilesMiddleware';
import fs from 'fs';
import { body as bd, validationResult, ValidationError, Result } from 'express-validator';
import { Op, Model, ModelCtor } from 'sequelize';
import { IBlog } from '@/interfaces/Blog';
import { resolve } from 'path';

const blogs: ModelCtor<Model<IBlog>> = db.blogs;
export const uploadFile = upload.single('image');

const deleteFile = (filePath: string) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = 6;
        const offset = (page - 1) * pageSize;

        const { count, rows: blogsList } = await blogs.findAndCountAll({
            limit: pageSize,
            offset: offset,
            where: {userId: req.user.id},
            include: [{
                model: db.categories,
                attributes: ['id', 'name']
            }]
        });

        const updatedBlogsList = await Promise.all(blogsList.map(async (blog) => {
            const blogData = blog.toJSON() as IBlog;
            const filePath = resolve(__dirname, '..', '..', blogData.image);

            let base64Image = null;
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath);
                base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
            }

            return {
                ...blogData,
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
        return ;

    } catch (e) {
        console.error('Error fetching blogs', e);
        res.status(500).send('Internal Server Error');
    }
};

/**
 * @swagger
 * paths:
 *   /admin/blogs/add:
 *     post:
 *       summary: "Create a new blog"
 *       description: "Create a new blog post with an uploaded image."
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
 *                 - title
 *                 - body
 *                 - categoryId
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "My First Blog"
 *                 body:
 *                   type: string
 *                   example: "This is the content of the blog post."
 *                 categoryId:
 *                   type: integer
 *                   example: 1
 *               encoding:
 *                 image:
 *                   contentType: "image/*"
 *       responses:
 *         '200':
 *           description: "Blog created successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Blog'
 *         '400':
 *           description: "Error uploading files"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '500':
 *           description: "Internal Server Error"
 */

export const addBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        uploadFile(req, res, async (err: any) => {
            if (err) {
                res.status(400).send('Error uploading files: ' + err.message);
                return;
            }
            if (!req.user) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            await Promise.all([
                bd('title').isString().withMessage('Title must be a string').isLength({ max: 20 }).notEmpty().withMessage('Title is required').run(req),
                bd('body').isString().withMessage('Body must be a string').notEmpty().withMessage('Body is required').run(req),
                bd('readingDuration').isInt().withMessage('readingDuration must be a number').notEmpty().withMessage('readingDuration is required').run(req),
                bd('categoryId').isInt().withMessage('categoryId must be a number').notEmpty().withMessage('categoryId is required').run(req)
            ]);
            const errors: Result<ValidationError> = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            if (!req.file) {
                res.status(400).json({ error: 'Image is required.' });
                return;
            }
            const { title, body, readingDuration, categoryId } = req.body;
            const imagePath = req.file.path;
            let newBlog: Model<IBlog> = await blogs.create({
                title, likes: 0, body, readingDuration, image: imagePath, categoryId, userId: (req as any).user.id, accepted: true,
            } as IBlog);
            if (!newBlog) {
                res.status(401).send('Error creating blog');
            } else {
                const newBlogData = newBlog.toJSON() as IBlog;
                const blogWithCategory = await blogs.findOne({
                    where: { id: newBlogData.id },
                    include: [{
                        model: db.categories,
                        attributes: ['id', 'name']
                    }]
                });
                return res.status(200).json(blogWithCategory);
            }
        });
    } catch (e: any) {
        console.error('Error creating blog', e);
        res.status(500).send('Internal Server Error');
    }
};
/**
 * @swagger
 * paths:
 *   /admin/blogs/delete:
 *     delete:
 *       summary: "Delete one or multiple blogs"
 *       description: "Delete one or multiple blog posts by providing an array of IDs."
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
 *               properties:
 *                 ids:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1, 2, 3]
 *               required:
 *                 - ids
 *       responses:
 *         '200':
 *           description: "Blogs deleted successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: "3 blogs deleted"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '403':
 *           description: "Forbidden - User is not an admin"
 *         '404':
 *           description: "One or more blogs not found"
 *         '500':
 *           description: "Internal Server Error"
 */

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ success: false, message: 'Invalid request, provide an array of IDs' });
            return;
        }
        const blogsToDelete = await blogs.findAll({ where: { id: { [Op.in]: ids } } }) as (Model<IBlog> & IBlog)[];
        if (blogsToDelete.length === 0) {
            res.status(404).json({ success: false, message: 'No matching blogs found' });
            return;
        }
        blogsToDelete.forEach((blog) => {
            if (blog.image) deleteFile(blog.image);
        });
        const result = await blogs.destroy({ where: { id: { [Op.in]: ids } } });
        res.status(200).json({ success: true, message: `${result} blogs deleted` });
    } catch (error: any) {
        console.error('Error deleting blogs:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

/**
 * @swagger
 * paths:
 *   /admin/blogs/update:
 *     put:
 *       summary: "Update a blog"
 *       description: "Update an existing blog post by its ID."
 *       tags:
 *         - Blogs
 *       security:
 *         - BearerAuth: []
 *         - AdminAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *                 - title
 *                 - body
 *                 - categoryId
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   maxLength: 20
 *                   example: "Updated Blog Title"
 *                 body:
 *                   type: string
 *                   maxLength: 500
 *                   example: "Updated content for the blog post."
 *                 categoryId:
 *                   type: integer
 *                   example: 1
 *                 image:
 *                   type: string
 *                   format: binary
 *                   example: "image.jpg"
 *       responses:
 *         '200':
 *           description: "Blog updated successfully"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '403':
 *           description: "Forbidden - User is not an admin"
 *         '404':
 *           description: "Blog not found"
 *         '500':
 *           description: "Internal Server Error"
 */

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        uploadFile(req, res, async (err: any) => {
            if (err) {
                res.status(400).send('Error uploading files: ' + err.message);
                return;
            }
            await Promise.all([
                bd('title').isString().withMessage('Title must be a string').isLength({ max: 20 }).optional().run(req),
                bd('body').isString().withMessage('Body must be a string').optional().run(req),
                bd('readingDuration').isInt().withMessage('readingDuration must be a number').optional().run(req),
                bd('categoryId').isInt().withMessage('categoryId must be a number').optional().run(req),
                bd('id').isInt().withMessage('id must be a number').notEmpty().withMessage('id is required').run(req)
            ]);
            const errors: Result<ValidationError> = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { title, body, readingDuration, categoryId, id } = req.body;

            const blogToUpdate = await blogs.findByPk(id) as (Model<IBlog> & IBlog) | null;

            if (!blogToUpdate) {
                res.status(404).json({ error: 'Blog not found' });
                return;
            }

            if (req.file) {
                deleteFile(blogToUpdate.image);
                blogToUpdate.image = req.file.path;
            }

            blogToUpdate.set({
                title,
                body,
                readingDuration,
                categoryId,
                image: blogToUpdate.image
            });

            await blogToUpdate.save();

            const blogWithCategory = await blogs.findOne({
                where: { id: blogToUpdate.id },
                include: [{
                    model: db.categories,
                    attributes: ['id', 'name']
                }]
            });

            res.status(200).json({ message: 'Blog updated successfully', blog: blogWithCategory });
        });
    } catch (e: any) {
        console.error('Error updating blog', e);
        res.status(500).send('Internal Server Error');
    }
};

export const filterBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { query } = req;
        const page = parseInt(query.page as string) || 1;
        const pageSize = 6;
        const offset = (page - 1) * pageSize;

        let whereClause: any = {};

        if (req.user) {
            whereClause.userId = req.user.id;
        }

        if (query.categoryId) {
            whereClause.categoryId = query.categoryId;
        }

        if (query.search) {
            whereClause.title = {
                [Op.like]: `%${query.search}%`
            };
        }

        const { count, rows: blogsList } = await blogs.findAndCountAll({
            limit: pageSize,
            offset: offset,
            where: whereClause,
            include: [{
                model: db.categories,
                attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']]
        });
        const updatedBlogsList = await Promise.all(blogsList.map(async (blog) => {
            const blogData = blog.toJSON() as IBlog;
            const filePath = resolve(__dirname, '..', '..', blogData.image);

            let base64Image = null;
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath);
                base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
            }

            return {
                ...blogData,
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
        return ;

    } catch (e) {
        console.error('Error fetching blogs', e);
        res.status(500).send('Internal Server Error');
    }
};