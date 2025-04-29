module.exports = (sequelize, DataTypes) => {
  const Attorney = sequelize.define('Attorney', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    linkedin_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_membership: {
      type: DataTypes.DATE,
      allowNull: false
    },
    picture_path: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  });
  return Attorney;
};
/**
* @swagger
* components:
*  schemas:
*    Attorney:
*      type: object
*      required:
*        - user_id
*        - status
*        - date_membership
*      properties:
*        id:
*          type: integer
*          example: 1
*        user_id:
*          type: integer
*          example: 42
*        status:
*          type: string
*          default: "pending"
*          example: "approved"
*        linkedin_url:
*          type: string
*          example: "https://linkedin.com/in/attorney"
*        date_membership:
*          type: string
*          format: date-time
*          example: "2025-01-01T12:00:00Z"
*
* */
