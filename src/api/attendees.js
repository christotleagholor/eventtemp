import db, { saveDB } from '.utils/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(db.attendees);
  }

  if (req.method === 'POST') {
    const { id, name, tableId } = req.body;
    const attendee = db.attendees.find(a => a.id === id) || { id, name: '', tableId: '', assigned: false };
    
    attendee.name = name;
    attendee.tableId = tableId;
    attendee.assigned = true;
    
    if (!db.attendees.some(a => a.id === id)) {
      db.attendees.push(attendee);
    }
    
    saveDB();
    return res.status(200).json(attendee);
  }

  res.status(405).end();
}