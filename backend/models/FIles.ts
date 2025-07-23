import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IFile } from '../interfaces/File';

const FileFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IFile>> => {
    return sequelize.define<Model<IFile>>("files", {
        path: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });
};

export default FileFactory;

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
