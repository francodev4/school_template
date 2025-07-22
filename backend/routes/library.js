const express = require("express");
const db = require("../db");
const router = express.Router();

// GET toutes les ressources
router.get("/", (req, res) => {
  db.all("SELECT * FROM library", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST ajouter une ressource
router.post("/", (req, res) => {
  const { title, type, subject, author, level, format, date, downloads } =
    req.body;
  if (
    !title ||
    !type ||
    !subject ||
    !author ||
    !level ||
    !format ||
    !date ||
    downloads === undefined
  ) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  db.run(
    "INSERT INTO library (title, type, subject, author, level, format, date, downloads) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [title, type, subject, author, level, format, date, downloads],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        title,
        type,
        subject,
        author,
        level,
        format,
        date,
        downloads,
      });
    }
  );
});

// PUT modifier une ressource
router.put("/:id", (req, res) => {
  const { title, type, subject, author, level, format, date, downloads } =
    req.body;
  db.run(
    "UPDATE library SET title = ?, type = ?, subject = ?, author = ?, level = ?, format = ?, date = ?, downloads = ? WHERE id = ?",
    [
      title,
      type,
      subject,
      author,
      level,
      format,
      date,
      downloads,
      req.params.id,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: req.params.id,
        title,
        type,
        subject,
        author,
        level,
        format,
        date,
        downloads,
      });
    }
  );
});

// DELETE supprimer une ressource
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM library WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
