import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IRequestService } from '../interfaces/RequestService';

const RequestServiceFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IRequestService>> => {
  const RequestService = sequelize.define<Model<IRequestService>>('request_service', {
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
  
  return RequestService;
};

export default RequestServiceFactory;
