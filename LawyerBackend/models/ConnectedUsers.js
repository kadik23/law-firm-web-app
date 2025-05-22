module.exports = (sequelize, DataTypes) => {
    return sequelize.define('connectedusers', {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            socket_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        })
};