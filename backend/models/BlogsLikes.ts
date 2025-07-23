import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { ILike } from '../interfaces/Like';

const LikeFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<ILike>> => {
  const Like = sequelize.define<Model<ILike>>('like', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  
  return Like;
};

export default LikeFactory;

/**
* @swagger
* components:
*  schemas:
*    Like:
*      type: object
*      required:
*        - userId
*        - blogId
*      properties:
*        userId:
*          type: integer
*          example: 42
*        blogId:
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
*
* */
