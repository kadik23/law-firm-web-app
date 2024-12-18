module.exports = (sequelize, DataTypes) => {
  const Attorney = sequelize.define('Attorney', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    linkedin_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certificats: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_membership: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  return Attorney;
};
