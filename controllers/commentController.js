const {Comment} = require('../models');

exports.addComment = async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.create({
      taskId,
      userId,
      text,
    });

    res.json({ message: 'Comment added', commentId: comment.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};