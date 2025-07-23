import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IProblem } from '../interfaces/Problem';

const ProblemFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IProblem>> => {
  const Problem = sequelize.define<Model<IProblem>>('Problem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  
  return Problem;
};

export default ProblemFactory;

/**
* @swagger
* components:
*  schemas:
*    Problem:
*      type: object
*      required:
*        - name
*        - service_id
*        - category_id
*      properties:
*        id:
*          type: integer
*          example: 1
*        name:
*          type: string
*          example: "Divorce Case"
*        service_id:
*          type: integer
*          example: 101
*        category_id:
*          type: integer
*          example: 202
*
*/
