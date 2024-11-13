module.exports = (sequelize, DataTypes) => {

    return sequelize.define("files", {
        path: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    })
}
/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - path
 *         - userId
 *       properties:
 *         path:
 *           type: string
 *           maxLength: 50
 *           description: Path of the uploaded file
 *           example: "/uploads/file123.jpg"
 *         userId:
 *           type: integer
 *           description: ID of the user who uploaded the file
 *           example: 1
 */
