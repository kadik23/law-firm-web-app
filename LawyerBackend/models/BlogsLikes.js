module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('like', {
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

  Like.associate = (models) => {
    Like.belongsTo(models.blogs, {
      foreignKey: 'blogId',
      as: 'blog'
    });

    Like.belongsTo(models.users, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Like;
};

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
