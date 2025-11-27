'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuarioId: {
        field: "usuario_id",
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      refreshToken: {
        field: "refresh_token",
        type: Sequelize.STRING,
        allowNull: false,
      },
      issuedTime: {
        field: "issued_time",
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.fn("CURRENT_TIMESTAMP"),
      },
      expirationTime: {
        field: "expiration_time",
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("CURRENT_TIMESTAMP"),
      },
      createdAt: {
        field: "created_at",
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        field: "updated_at",
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("CURRENT_TIMESTAMP"),
      },
      deletedAt: {
        field: "deleted_at",
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint("refresh_tokens", {
      fields: ["usuario_id"],
      type: "foreign key",
      name: "fk_refresh_tokens_usuarios",
      references: {
        table: "usuarios",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('refresh_tokens');
  }
};