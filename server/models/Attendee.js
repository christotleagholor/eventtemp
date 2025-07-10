const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  tableId: { 
    type: String, 
    default: '',  // Changed from required to optional with default
    required: false // Explicitly mark as not required
  },
  assigned: { 
    type: Boolean, 
    default: false 
  }
});

// Add this index if you frequently query by tableId
attendeeSchema.index({ tableId: 1 });

module.exports = mongoose.model('Attendee', attendeeSchema);