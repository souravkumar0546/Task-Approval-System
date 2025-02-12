const { Task, TaskApprover, Comment, User } = require('../models');
const { sendEmail } = require('../utils/emailService');

exports.createTask = async (req, res) => {
  const { description, approverIds } = req.body;
  const creatorId = req.user.id;

  try {

    const task = await Task.create({ description, creatorId });
    for (const approverId of approverIds) {

      await TaskApprover.create({
        taskId: task.id,
        approverId,
      });
      const approver = await User.findByPk(approverId);
      if (approver) {
        await sendEmail(
          approver.email,
          "New Task Approval Request",
          `You have been assigned as an approver for Task ID: ${task.id}\n
          Description: ${task.description}\n
          Please review and approve at your earliest convenience.`
        );
      }
    }

    res.json({ message: 'Task created successfully', taskId: task.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addApprover = async (req, res) => {
  const { taskId } = req.params;
  const { approverId } = req.body;
  const userId = req.user.id;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    if (task.creatorId !== userId) throw new Error('Not authorized');


    await TaskApprover.create({
      taskId: task.id,
      approverId,
    });


    const approver = await User.findByPk(approverId);
    if (approver) {
      await sendEmail(
        approver.email,
        "New Task Approval Request",
        `You have been assigned as an approver for Task ID: ${task.id}\n
        Description: ${task.description}\n
        Please review and approve at your earliest convenience.`
      );
    }

    res.json({ message: 'Approver added successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getTasksCreatedByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await Task.findAll({
      where: { creatorId: userId },
      include: [
        {
          model: TaskApprover,
          include: [
            { 
              model: User,
              attributes: ['id', 'email']
            }
          ]
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasksForApprover = async (req, res) => {
  const approverId = req.user.id;

  try {
    const approvals = await TaskApprover.findAll({
      where: { approverId },
      include: [
        {
          model: Task,
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['email']
            },
            {
              model: Comment,
              include: [
                {
                  model: User,
                  attributes: ['id', 'name', 'email']
                }
              ]
            }
          ]
        }
      ]
    });
    res.json(approvals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  try {
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: TaskApprover,
          include: [{
            model: User,
            attributes: ['id', 'email']
          }]
        },
        {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'name', 'email']
          }]
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'email']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const isCreator = task.creatorId === userId;
    const isApprover = task.TaskApprovers.some(
      approver => approver.approverId === userId
    );

    if (!isCreator && !isApprover) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};