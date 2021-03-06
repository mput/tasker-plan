const emptyStringToNull = string => (string === '' ? null : string);
const nullToString = val => (val === null ? '' : val);

export default (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Please provide field within 1 to 50 characters.',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      get() {
        return nullToString(this.getDataValue('description'));
      },
      set(val) {
        this.setDataValue('description', emptyStringToNull(val));
      },
    },
    AssignedToId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      set(val) {
        this.setDataValue('AssignedToId', emptyStringToNull(val));
      },
    },
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User, { as: 'Creator' });
    Task.belongsTo(models.User, { as: 'AssignedTo' });
    Task.belongsTo(models.Status);
    Task.belongsToMany(models.Tag, { through: 'TasksTags' });
  };

  Task.loadScopes = (models) => {
    const { Op } = models.Sequelize;
    Task.addScope('withAssotiation', {
      include: [
        { model: models.User, as: 'Creator' },
        { model: models.User, as: 'AssignedTo' },
        models.Status],
      order: [['updatedAt', 'DESC']],
    });
    Task.addScope('assignedToUser', email => ({
      include: [
        { model: models.User, as: 'AssignedTo', where: { email } },
      ],
    }));
    Task.addScope('createdByUser', email => ({
      include: [
        { model: models.User, as: 'Creator', where: { email } },
      ],
    }));
    Task.addScope('hasStatusId', StatusId => ({
      where: { StatusId },
    }));
    Task.addScope('hasTags', tags => ({
      include: [
        {
          model: models.Tag,
          where: {
            name: { [Op.in]: tags },
          },
        },
      ],
    }));
  };

  return Task;
};
