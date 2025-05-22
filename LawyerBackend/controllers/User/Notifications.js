const db = require('../../models')
const notif=db.notifications
const getAllNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 8;
        const offset = (page - 1) * pageSize;


        const { count, rows: notifList } = await notif.findAndCountAll({
            limit: pageSize,
            offset: offset,
        });
        const notifIds = notifList.map(n => n.id);
        await notif.update(
            { isRead: true },
            {
                where: {
                    id: notifIds
                }
            }
        );

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(count / pageSize),
            totalNotifications: count,
            notifications: notifList
        });

    } catch (e) {
        console.error('Error fetching notifications', e);
        res.status(500).send('Internal Server Error');
    }
};

const getUnreadNotificationsCount = async (req, res) => {
    try {
        const count = await notif.count({
            where: {
                isRead: false
            }
        });

        return res.status(200).json({
            success: true,
            unreadNotifications: count
        });

    } catch (e) {
        console.error('Error fetching unread notifications count', e);
        res.status(500).send('Internal Server Error');
    }
};


module.exports={
    getAllNotifications,
    getUnreadNotificationsCount
}