const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const attendeesRoutes = require('./routes/attendees');
const tablesRoutes = require('./routes/tables');

const app = express();

// Connect to database
connectDB();

// Simplified CORS configuration - we'll add the complex one back later
app.use(cors());

// Basic security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'same-origin');
  next();
});

app.use(express.json());

// Routes
app.use('/api/attendees', attendeesRoutes);
app.use('/api/tables', tablesRoutes);

// Initialize data endpoint
app.post('/api/initialize', async (req, res) => {
  try {
    const result = await require('./controllers/attendees').initializeData();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Event TemplateServer running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});