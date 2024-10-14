const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const posts = [
  {
    name: "CBIT",
    title: "Welcome to CBIT"
  },
  {
    name: "MGIT",
    title: "Welcome to MGIT"
  }
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' }); // Set expiration
  res.json({ accessToken }); // Fix: Use "accessToken" instead of "accessTokenis"
});

// Use the authenticateToken middleware for the posts route
app.get('/posts', authenticateToken, (req, res) => {
  console.log(req.user.name);
  res.json(posts.filter(post => post.name === req.user.name));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
