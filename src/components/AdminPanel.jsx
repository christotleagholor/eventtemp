import { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, TextField, Select, MenuItem, Button, 
  IconButton, Paper, List, ListItem, ListItemText, 
  Divider, Chip, Alert, Snackbar, Dialog, DialogTitle, 
  DialogContent, DialogActions, DialogContentText 
} from '@mui/material';
import { 
  FaUserShield, FaTable, FaExchangeAlt, 
  FaTimes, FaPlus, FaSyncAlt, FaFileImport, FaFileExport, FaUndo 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { 
  getAttendees, getTables, assignAttendee, 
  unassignAttendee, moveAttendee, resetAttendees,
  initializeDB
} from '../utils/api';
import Header from './Header';

export default function AdminPanel({ returnToPublic }) {
  const [formData, setFormData] = useState({
    name: '',
    attendeeId: '',
    tableId: ''
  });
  const [tables, setTables] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [moveDialog, setMoveDialog] = useState({
    open: false,
    attendeeId: '',
    currentTable: '',
    newTableId: ''
  });
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Load initial data
  useEffect(() => {
    const initialize = async () => {
      try {
        await loadData();
      } catch (error) {
        showSnackbar('Initialization error - please refresh', 'error');
      }
    };
    initialize();
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [attendeesData, tablesData] = await Promise.all([
        getAttendees(true), // Only assigned attendees
        getTables()
      ]);
      setTables(tablesData);
      setAttendees(attendeesData);
    } catch (error) {
      showSnackbar('Failed to load data', 'error');
      console.error('Load error:', error);
    }
  }, []);

  const generateId = useCallback(async () => {
    try {
      const allAttendees = await getAttendees();
      let nextId = null;
      
      // First try to find a gap in 1-350 range
      for (let i = 1; i <= 350; i++) {
        const idNum = i.toString().padStart(6, '0');
        const testId = `CHI-IHE${idNum}`;
        if (!allAttendees.some(a => a.id === testId && a.assigned)) {
          nextId = testId;
          break;
        }
      }
      
      // If no gap found, use sequential
      if (!nextId) {
        const lastAssigned = allAttendees
          .filter(a => a.assigned)
          .sort((a, b) => b.id.localeCompare(a.id))[0];
        
        const lastNum = lastAssigned ? parseInt(lastAssigned.id.slice(-6)) : 350;
        nextId = `CHI-IHE${(lastNum + 1).toString().padStart(6, '0')}`;
      }
      
      setFormData(prev => ({ ...prev, attendeeId: nextId }));
    } catch (error) {
      showSnackbar('Failed to generate ID', 'error');
      console.error('ID generation error:', error);
    }
  }, []);

  const assignToTable = async () => {
    try {
      const { name, attendeeId, tableId } = formData;
      
      if (!name || !attendeeId || !tableId) {
        showSnackbar('Please fill all fields', 'error');
        return;
      }

      await assignAttendee(attendeeId, name, tableId);
      showSnackbar(`${name} assigned to table successfully!`, 'success');
      setFormData({ name: '', attendeeId: '', tableId: '' });
      loadData();
    } catch (error) {
      showSnackbar(`Assignment failed: ${error.message}`, 'error');
      console.error('Assignment error:', error);
    }
  };

  const removeAttendee = async (attendeeId) => {
  console.log(`Attempting to remove attendee: ${attendeeId}`);
  try {
    const response = await unassignAttendee(attendeeId);
    console.log('Unassign response:', response);
    
    showSnackbar(response.message || 'Attendee unassigned successfully', 'success');
    loadData();
  } catch (error) {
    console.error('Remove attendee failed:', error);
    showSnackbar(
      error.message || 'Failed to unassign attendee. Please try again.', 
      'error'
    );
  }
};

  const handleMoveAttendee = async () => {
    try {
      const { attendeeId, newTableId } = moveDialog;
      if (!newTableId) return;
      
      await moveAttendee(attendeeId, newTableId);
      showSnackbar('Attendee moved successfully', 'success');
      loadData();
    } catch (error) {
      showSnackbar('Failed to move attendee', 'error');
      console.error('Move error:', error);
    } finally {
      closeMoveDialog();
    }
  };

   const handleReset = async () => {
    try {
      await resetAttendees();
      showSnackbar('Database reset to initial state', 'warning');
      loadData();
    } catch (error) {
      showSnackbar('Reset failed', 'error');
      console.error('Reset error:', error);
    } finally {
      setResetConfirmOpen(false);
    }
  };

  const handleInitializeDB = async () => {
    setIsInitializing(true);
    try {
      await initializeDB();
      showSnackbar('Database initialized successfully', 'success');
      loadData();
    } catch (error) {
      showSnackbar('Initialization failed', 'error');
      console.error('Initialization error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  // Move attendee dialog handlers
  const openMoveDialog = (attendeeId, currentTable) => {
    setMoveDialog({
      open: true,
      attendeeId,
      currentTable,
      newTableId: ''
    });
  };

  const closeMoveDialog = () => {
    setMoveDialog({
      open: false,
      attendeeId: '',
      currentTable: '',
      newTableId: ''
    });
  };

    // Data management functions
  const handleExport = () => {
    try {
      const url = exportDB();
      const link = document.createElement('a');
      link.href = url;
      link.download = 'golden-jubilee-data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSnackbar('Database exported successfully', 'success');
    } catch (error) {
      showSnackbar('Export failed', 'error');
      console.error('Export error:', error);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (!Array.isArray(importedData.attendees) || !Array.isArray(importedData.tables)) {
          throw new Error('Invalid data format');
        }
        
        const currentDB = getDB();
        Object.assign(currentDB, importedData);
        saveDB();
        loadData();
        setImportKey(Date.now());
        showSnackbar('Database imported successfully!', 'success');
      } catch (error) {
        console.error('Import failed:', error);
        showSnackbar('Invalid file format or corrupted data', 'error');
      }
    };
    reader.onerror = () => {
      showSnackbar('Error reading file', 'error');
    };
    reader.readAsText(file);
  };

 const confirmReset = () => {
    try {
      resetDB();
      loadData();
      showSnackbar('Database reset to initial state', 'warning');
    } catch (error) {
      showSnackbar('Reset failed', 'error');
      console.error('Reset error:', error);
    } finally {
      setResetConfirmOpen(false);
    }
  };

  // Snackbar helpers
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
    <Header />
   
   <div className="main-content-wrapper">
      <Box sx={{ p: 3 }} className="container">
      {/* Header with refresh button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <FaUserShield style={{ marginRight: 10 }} /> Admin Panel
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<FaSyncAlt />}
          onClick={loadData}
        >
          Refresh
        </Button>
      </Box>

       

      {/* Assignment Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Assign Attendee</Typography>
        
        <TextField
          fullWidth
          label="Attendee Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Registration Number"
            value={formData.attendeeId}
            onChange={(e) => setFormData({ ...formData, attendeeId: e.target.value })}
            disabled={!!formData.attendeeId}
          />
          
        </Box>

        <Button 
            variant="contained" 
            onClick={generateId}
            startIcon={<FaPlus />}
            sx={{ minWidth: 180 }}
          >
            Generate ID
          </Button>
        
        <Select
          fullWidth
          value={formData.tableId}
          onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
          displayEmpty
          sx={{ mb: 3 }}
        >
          <MenuItem value="" disabled>Select Table</MenuItem>
          {tables.map((table) => (
            <MenuItem key={table.id} value={table.id}>
              {table.name}
            </MenuItem>
          ))}
        </Select>
        
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={assignToTable}
          disabled={!formData.name || !formData.attendeeId || !formData.tableId}
        >
          Assign to Table
        </Button>
      </Paper>

      {/* Tables Grid */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        <FaTable style={{ marginRight: 10 }} /> Table Assignments
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: 3 
      }}>
        {tables.map((table) => {
          const tableAttendees = attendees.filter(a => a.tableId === table.id);
          
          return (
            <motion.div 
              key={table.id}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {table.name}
                </Typography>
                <Chip 
                  label={`${tableAttendees.length} attendees`} 
                  color="primary" 
                  size="small" 
                  sx={{ mb: 2 }}
                />
                
                {tableAttendees.length > 0 ? (
                  <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {tableAttendees.map((attendee) => (
                      <ListItem 
                        key={attendee.id}
                        secondaryAction={
                          <Box>
                            <IconButton
                              edge="end"
                              onClick={() => removeAttendee(attendee.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <FaTimes />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => openMoveDialog(attendee.id, table.name)}
                              sx={{ color: 'warning.main' }}
                            >
                              <FaExchangeAlt />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={attendee.name}
                          secondary={attendee.id}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No attendees assigned
                  </Typography>
                )}
              </Paper>
            </motion.div>
          );
        })}
      </Box>

      {/* Move Attendee Dialog */}
      <Dialog open={moveDialog.open} onClose={closeMoveDialog}>
        <DialogTitle>Move Attendee</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Moving attendee from: {moveDialog.currentTable}
          </DialogContentText>
          <Select
            fullWidth
            value={moveDialog.newTableId}
            onChange={(e) => setMoveDialog(prev => ({
              ...prev,
              newTableId: e.target.value
            }))}
            displayEmpty
          >
            <MenuItem value="" disabled>Select New Table</MenuItem>
            {tables
              .filter(table => table.id !== moveDialog.currentTable)
              .map((table) => (
                <MenuItem key={table.id} value={table.id}>
                  {table.name}
                </MenuItem>
              ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeMoveDialog}>Cancel</Button>
          <Button 
            onClick={handleMoveAttendee}
            disabled={!moveDialog.newTableId}
            variant="contained"
          >
            Move
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetConfirmOpen} onClose={() => setResetConfirmOpen(false)}>
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset ALL data to initial state? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmReset}
            color="error"
            variant="contained"
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Public View Toggle */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={returnToPublic}
          sx={{ px: 4 }}
        >
          Return to Public View
        </Button>
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={handleCloseSnackbar}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </div>
     </>
  );
}
