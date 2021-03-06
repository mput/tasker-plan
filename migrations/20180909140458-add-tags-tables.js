module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Tags', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }).then(() => queryInterface.createTable('TasksTags', {
    TaskId: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Tasks',
        key: 'id',
      },
      onDelete: 'cascade',
    },
    TagId: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Tags',
        key: 'id',
      },
      onDelete: 'cascade',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  })),
  down: queryInterface => queryInterface.dropTable('TasksTags').then(() => queryInterface.dropTable('Tags')),
};
