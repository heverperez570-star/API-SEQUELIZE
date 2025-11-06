'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuarios', {
      id: {
        field:"id",
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        field:"username",
        allowNull:false,
        type: Sequelize.STRING
      },
      email: {
        field:"email",
        allowNull:false,
        unique:true,
        type: Sequelize.STRING
      },
      password: {
        field:"password",
        type: Sequelize.STRING,
        allowNull:false
      },
      is_active: {
        field:"is_active",
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        field:"created_at",
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        field:"updated_at",
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("CURRENT_TIMESTAMP")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};