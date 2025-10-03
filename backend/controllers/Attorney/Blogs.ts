
import { body as bd, validationResult, ValidationError, Result } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();
import { db } from '@/models/index';
import { resolve } from 'path';
import fs, { existsSync, readFileSync } from 'fs';
import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize';
import { IBlog } from '@/interfaces/Blog';
import { upload, uploadToDrive, getFileBase64FromDrive, deleteFileFromDrive} from '@/middlewares/FilesMiddleware';

const blogs: ModelCtor<Model<IBlog>> = db.blogs;

import { Op } from 'sequelize';
import { createNotification } from '../createNotification';
// Helper for deleting files
const deleteFile = (filePath: string) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// GET /attorney/blogs?status=accepted|pending|refused&page=1
const getMyBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user || req.user.type !== 'attorney') {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = 6;
        const offset = (page - 1) * pageSize;
        let where: any = { userId: req.user.id };
        if (req.query.status) {
          if (req.query.status === 'accepted') {
            where.accepted = true;
          } else if (req.query.status === 'pending') {
            where.accepted = false;
            where.rejectionReason = null;
          } else if (req.query.status === 'refused') {
            where.accepted = false;
            where.rejectionReason = { [Op.not]: null };
          }
        }
        const { count, rows: blogsList } = await blogs.findAndCountAll({
            limit: pageSize,
            offset,
            where,
            order: [['createdAt', 'DESC']]
        });
        const updatedBlogsList = await Promise.all(blogsList.map(async (blog: Model<IBlog>) => {
            const blogData = blog.toJSON() as IBlog;

            let base64Image = null;
            if (blogData.file_id && blogData.file_id !== '') {
                base64Image = await getFileBase64FromDrive(blogData.file_id);
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
    } catch (e) {
        console.error('Error fetching attorney blogs', e);
        res.status(500).send('Internal Server Error');
    }
};

// POST /attorney/blogs
const addMyBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        upload.single('image')(req, res, async (err: any) => {
            if (err) {
                res.status(400).send('Error uploading files: ' + err.message);
                return;
            }
            if (!req.user || req.user.type !== 'attorney') {
                return res.status(401).json({ error: 'Unauthorized' });
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
            const fileId = await uploadToDrive(
                req.file.path,
                req.file.originalname,
                req.file.mimetype
            );
            const { title, body, readingDuration, categoryId } = req.body;
            const imagePath = req.file.path;
            let newBlog: Model<IBlog> = await blogs.create({
                title, likes: 0, body, readingDuration, image: imagePath, categoryId, userId: req.user.id, accepted: false, rejectionReason: null, file_id: fileId
            } as IBlog);
            if (!newBlog) {
                res.status(401).send('Error creating blog');
            } else {
                const newBlogData = newBlog.toJSON() as IBlog;
                let notif = await createNotification(
                    "Blogs",
                    `Avocat ${req.user.name} requi a ajouté un article : ${newBlogData.title}`,
                    2,
                    newBlogData.id as number,
                    newBlogData.userId as number,
                );
                if (!notif) {
                    res.status(200).send("Blog created but notification no");
                } else {
                    res.status(200).json(newBlogData);
                }
            }
        });
    } catch (e: any) {
        console.error('Error creating blog', e);
        res.status(500).send('Internal Server Error');
    }
};

// GET /attorney/blogs/:id
const getMyBlogById = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user || req.user.type !== 'attorney') {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        let blog = await blogs.findOne({ where: { id, userId: req.user.id } });
        if (!blog) {
            res.status(404).json({ message: 'Blog not found' });
            return;
        }
        let base64Image = null;
        if (blog.getDataValue('file_id') && blog.getDataValue('file_id') !== '') {
            base64Image = await getFileBase64FromDrive(blog.getDataValue('file_id'));
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

// PUT /attorney/blogs/:id
const updateMyBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        upload.single('image')(req, res, async (err: any) => {
            if (err) {
                res.status(400).send('Error uploading files: ' + err.message);
                return;
            }
            if (!req.user || req.user.type !== 'attorney') {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const blogToUpdate = await blogs.findOne({ where: { id, userId: req.user.id } }) as (Model<IBlog> & IBlog) | null;
            if (!blogToUpdate) {
                res.status(404).json({ error: 'Blog not found' });
                return;
            }
            if (blogToUpdate.accepted) {
                res.status(403).json({ error: 'Cannot update an accepted blog.' });
                return;
            }
            await Promise.all([
                bd('title').isString().withMessage('Title must be a string').optional().run(req),
                bd('body').isString().withMessage('Body must be a string').optional().run(req),
                bd('readingDuration').isInt().withMessage('readingDuration must be a number').optional().run(req),
                bd('categoryId').isInt().withMessage('categoryId must be a number').optional().run(req)
            ]);
            const errors: Result<ValidationError> = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const { title, body, readingDuration, categoryId } = req.body;
            let fileId;

            if (req.file) {
            deleteFile(blogToUpdate.image);
                if (blogToUpdate.file_id && blogToUpdate.file_id !== '') {
                    await deleteFileFromDrive(blogToUpdate.file_id);
                }
                fileId  = await uploadToDrive(
                    req.file.path,
                    req.file.originalname,
                    req.file.mimetype
                );
                blogToUpdate.image = req.file.path;
            }
            if (title) blogToUpdate.title = title;
            if (body) blogToUpdate.body = body;
            if (blogToUpdate.rejectionReason) {
                blogToUpdate.rejectionReason = null;
                blogToUpdate.accepted = false;
            }
            blogToUpdate.file_id = fileId || blogToUpdate.file_id;
            if (readingDuration) blogToUpdate.readingDuration = readingDuration;
            if (categoryId) blogToUpdate.categoryId = categoryId;
            await createNotification(
                "Blogs",
                `Avocat ${req.user.name} a mis à jour un article : ${blogToUpdate.title}`,
                2,
                blogToUpdate.id as number,
                blogToUpdate.userId as number,
            );
            await blogToUpdate.save();
            res.status(200).json({ message: 'Blog updated successfully', blog: blogToUpdate });
        });
    } catch (e: any) {
        console.error('Error updating blog', e);
        res.status(500).send('Internal Server Error');
    }
};

// DELETE /attorney/blogs (bulk delete)
const deleteMyBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user || req.user.type !== 'attorney') {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ success: false, message: 'Invalid request, provide an array of IDs' });
            return;
        }
        const blogsToDelete = await blogs.findAll({ where: { id: { [Op.in]: ids }, userId: req.user.id } }) as (Model<IBlog> & IBlog)[];
        if (blogsToDelete.length === 0) {
            res.status(404).json({ success: false, message: 'No matching blogs found' });
            return;
        }
        blogsToDelete.forEach(async (blog) => {
        if (blog.image) {
                if (blog.file_id && blog.file_id !== '') {
                    await deleteFileFromDrive(blog.file_id);
                }
                deleteFile(blog.image);
            }
        });
        const result = await blogs.destroy({ where: { id: { [Op.in]: ids }, userId: req.user.id } });
        res.status(200).json({ success: true, message: `${result} blogs deleted` });
    } catch (error: any) {
        console.error('Error deleting blogs:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

export{
    getMyBlogs,
    addMyBlog,
    getMyBlogById,
    updateMyBlog,
    deleteMyBlogs
}