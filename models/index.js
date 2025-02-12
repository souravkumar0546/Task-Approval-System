const User = require('./User');
const Task = require('./Task');
const TaskApprover = require('./TaskApprover');
const Comment = require('./Comment');


function defineRelationships() {
  User.hasMany(Task, { foreignKey: 'creatorId', as: 'createdTasks' });
  User.hasMany(TaskApprover, { foreignKey: 'approverId', as: 'approvals' });
  User.hasMany(Comment, { foreignKey: 'userId' });

  Task.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
  Task.hasMany(TaskApprover, { foreignKey: 'taskId' });
  Task.hasMany(Comment, { foreignKey: 'taskId' });

  TaskApprover.belongsTo(Task, { foreignKey: 'taskId' });
  TaskApprover.belongsTo(User, { foreignKey: 'approverId' });

  Comment.belongsTo(Task, { foreignKey: 'taskId' });
  Comment.belongsTo(User, { foreignKey: 'userId' });
}

module.exports = {
  User,
  Task,
  TaskApprover,
  Comment,
  defineRelationships
};