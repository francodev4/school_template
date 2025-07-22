const express = require("express");
const db = require("../db");
const router = express.Router();

// GET tous les événements
router.get("/", (req, res) => {
  db.all("SELECT * FROM calendar", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST ajouter un événement
router.post("/", (req, res) => {
  const { title, start, end, day, teacher, room } = req.body;
  if (!title || !start || !end || !day || !teacher || !room) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  db.run(
    "INSERT INTO calendar (title, start, end, day, teacher, room) VALUES (?, ?, ?, ?, ?, ?)",
    [title, start, end, day, teacher, room],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, start, end, day, teacher, room });
    }
  );
});

// PUT modifier un événement
router.put("/:id", (req, res) => {
  const { title, start, end, day, teacher, room } = req.body;
  db.run(
    "UPDATE calendar SET title = ?, start = ?, end = ?, day = ?, teacher = ?, room = ? WHERE id = ?",
    [title, start, end, day, teacher, room, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, title, start, end, day, teacher, room });
    }
  );
});

// DELETE supprimer un événement
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM calendar WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
