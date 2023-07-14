const { DataTypes } = require("sequelize");

module.exports = {
  fields: {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    passHash: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  options: {
    indexes: [
      {
        unique: true,
        fields: ["id"],
      },
    ],
  },
};
