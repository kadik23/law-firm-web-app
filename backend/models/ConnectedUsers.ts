import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IConnectedUser } from '../interfaces/ConnectedUser';

const ConnectedUserFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IConnectedUser>> => {
    return sequelize.define<Model<IConnectedUser>>('connectedusers', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        socket_id: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });
};

export default ConnectedUserFactory;