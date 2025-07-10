const Attendee = require('../models/Attendee');
const Table = require('../models/Table');


exports.getAttendees = async (assignedOnly = false) => {
  const query = assignedOnly ? { assigned: true } : {};
  return await Attendee.find(query);
};

exports.assignAttendee = async (attendeeId, name, tableId) => {
  const tableExists = await Table.exists({ id: tableId });
  if (!tableExists) {
    throw new Error('Table does not exist');
  }

  let attendee = await Attendee.findOne({ id: attendeeId });
  
  if (!attendee) {
    attendee = new Attendee({ id: attendeeId, name, tableId, assigned: true });
  } else {
    attendee.name = name;
    attendee.tableId = tableId;
    attendee.assigned = true;
  }

  return await attendee.save();
};

exports.unassignAttendee = async (attendeeId) => {
  try {
    const attendee = await Attendee.findOne({ id: attendeeId });
    if (!attendee) {
      throw new Error('Attendee not found');
    }

    // Use findOneAndUpdate to bypass validation if needed
    const updatedAttendee = await Attendee.findOneAndUpdate(
      { id: attendeeId },
      { 
        $set: { 
          assigned: false,
          tableId: null // Using null instead of empty string
        } 
      },
      { new: true, runValidators: false } // Temporarily disable validators
    );

    if (!updatedAttendee) {
      throw new Error('Failed to update attendee');
    }

    return updatedAttendee;
  } catch (err) {
    console.error('Unassign error:', err);
    throw err;
  }
};

exports.resetAttendees = async () => {
  await Attendee.updateMany(
    { assigned: true },
    { $set: { assigned: false, tableId: '' } }
  );
  return { success: true };
};

// Update the getAttendeeById method
exports.getAttendeeById = async (attendeeId) => {  // Changed from id to attendeeId
  return await Attendee.findOne({ id: attendeeId });
};