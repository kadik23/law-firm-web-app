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
        likes:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *           example: "Technology"
 */