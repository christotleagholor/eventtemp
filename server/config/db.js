const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://christotle:114455chris@yeb-ai.1wajiqh.mongodb.net/YEB-Ai', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Eventtemp Server: MongoDB Connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;