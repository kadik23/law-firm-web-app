import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IPaymentTransaction } from '../interfaces/Payment';

const PaymentTransactionFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IPaymentTransaction>> => {
  const PaymentTransaction = sequelize.define<Model<IPaymentTransaction>>('payment_transactions', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    chargili_transaction_id: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    chargili_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chargili_response_data: {
      type: DataTypes.JSON,
      allowNull: true,
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
  
  return PaymentTransaction;
};

export default PaymentTransactionFactory;

