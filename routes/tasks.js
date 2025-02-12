const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const approvalController = require('../controllers/approvalController');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Task routes
router.post('/', authMiddleware, taskController.createTask);
router.put('/:taskId/approvers', authMiddleware, taskController.addApprover);
router.get('/created', authMiddleware, taskController.getTasksCreatedByUser);
router.get('/approvals', authMiddleware, taskController.getTasksForApprover);
router.get('/:taskId',authMiddleware,taskController.getTaskById);

// Approval route
router.post('/:taskId/approve', authMiddleware, approvalController.approveTask);

// Comment route
router.post('/:taskId/comments', authMiddleware, commentController.addComment);

module.exports = router;