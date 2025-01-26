module.exports = (sequelize, DataTypes) => {

    return sequelize.define("categories", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
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