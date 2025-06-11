module.exports = (sequelize, DataTypes) => {
  const TimeSlot = sequelize.define(
    "TimeSlot",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      startHour: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      freeTimeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "time_slots",
      timestamps: false,
      indexes: [{ fields: ["freeTimeId"] }],
    }
  );

  TimeSlot.associate = (models) => {
    TimeSlot.belongsTo(models.FreeTime, {
      foreignKey: "freeTimeId",
      as: "day",
    });
  };

  return TimeSlot;
};
