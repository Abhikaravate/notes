const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT ||  5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com', // Replace with your database host
  user: 'sql12754379',      // Replace with your database username
  password: 'kfawAuwwEZ',  // Replace with your database password
  database: 'sql12754379', // Replace with your database name
  connectTimeout: 30000 ,
                             //GRANT ALL PRIVILEGES ON sql12754379.* TO 'sql12754379'@'%' IDENTIFIED BY 'kfawAuwwEZ';
// CREATE USER 'sql12754379'@'%' IDENTIFIED BY 'kfawAuwwEZ';
// GRANT ALL PRIVILEGES ON *.* TO 'sql12754379'@'%';
// FLUSH PRIVILEGES;


});

// const db = mysql.createConnection({
//   host: 'localhost', // Replace with your database host
//   user: 'root',      // Replace with your database username
//   password: '2021',  // Replace with your database password
//   database: 'couples_app', // Replace with your database name
// Port number: 3306
// });

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes

// Signup Route
app.post('/signup', (req, res) => {
  const { name, userId, role, password } = req.body;

  if (!name || !userId || !role || !password) {
    return res.status(400).json({ message: 'Please fill all fields!' });
  }

  const query = 'INSERT INTO users (name, user_id, role, password) VALUES (?, ?, ?, ?)';
  db.query(query, [name, userId, role, password], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'User ID already exists!' });
      }
      console.error(err);
      return res.status(500).json({ message: 'Error creating user' });
    }
    res.status(201).json({ message: 'User created successfully!' });
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ message: 'Please enter User ID and Password!' });
  }

  const query = 'SELECT * FROM users WHERE user_id = ? AND password = ?';
  db.query(query, [userId, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error during login' });
    }
    if (results.length > 0) {
      const user = results[0];
      delete user.password; // Remove password from response for security
      res.status(200).json({ message: 'Login successful!', user });
    } else {
      res.status(401).json({ message: 'Invalid User ID or Password!' });
    }
  });
});

// Get Notes for a Specific User and Date
app.get('/api/notes', (req, res) => {
  const { userId, date } = req.query;

  if (!userId || !date) {
    return res.status(400).json({ message: 'User ID and date are required' });
  }

  const query = 'SELECT * FROM notes WHERE user_id = ? AND date = ?';
  db.query(query, [userId, date], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error retrieving notes' });
    }
    res.json(results); // Only notes for the specified user and date are returned
  });
});

// Save a New Note
app.post('/api/notes', (req, res) => {
  const { userId, note, date } = req.body;

  if (!userId || !note || !date) {
    return res.status(400).json({ message: 'User ID, note, and date are required' });
  }

  const query = 'INSERT INTO notes (user_id, content, date) VALUES (?, ?, ?)';
  db.query(query, [userId, note, date], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error saving note' });
    }
    res.status(201).json({ message: 'Note saved successfully!' });
  });
});
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  const query = 'UPDATE notes SET content = ? WHERE id = ?';
  db.query(query, [note, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating note' });
    }
    res.json({ message: 'Note updated successfully!' });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM notes WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting note' });
    }
    res.json({ message: 'Note deleted successfully!' });
  });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
