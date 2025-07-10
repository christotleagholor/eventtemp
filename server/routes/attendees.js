const express = require('express');
const router = express.Router();
const attendeesController = require('../controllers/attendees');


// Get all attendees (with optional assigned filter)
router.get('/', async (req, res) => {
  try {
    const assignedOnly = req.query.assigned === 'true';
    const attendees = await attendeesController.getAttendees(assignedOnly);
    res.json(attendees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign attendee to table
router.post('/assign', async (req, res) => {
  try {
    const { attendeeId, name, tableId } = req.body;
    const result = await attendeesController.assignAttendee(attendeeId, name, tableId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unassign attendee (remove from table)
router.patch('/:attendeeId/unassign', async (req, res) => {
  const { attendeeId } = req.params;
  console.log(`Received unassign request for: ${attendeeId}`);

  try {
    const result = await attendeesController.unassignAttendee(attendeeId);
    console.log(`Unassign successful for: ${attendeeId}`);
    
    res.json({
      success: true,
      data: result,
      message: 'Attendee unassigned successfully'
    });
  } catch (err) {
    console.error(`Unassign failed for ${attendeeId}:`, err);
    
    const statusCode = err.message === 'Attendee not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

// Move attendee to different table
router.patch('/:attendeeId/move', async (req, res) => {  // Changed from :id to :attendeeId
  try {
    const attendeeId = req.params.attendeeId;
    const { newTableId } = req.body;
    const result = await attendeesController.moveAttendee(attendeeId, newTableId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset all attendees (unassign everyone)
router.post('/reset', async (req, res) => {
  try {
    const result = await attendeesController.resetAttendees();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific attendee by ID
router.get('/:attendeeId', async (req, res) => {  // Changed from :id to :attendeeId
  try {
    const attendeeId = req.params.attendeeId;
    const attendee = await attendeesController.getAttendeeById(attendeeId);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    res.json(attendee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;