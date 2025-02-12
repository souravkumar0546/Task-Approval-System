const User = require('../models/User');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email'],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};