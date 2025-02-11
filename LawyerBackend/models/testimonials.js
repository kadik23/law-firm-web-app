

module.exports = (sequelize, DataTypes) => {
  const Testimonial = sequelize.define("testimonials", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
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

  // Associations
  Testimonial.associate = (models) => {
    Testimonial.belongsTo(models.users, {
      foreignKey: "userId",
      as: "userTestimonials",
    });

    Testimonial.belongsTo(models.services, {
      foreignKey: "serviceId",
      as: "service",
    });
  };

  return Testimonial;
};

/**
 * @swagger
 * components:
 *  schemas:
 *    Testimonial:
 *      type: object
 *      required:
 *        -id
 *        - userId
 *        - serviceId
 *        - rating
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        userId:
 *          type: integer
 *          example: 1
 *        serviceId:
 *          type: integer
 *          example: 2
 *        rating:
 *          type: integer
 *          minimum: 1
 *          maximum: 5
 *          example: 5
 *        comment:
 *          type: string
 *          example: "Great service!"
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: "2025-02-09T12:00:00Z"
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          example: "2025-02-09T12:30:00Z"
 */
