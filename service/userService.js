const { users } = require('../model/userModel');
const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';

exports.register = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully.' });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
};

exports.getAllUsers = (req, res) => {
  res.json(users.map(u => ({ username: u.username })));
};
