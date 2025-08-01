import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IAvailableSlot } from '../interfaces/AvailableSlot';

const AvailableSlotFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IAvailableSlot>> => {
  const AvailableSlot = sequelize.define<Model<IAvailableSlot>>('available_slots', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return AvailableSlot;
};

export default AvailableSlotFactory; 