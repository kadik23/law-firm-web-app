module.exports = (sequelize, DataTypes) => {

    return sequelize.define("users", {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        pays: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ville: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sex: {
            type: DataTypes.ENUM('Homme', 'Femme'),
            allowNull: false,
        },
        terms_accepted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
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