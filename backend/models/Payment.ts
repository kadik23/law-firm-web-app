import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IPayment } from '../interfaces/Payment';

const PaymentFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IPayment>> => {
  const Payment = sequelize.define<Model<IPayment>>('payments', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    request_service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paid_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    remaining_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('CIB', 'EDAHABIYA', 'FREE_CONSULTATION'),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    payment_type: {
      type: DataTypes.ENUM('FULL', 'PARTIAL'),
      allowNull: false,
    },
    chargili_payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chargili_checkout_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    chargili_webhook_data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  
  return Payment;
};

export default PaymentFactory;

