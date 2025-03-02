module.exports = (sequelize, DataTypes) => {
  const ServiceFilesUploaded = sequelize.define('service_files_uploaded', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,

    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Accepted', 'Pending', 'Refused'),
      allowNull: false,
      defaultValue: "Pending",
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  ServiceFilesUploaded.associate = (models) => {
    ServiceFilesUploaded.belongsTo(models.request_service, {
      foreignKey: 'service_id',
      as: 'requestService'
    });
  };

  return ServiceFilesUploaded;
};
