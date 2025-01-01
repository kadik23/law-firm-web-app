module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('favorites', {
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
      onUpdate: DataTypes.NOW,
    },
  });
  return Favorite;
};
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
