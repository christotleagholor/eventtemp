const express = require('express');
const router = express.Router();
const tablesController = require('../controllers/tables');


// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await tablesController.getTables();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get table by ID
router.get('/:tableId', async (req, res) => {  // Changed from :id to :tableId
  try {
    const tableId = req.params.tableId;
    const table = await tablesController.getTableById(tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendees for a specific table
router.get('/:tableId/attendees', async (req, res) => {  // Changed from :id to :tableId
  try {
    const tableId = req.params.tableId;
    const attendees = await tablesController.getTableAttendees(tableId);
    res.json(attendees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;