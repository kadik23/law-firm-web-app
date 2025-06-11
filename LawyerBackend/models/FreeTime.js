module.exports = (sequelize, DataTypes) => {
  const FreeTime = sequelize.define(
    "FreeTime",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      attorneyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day: {
        type: DataTypes.ENUM(
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ),
        allowNull: false,
      },
    },
    {
      tableName: "free_times",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["attorneyId", "day"],
        },
      ],
    }
  );

  FreeTime.associate = (models) => {
    FreeTime.hasMany(models.TimeSlot, {
      foreignKey: "freeTimeId",
      as: "slots",
      onDelete: "CASCADE",
      hooks: true,
    });
  };

  return FreeTime;
};
