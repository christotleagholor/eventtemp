import { useState, useEffect } from 'react';
import { FaSearch, FaChair } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Header from './Header';
import { getAttendees, getTables } from '../utils/api';

export default function Verification() {
  const [attendeeId, setAttendeeId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [db, setDb] = useState({ attendees: [], tables: [] });

  // Load database on component mount
   useEffect(() => {
    let isMounted = true;
    
    const loadDatabase = async () => {
      try {
        const [attendees, tables] = await Promise.all([
          getAttendees(true),
          getTables()
        ]);
        if (isMounted) {
          setDb({ attendees, tables });
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load database:", err);
          setError("Failed to connect to server. Please check your connection and try again.");
        }
      }
    };

    loadDatabase();

    return () => {
      isMounted = false;
    };
  }, []);


  const handleVerify = () => {
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      if (!attendeeId.trim()) {
        throw new Error('Please enter a registration number');
      }

      const registrationNumber = attendeeId.trim().toUpperCase();
      const attendee = db.attendees.find(a => a.id === registrationNumber);

      if (!attendee) {
        throw new Error('Registration number not found or not assigned to any table');
      }

      const table = db.tables.find(t => t.id === attendee.tableId);
      if (!table) {
        throw new Error('Table assignment not found');
      }

      const tableMembers = db.attendees.filter(a => a.tableId === attendee.tableId);

      setResult({
        tableName: table.name,
        attendeeName: attendee.name,
        members: tableMembers.map(member => ({
          id: member.id,
          name: member.name
        }))
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <>
      <Header />
      
      <div className="main-content-wrapper">
        <div className="container">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-header">
              <FaSearch className="icon" />
              <h2>Find Your Table</h2>
            </div>
            
            <div className="form-group">
              <label htmlFor="attendeeId">Enter Your Registration Number</label>
              <input
                type="text"
                id="attendeeId"
                className="form-control"
                placeholder="e.g. CHI-IHE000101"
                value={attendeeId}
                onChange={(e) => setAttendeeId(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
            
            <button 
              className="btn btn-block" 
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Find My Table'}
            </button>
            
            {/* Error Message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Success Result */}
            {result && (
              <motion.div 
                className="result-container"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="result-card">
                  <div className="result-header">
                    <FaChair className="icon" />
                    <h3>{result.tableName}</h3>
                  </div>
                  <p>Welcome, <span>{result.attendeeName}</span>!</p>
                  <div className="table-members">
                    <h4>Table Members:</h4>
                    <ul className="member-list">
                      {result.members.map(member => (
                        <li key={member.id} className="member-item">
                          <span className="member-id">{member.id}</span>
                          <span className="member-name">{member.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}