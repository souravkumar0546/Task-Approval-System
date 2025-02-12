const TaskApprover = require('../models/TaskApprover');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

exports.approveTask = async (req, res) => {
  const approverId = req.user.id;
  const { taskId } = req.params;

  try {
    const approverRecord = await TaskApprover.findOne({
      where: { taskId, approverId },
      include: [{ model: Task }],
    });

    if (!approverRecord) throw new Error('Not authorized to approve this task');

    if (approverRecord.approved) throw new Error('Task already approved by you');

    if (approverRecord.Task.status !== 'Awaiting Approval') throw new Error('Task is not awaiting approval');

    approverRecord.approved = true;
    await approverRecord.save();

    const taskCreator = await User.findByPk(approverRecord.Task.creatorId);
    await sendEmail(
      taskCreator.email,
      'Task Approved',
      `Your task ID: ${taskId} has been approved by ${req.user.email}`
    );

    const approvedCount = await TaskApprover.count({
      where: { taskId, approved: true },
    });

    if (approvedCount >= 3) {
      const task = await Task.findByPk(taskId);
      task.status = 'Approved';
      await task.save();

      const approvers = await TaskApprover.findAll({
        where: { taskId },
        include: [{ model: User, attributes: ['email'] }],
      });

      const emails = approvers.map((a) => a.User.email);
      emails.push(taskCreator.email);

      await sendEmail(
        emails,
        'Task Fully Approved',
        `Task ID: ${taskId} has received 3 approvals and is now Approved.`
      );
    }

    res.json({ message: 'Task approved successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};