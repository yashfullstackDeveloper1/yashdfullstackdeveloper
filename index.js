const express = require('express');
const pool = require('./config/db');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});