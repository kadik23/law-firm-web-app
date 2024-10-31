module.exports = (sequelize, DataTypes) => {

    return sequelize.define("categories", {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    })
}