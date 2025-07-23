import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { ICategory } from '../interfaces/Category';

const CategoryFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<ICategory>> => {
    const Category = sequelize.define<Model<ICategory>>("categories", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    });
    
    return Category;
};

export default CategoryFactory;
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