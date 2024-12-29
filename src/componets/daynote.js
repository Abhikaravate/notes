import React, { useState, useEffect, useCallback } from 'react';

function DayNotePage({ user }) {
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [editNoteId, setEditNoteId] = useState(null);

  const API_BASE_URL = 'https://notes-backend-ds62.onrender.com';

  const fetchNotesForUserAndDate = useCallback(async (selectedDate = date) => {
    try {
      if (!user) return;
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`${API_BASE_URL}/api/notes?userId=${user.id}&date=${formattedDate}`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, [date, user]);

  useEffect(() => {
    fetchNotesForUserAndDate();
  }, [fetchNotesForUserAndDate]);

  const handleNoteChange = (e) => setNote(e.target.value);

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setDate(selectedDate);
    fetchNotesForUserAndDate(selectedDate);
  };

  const saveNote = async () => {
    try {
      if (!user) return;
      const formattedDate = date.toISOString().split('T')[0];
      const method = editNoteId ? 'PUT' : 'POST';
      const endpoint = editNoteId ? `${API_BASE_URL}/api/notes/${editNoteId}` : `${API_BASE_URL}/api/notes`;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, date: formattedDate, note }),
      });

      if (!response.ok) throw new Error('Failed to save note');
      setNote('');
      setEditNoteId(null);
      fetchNotesForUserAndDate();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const editNote = (note) => {
    setEditNoteId(note.id);
    setNote(note.content);
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete note');
      fetchNotesForUserAndDate();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Day Notes</h1>
      <p style={styles.welcome}>Welcome, {user?.name || 'Guest'}!</p>
      
      <div style={styles.noteInput}>
        <textarea
          placeholder="Write your note here..."
          value={note}
          onChange={handleNoteChange}
          rows="5"
          cols="30"
          style={styles.textArea}
        />
      </div>
      <button onClick={saveNote} style={styles.button}>{editNoteId ? 'Update Note' : 'Save Note'}</button>
      <div style={styles.datePicker}>
        <label htmlFor="date">Select Date: </label>
        <input
          type="date"
          id="date"
          value={date.toISOString().split('T')[0]}
          onChange={handleDateChange}
          style={styles.input}
        />
      </div>
      <h2 style={styles.subHeader}>Notes for {date.toISOString().split('T')[0]}</h2>
      <ul style={styles.noteList}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <li key={note.id} style={styles.noteItem}>
              <p style={styles.noteContent}>{note.content}</p>
              <p style={styles.noteTime}><small>{new Date(note.date).toLocaleTimeString()}</small></p>
              <button onClick={() => editNote(note)} style={styles.editButton}>Edit</button>
              <button onClick={() => deleteNote(note.id)} style={styles.deleteButton}>Delete</button>
            </li>
          ))
        ) : (
          <li style={styles.noNotes}>No notes for this date.</li>
        )}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    backgroundColor: '#FFE4E1',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    color: '#FF69B4',
    fontSize: '2.5em',
    marginBottom: '10px',
  },
  welcome: {
    fontSize: '1.2em',
    color: '#FFB6C1',
  },
  datePicker: {
    margin: '10px 0',
  },
  input: {
    border: '2px solid #FF69B4',
    borderRadius: '5px',
    padding: '5px',
    color: '#FF69B4',
  },
  noteInput: {
    margin: '10px ',
    marginRight : '25px'
  },
  textArea: {
    width: '100%',
    padding: '10px',
    border: '2px solid #FF69B4',
    borderRadius: '10px',
    fontFamily: 'inherit',
  },
  button: {
    padding: '10px 20px',
    margin: '10px',
    backgroundColor: '#FF69B4',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1em',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  subHeader: {
    color: '#FF69B4',
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  noteList: {
    listStyleType: 'none',
    padding: '0',
  },
  noteItem: {
    border: '1px solid #FFC0CB',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '10px',
    backgroundColor: '#FFF0F5',
  },
  noteContent: {
    fontSize: '1.1em',
    color: '#FF69B4',
  },
  noteTime: {
    fontSize: '0.9em',
    color: '#C71585',
  },
  editButton: {
    marginRight: '5px',
    backgroundColor: '#FFB6C1',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
    color: '#FF69B4',
  },
  deleteButton: {
    backgroundColor: '#FF6EB4',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
    color: 'white',
  },
  noNotes: {
    color: '#FF69B4',
    fontStyle: 'italic',
  },
};

export default DayNotePage;
