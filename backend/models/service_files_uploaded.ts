import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IServiceFilesUploaded } from '../interfaces/ServiceFilesUploaded';

const ServiceFilesUploadedFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IServiceFilesUploaded>> => {
  const ServiceFilesUploaded = sequelize.define<Model<IServiceFilesUploaded>>('service_files_uploaded', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    request_service_id: {
      type: DataTypes.INTEGER,
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
    file_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
  
  return ServiceFilesUploaded;
};

export default ServiceFilesUploadedFactory;
