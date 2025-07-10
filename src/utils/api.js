const API_BASE_URL = import.meta.env.API_BASE_URL || 'https://eventtemp-server.vercel.app/api';

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

// Attendees API
export const getAttendees = (assignedOnly = false) => 
  apiRequest(`/attendees${assignedOnly ? '?assigned=true' : ''}`);

export const assignAttendee = (attendeeId, name, tableId) => 
  apiRequest('/attendees/assign', 'POST', { attendeeId, name, tableId });

export const unassignAttendee = (attendeeId) => 
  apiRequest(`/attendees/${attendeeId}/unassign`, 'PATCH');

export const moveAttendee = (attendeeId, newTableId) => 
  apiRequest(`/attendees/${attendeeId}/move`, 'PATCH', { newTableId });

export const resetAttendees = () => apiRequest('/attendees/reset', 'POST');

// Tables API
export const getTables = () => apiRequest('/tables');

// Initialize DB
export const initializeDB = () => apiRequest('/initialize', 'POST');