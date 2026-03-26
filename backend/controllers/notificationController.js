const { notifications } = require('../models');

exports.getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const list = await notifications.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']]
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await notifications.update({ is_read: true }, { where: { notification_id: id } });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createNotification = async (user_id, message) => {
    try {
        await notifications.create({ user_id, message, created_at: new Date() });
    } catch (err) {
        console.error("Error creating notification:", err);
    }
}
