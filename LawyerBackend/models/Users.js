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
        file: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    })
}