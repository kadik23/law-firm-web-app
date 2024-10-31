module.exports = (sequelize, DataTypes) => {

    return sequelize.define("files", {
        path: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    })
}