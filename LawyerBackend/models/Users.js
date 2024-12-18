
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pays: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ville: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sex: {
      type: DataTypes.ENUM('Homme', 'Femme'),
      allowNull: true
  },
  
  terms_accepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

    return User;
  };

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
           - id
 *         - name
 *         - surname
 *         - email
 *         - password
 *         - phone_number
 *         - pays
 *         - ville
 *         - age
 *         - sex
 *         - terms_accepted
 *         - type
 *       properties:
           id:
             type: number
             example: "2"
 *         name:
 *           type: string
 *           maxLength: 20
 *           example: "John"
 *         surname:
 *           type: string
 *           maxLength: 20
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 50
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         phone_number:
 *           type: string
 *           maxLength: 20
 *           example: "+1234567890"
 *         pays:
 *           type: string
 *           example: "France"
 *         ville:
 *           type: string
 *           example: "Paris"
 *         age:
 *           type: integer
 *           example: 30
 *         sex:
 *           type: string
 *           enum:
 *             - Homme
 *             - Femme
 *           example: "Homme"
 *         terms_accepted:
 *           type: boolean
 *           example: true
 *         type:
 *           type: string
 *           example: "admin"
 */
