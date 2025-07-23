import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IConsultation } from '../interfaces/Consultation';

const ConsultationFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IConsultation>> => {
  const Consultation = sequelize.define<Model<IConsultation>>('Consultation', {
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
    problem_name: {
      type: DataTypes.TEXT,
      allowNull:false
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
  
  return Consultation;
};

export default ConsultationFactory;

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
