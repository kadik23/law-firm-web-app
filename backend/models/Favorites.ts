import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IFavorite } from '../interfaces/Favorite';

const FavoriteFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IFavorite>> => {
  const Favorite = sequelize.define<Model<IFavorite>>('favorites', {
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
  
  return Favorite;
};

export default FavoriteFactory;

/**
* @swagger
* components:
*  schemas:
*    Favorite:
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
