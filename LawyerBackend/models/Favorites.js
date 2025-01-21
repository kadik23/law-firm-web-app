module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('favorites', { // Use singular 'Favorite' here
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

  // Corrected: use the singular 'Favorite' in the associations
  Favorite.associate = (models) => {
    // Many-to-many relationship between favorites and blogs
    Favorite.belongsTo(models.blogs, {
      foreignKey: 'blogId',
      as: 'blog'
    });

    // Many-to-many relationship between favorites and users
    Favorite.belongsTo(models.users, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

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
