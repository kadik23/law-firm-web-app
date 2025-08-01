import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IService } from '../interfaces/Service';

const ServiceFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IService>> => {
  const Service = sequelize.define<Model<IService>>('services', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requestedFiles: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  
  return Service;
};

export default ServiceFactory;
/**
 * @swagger
 * components:
 *  schemas:
 *    Service:
 *      type: object
 *      required:
 *        - name
 *        - description
 *        - requestedFiles
 *        - coverImage
 *        - price
 *        - createdBy
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "123e4567-e89b-12d3-a456-426614174000"
 *        name:
 *          type: string
 *          example: "Premium Service"
 *        description:
 *          type: string
 *          example: "This is a detailed description of the service."
 *        requestedFiles:
 *          type: array
 *          items:
 *            type: string
 *          example: ["file1.png", "file2.pdf"]
 *        coverImage:
 *          type: string
 *          example: "https://example.com/image.jpg"
 *        price:
 *          type: string
 *          example: "199.99"
 *        createdBy:
 *          type: integer
 *          example: 1
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: "2025-01-01T12:00:00Z"
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          example: "2025-01-01T12:00:00Z"
 */
