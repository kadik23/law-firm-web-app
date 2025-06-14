module.exports = (sequelize, DataTypes) => {
  const RequestService = sequelize.define('request_service', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Completed', 'Pending', 'Canceled'),
      allowNull: false,
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  });

  RequestService.associate = (models) => {
    RequestService.belongsTo(models.users, {
      foreignKey: 'clientId',
      as: 'client'
    });
    RequestService.belongsTo(models.services, {
      foreignKey: 'serviceId',
      as: 'service'
    });

    RequestService.hasMany(models.service_files_uploaded, {
      foreignKey: 'request_service_id',
      as: 'filesUploaded'
    });
  };

  return RequestService;
};
