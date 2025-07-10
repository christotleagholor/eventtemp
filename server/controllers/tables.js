const Table = require('../models/Table');


exports.getTables = async () => {
  return await Table.find({});
};

// Update these methods
exports.getTableById = async (tableId) => {  // Changed from id to tableId
  return await Table.findOne({ id: tableId });
};

exports.getTableAttendees = async (tableId) => {  // Changed from id to tableId
  return await Attendee.find({ tableId, assigned: true });
};