import { Request, Response } from 'express';
import { db } from '@/models/index';
import { Model, ModelCtor } from 'sequelize';
import { INotification } from '@/interfaces/Notification';

const notif: ModelCtor<Model<INotification>> = db.notifications;

export const getAllNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = 6;
        const offset: number = (page - 1) * pageSize;
        const { count, rows: notifList } = await notif.findAndCountAll({
            where: { userId },
            limit: pageSize,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });
        const notifIds = notifList.map((n: Model<INotification>) => n.getDataValue('id')).filter((id): id is number => typeof id === 'number');
        await notif.update(
            { isRead: true },
            {
                where: {
                    id: notifIds
                }
            }
        );
        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(count / pageSize),
            totalNotifications: count,
            notifications: notifList
        });
    } catch (e: any) {
        console.error('Error fetching notifications', e);
        res.status(500).send('Internal Server Error');
    }
};

export const getUnreadNotificationsCount = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const count: number = await notif.count({
            where: {
                userId,
                isRead: false
            }
        });
        res.status(200).json({
            success: true,
            unreadNotifications: count
        });
    } catch (e: any) {
        console.error('Error fetching unread notifications count', e);
        res.status(500).send('Internal Server Error');
    }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const notificationId = parseInt(req.params.id, 10);
        if (isNaN(notificationId)) {
            res.status(400).json({ success: false, message: 'Invalid notification ID' });
            return;
        }
        const deleted = await notif.destroy({ where: { id: notificationId, userId } });
        if (deleted) {
            res.status(200).json({ success: true, message: 'Notification deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Notification not found' });
        }
    } catch (e: any) {
        console.error('Error deleting notification', e);
        res.status(500).send('Internal Server Error');
    }
};