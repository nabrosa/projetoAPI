const userService = require('../service/userService');
const scheduleService = require('../service/scheduleService');
const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';
const { users } = require('../model/userModel');
const { schedules } = require('../model/scheduleModel');

module.exports = {
  Query: {
    users: () => users.map(u => ({ username: u.username })),
  },
  Mutation: {
    register: (_, { username, password }) => {
      if (!username || !password) throw new Error('Username and password are required.');
      if (users.find(u => u.username === username)) throw new Error('User already exists.');
      users.push({ username, password });
      return 'User registered successfully.';
    },
    login: (_, { username, password }) => {
      if (!username || !password) throw new Error('Username and password are required.');
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) throw new Error('Invalid credentials.');
      const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
      return { token };
    },
    registerSchedule: (_, { day, time }, { user }) => {
      if (!user) throw new Error('Authentication required.');
      if (!day || !time) throw new Error('Day and time are required.');
      if (schedules.find(s => s.username === user.username && s.day === day && s.time === time)) {
        throw new Error('Schedule already exists for this user at this time.');
      }
      schedules.push({ username: user.username, day, time });
      return 'Schedule registered successfully.';
    },
  },
};
