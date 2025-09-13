const { schedules } = require('../model/scheduleModel');

exports.registerSchedule = (req, res) => {
  const { day, time } = req.body;
  if (!day || !time) {
    return res.status(400).json({ message: 'Day and time are required.' });
  }
  const username = req.user.username;
  // Only one schedule per user per day/time
  const exists = schedules.find(s => s.username === username && s.day === day && s.time === time);
  if (exists) {
    return res.status(409).json({ message: 'Schedule already exists for this user at this time.' });
  }
  schedules.push({ username, day, time });
  res.status(201).json({ message: 'Schedule registered successfully.' });
};
