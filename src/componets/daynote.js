import React, { useState, useEffect, useCallback } from "react";

function DayNotePage({ user }) {
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [editNoteId, setEditNoteId] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  const fetchNotesForUserAndDate = useCallback(async (selectedDate = date) => {
    try {
      if (!user || !user.user_id) return; // Use user.user_id instead of user.id
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await fetch(
        `${API_BASE_URL}/api/notes?user_id=${user.user_id}&date=${formattedDate}` // Change to user_id
      );
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, [date, user]);

  useEffect(() => {
    if (user && user.user_id) {
      fetchNotesForUserAndDate();
    }
  }, [fetchNotesForUserAndDate, user]);

  const handleNoteChange = (e) => setNote(e.target.value);

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setDate(selectedDate);
    fetchNotesForUserAndDate(selectedDate);
  };

  const saveNote = async () => {
    try {
      if (!user || !user.user_id) {
        console.error("User is not logged in.");
        return; // Don't proceed if user is not logged in
      }
      const formattedDate = date.toISOString().split("T")[0];
      const requestPayload = { user_id: user.user_id, date: formattedDate, note }; // Use user_id
      console.log("Request Payload:", requestPayload);  // Log the payload to check the structure
  
      const method = editNoteId ? "PUT" : "POST";
      const endpoint = editNoteId
        ? `${API_BASE_URL}/api/notes/${editNoteId}`
        : `${API_BASE_URL}/api/notes`;
  
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
  
      if (!response.ok) throw new Error("Failed to save note");
      setNote("");
      setEditNoteId(null);
      fetchNotesForUserAndDate();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const editNote = (note) => {
    setEditNoteId(note._id);
    setNote(note.content);
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete note");
      fetchNotesForUserAndDate();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Early return if no user is logged in
  if (!user || !user.user_id) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Day Notes</h1>
        <p style={styles.welcome}>Please log in to view your notes.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Day Notes</h1>
      <p style={styles.welcome}>
        Welcome, {user?.name || "Guest"}!
      </p>
      <div style={styles.datePicker}>
        <label htmlFor="date" style={styles.label}>
          Select Date:{" "}
        </label>
        <input
          type="date"
          id="date"
          value={date.toISOString().split("T")[0]}
          onChange={handleDateChange}
          style={styles.input}
        />
      </div>
      <textarea
        placeholder="Write your note here..."
        value={note}
        onChange={handleNoteChange}
        rows="5"
        style={styles.textArea}
      />
      <button onClick={saveNote} style={styles.saveButton}>
        {editNoteId ? "Update Note" : "Save Note"}
      </button>
      <h2 style={styles.subHeader}>
        Notes for {date.toISOString().split("T")[0]}
      </h2>
      <ul style={styles.noteList}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <li key={note._id} style={styles.noteItem}>
              <div>
                <p style={styles.noteContent}>{note.content}</p>
                <small style={styles.noteTime}>
                  {new Date(note.date).toLocaleTimeString()}
                </small>
              </div>
              <div>
                <button
                  onClick={() => editNote(note)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(note._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
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
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    color: "#333",
    fontSize: "2em",
    marginBottom: "10px",
    textAlign: "center",
  },
  welcome: {
    fontSize: "1em",
    marginBottom: "20px",
    textAlign: "center",
  },
  datePicker: {
    marginBottom: "15px",
    textAlign: "center",
  },
  label: {
    fontSize: "1em",
    marginRight: "10px",
  },
  input: {
    padding: "8px",
    fontSize: "1em",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textArea: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
  },
  saveButton: {
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1em",
    display: "block",
    margin: "20px auto",
  },
  subHeader: {
    fontSize: "1.5em",
    color: "#333",
    margin: "20px 0",
  },
  noteList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  noteItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#fff",
    marginBottom: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  noteContent: {
    fontSize: "1em",
    color: "#333",
  },
  noteTime: {
    fontSize: "0.8em",
    color: "#888",
  },
  editButton: {
    backgroundColor: "#FFC107",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  noNotes: {
    color: "#777",
    fontStyle: "italic",
  },
};

export default DayNotePage;
