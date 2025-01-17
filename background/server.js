const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const dbURI = process.env.MONGO_URI ;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB database'))
  .catch((err) => console.error('MongoDB connection error:', err));

// MongoDB Schema Models
const userSchema = new mongoose.Schema({
  name: String,
  user_id: { type: String, unique: true },
  password: String,
});

const noteSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
});

const User = mongoose.model('users', userSchema);
const Note = mongoose.model('notes', noteSchema);

// Routes

const bcrypt = require('bcrypt');

app.post('/signup', async (req, res) => {
  const { name, userId, password } = req.body;

  if (!name || !userId || !password) {
    return res.status(400).json({ message: 'Please fill all fields!' });
  }

  try {
    // Hash the password
    const saltRounds = 10; // Higher is more secure but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, user_id: userId, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'User ID already exists!' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Error creating user' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ message: 'Please enter User ID and Password!' });
  }

  try {
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(401).json({ message: 'Invalid User ID or Password!' });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid User ID or Password!' });
    }

    // Password is valid, return user details
    const { password: _, ...userData } = user._doc; // Exclude the password from the response
    res.status(200).json({ message: 'Login successful!', user: userData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error during login' });
  }
});


// Save a Note
app.post('/api/notes', async (req, res) => {
  const { user_id, date, note } = req.body;

  if (!user_id || !date || !note) {
    return res.status(400).json({ message: 'User ID, date, and note content are required' });
  }

  try {
    const newNote = new Note({
      user_id,
      date: new Date(date),
      content: note,
    });

    await newNote.save();
    res.status(201).json({ message: 'Note saved successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error saving note' });
  }
});

// Fetch Notes by User ID and Date
app.get('/api/notes', async (req, res) => {
  const { user_id, date } = req.query;

  if (!user_id || !date) {
    return res.status(400).json({ message: 'User ID and date are required' });
  }

  try {
    const notes = await Note.find({
      user_id,
      date: new Date(date),
    });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

// Update Note
app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  if (!note) {
    return res.status(400).json({ message: 'Note content is required' });
  }

  try {
    await Note.findByIdAndUpdate(id, { content: note });
    res.json({ message: 'Note updated successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating note' });
  }
});

// Delete Note
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Note.findByIdAndDelete(id);
    res.json({ message: 'Note deleted successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error deleting note' });
  }
});

//encription const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes
const ENCRYPTION_IV = process.env.ENCRYPTION_IV;   // 16 bytes

function encryptText(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(ENCRYPTION_IV));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptText(encryptedText) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(ENCRYPTION_IV));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
