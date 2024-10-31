module.exports = (sequelize, DataTypes) => {

    return sequelize.define("blogs", {
        title: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        body: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        accepted: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    })
}