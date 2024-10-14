module.exports = (sequelize, DataTypes) => {

    return sequelize.define("files", {
        path: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    })
}