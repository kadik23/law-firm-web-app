module.exports = (sequelize, DataTypes) => {
    const ConnectedUsers = sequelize.define('connectedusers', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        socket_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
        return ConnectedUsers
}