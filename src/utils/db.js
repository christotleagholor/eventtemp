const initialData = {
  attendees: Array.from({ length: 350 }, (_, i) => ({
    id: `CHI-IHE${(i + 1).toString().padStart(6, '0')}`,
    name: '',
    tableId: '',
    assigned: false
  })),
  tables: [
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
                { id: 'table25', name: 'Giorgio Table' },
  ],
  lastId: 350
};

// Current DB state
let db = JSON.parse(JSON.stringify(initialData));

// Initialize from localStorage
const initializeDB = () => {
  const savedData = localStorage.getItem('goldenJubileeDB');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      db = {
        ...initialData,
        ...parsed,
        attendees: parsed.attendees || initialData.attendees,
        tables: parsed.tables || initialData.tables
      };
    } catch (e) {
      console.error("Failed to parse saved data", e);
    }
  }
};

// Initialize immediately
initializeDB();

// Public API
export const getDB = () => db;
export const saveDB = () => {
  localStorage.setItem('goldenJubileeDB', JSON.stringify(db));
};
export const resetDB = () => {
  db = JSON.parse(JSON.stringify(initialData));
  saveDB();
  return db;
};
export const exportDB = () => {
  const dataStr = JSON.stringify(db, null, 2);
  return new Blob([dataStr], { type: 'application/json' });
};