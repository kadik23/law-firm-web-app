module.exports = (sequelize, DataTypes) => {
  const Consultation = sequelize.define('Consultation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    problem_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    problem_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Accepted', 'Pending', 'Canceled'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    mode: {
      type: DataTypes.ENUM('online', 'onsite'),
      allowNull: false
    },
    meeting_link: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Consultation.associate = function (models) {
    if (!models.users) {
      throw new Error("User model is not defined!");
    }
    Consultation.belongsTo(models.users, { foreignKey: 'client_id', as: 'client' });
  };


  return Consultation;
};

/**
* @swagger
* components:
*  schemas:
*    Consultation:
*      type: object
*      required:
*        - problem_id
*        - client_id
*        - problem_description
*        - time
*        - date
*        - status
*        - mode
*      properties:
*        id:
*          type: string
*          example: "abc123"
*        problem_id:
*          type: string
*          example: "problem-001"
*        client_id:
*          type: string
*          example: "client-123"
*        problem_description:
*          type: string
*          example: "User cannot reset password."
*        time:
*          type: string
*          example: "14:30"
*        date:
*          type: string
*          format: date
*          example: "2025-02-20"
*        status:
*          type: string
*          enum: ["Accepted", "Pending", "Canceled"]
*          example: "Pending"
*        mode:
*          type: string
*          enum: ["online", "onsite"]
*          example: "online"
*        meeting_link:
*          type: string
*          nullable: true
*          example: "https://meet.example.com/xyz"
*/
