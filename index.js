const express = require('express');
require('dotenv').config();
require('./config/db');
const cors = require('cors');

const app = express();

// Add this before routes
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/institutes', require('./routes/institutes'));
app.use('/roles', require('./routes/roles'));
app.use('/user-institute-roles', require('./routes/userInstituteRoles'));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'SCOS Server is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});