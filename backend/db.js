const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./school.db");

// Création des tables nécessaires pour le frontend
// Table students
// Table teachers
// Table library
// Table communications
// Table calendar

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      class TEXT NOT NULL,
      status TEXT NOT NULL,
      average TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      classes TEXT NOT NULL,
      status TEXT NOT NULL,
      contact TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS library (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      subject TEXT NOT NULL,
      author TEXT NOT NULL,
      level TEXT NOT NULL,
      format TEXT NOT NULL,
      date TEXT NOT NULL,
      downloads INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS communications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      subject TEXT NOT NULL,
      preview TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS calendar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      start TEXT NOT NULL,
      end TEXT NOT NULL,
      day TEXT NOT NULL,
      teacher TEXT NOT NULL,
      room TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      value REAL NOT NULL,
      coef INTEGER NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
