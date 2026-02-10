import Alert from "../models/alert.model.js";

// =======================
// GET USER ALERTS
// =======================
export const getUserAlerts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const alerts = await Alert.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

// =======================
// MARK ALERT AS READ
// =======================
export const markAlertAsRead = async (req, res, next) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { isRead: true },
      { new: true }
    );

    res.status(200).json(alert);
  } catch (error) {
    next(error);
  }
};
