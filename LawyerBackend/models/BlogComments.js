module.exports = (sequelize, DataTypes) => {

    return sequelize.define("blog_comments", {
        body: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        blogId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW,
            allowNull: false
        },
        isAReply: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        originalCommentId:{
            type: DataTypes.INTEGER
        }
    })
}
/**
 * @swagger
 * components:
 *   schemas:
 *     BlogComment:
 *       type: object
 *       properties:
 *         body:
 *           type: string
 *           description: The content of the blog comment.
 *           maxLength: 500
 *         userId:
 *           type: integer
 *           description: The ID of the user who created the comment.
 *         blogId:
 *           type: integer
 *           description: The ID of the blog to which this comment belongs.
 *         likes:
 *           type: integer
 *           description: The number of likes the comment has received.
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the comment was created.
 *         isAReply:
 *           type: boolean
 *           description: Indicates if the comment is a reply to another comment.
 *         originalCommentId:
 *           type: integer
 *           nullable: true
 *           description: The ID of the original comment if this comment is a reply.
 *       required:
 *         - body
 *         - userId
 *         - blogId
 *         - likes
 *         - createdAt
 *         - isAReply
 */