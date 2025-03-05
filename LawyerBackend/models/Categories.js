module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("categories", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    });

    Category.associate = function(models) {
        Category.hasMany(models.problems, { foreignKey: "category_id", as: "problems" });
    };
    
    return Category;
};
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