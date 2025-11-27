'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RefreshTokens.belongsTo(models.Usuario,{
        foreignKey: "usuario_id",
        onDelete:"NO ACTION",
        onUpdate:"NO ACTION",
      });
    }
  }
  RefreshTokens.init({
    id:{
      field:"id",
      type:DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    usuarioId: {
      field:"usuario_id",
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:"usuarios",
        key:"id",
      }
    },
    refreshToken: {
      field: "refresh_token",
      type: DataTypes.STRING,
      allowNull: false,
    },
    issuedTime: {
      field: "issued_time",
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    expirationTime:{
      field: "expiration_time",
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    createdAt:{
      field:"created_at",
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt:{
      field:"updated_at",
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
     deletedAt:{
      field:"deleted_at",
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'RefreshToken',
    name:{
      singular: "RefreshToken",
      plural: "RefreshTokens",
    },
    tableName: "refresh_tokens",
  });
  return RefreshTokens;
};