module.exports = (sequelize, DataTypes) => {
    const commentsLikes = sequelize.define("commentsLikes", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        commentId: {
            type:DataTypes.INTEGER,
            allowNull: false
        }
    });

    return commentsLikes;
};
/**
 * @swagger
 * components:
 *   schemas:
 *     CommenstLikes:
 *       type: object
 *       required:
 *         - userId
 *         -commentId
 *       properties:
 *         userId:
 *           type: integer
 *         commentId:
 *           type: integer
 */