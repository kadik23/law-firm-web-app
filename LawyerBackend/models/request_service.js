module.exports = (sequelize, DataTypes) => {
  const RequestService = sequelize.define('request_service', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      foreignKey: 'service_id',
      as: 'filesUploaded'
    });
  };

  return RequestService;
};
