require('dotenv').config();
const mongoose = require('mongoose');
const Table = require('./models/Table');

// Database connection
mongoose.connect('mongodb+srv://christotle:114455chris@yeb-ai.1wajiqh.mongodb.net/YEB-Ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Define tables
    const tables = [
      { id: 'table1', name: 'Eternity Table' },
      { id: 'table2', name: 'Burberry Table' },
      { id: 'table3', name: 'Euphoria Table' },
      { id: 'table4', name: 'Legend' },
      { id: 'table5', name: 'Obsession Table' },
      { id: 'table6', name: 'Touch Table' },
      { id: 'table7', name: 'Chrome Table' },
      { id: 'table8', name: 'Davidoff Table' },
      { id: 'table9', name: 'Beautiful Table' },
      { id: 'table10', name: 'Sauvage Table' },
      { id: 'table11', name: 'Chanel Table' },
      { id: 'table12', name: 'Lancome Table' },
      { id: 'table13', name: 'Dior Table' },
      { id: 'table14', name: 'Tomford Table' },
      { id: 'table15', name: 'Givenchy Table' },
      { id: 'table16', name: 'Cherry Table' },
      { id: 'table17', name: 'Cucci Table' },
      { id: 'table18', name: 'Cartier Table' },
      { id: 'table19', name: 'Forever Table' },
      { id: 'table20', name: 'Creed Table' },
      { id: 'table21', name: 'Fendi Table' },
      { id: 'table22', name: 'Boss Table' },
      { id: 'table23', name: 'Jadore Table' },
      { id: 'table24', name: 'Blue Table' },
      { id: 'table25', name: 'Giorgio Table' }
    ];

    // Clear existing tables
    await Table.deleteMany({});
    console.log('Cleared existing tables');

    // Create new tables
    const result = await Table.insertMany(tables);
    console.log(`Successfully created ${result.length} tables`);

    process.exit(0);
  } catch (err) {
    console.error('Error initializing tables:', err);
    process.exit(1);
  }
})
.catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});