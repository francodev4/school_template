const express = require("express");
const db = require("../db");
const router = express.Router();

// GET tous les messages
router.get("/", (req, res) => {
  db.all("SELECT * FROM communications", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST ajouter un message
router.post("/", (req, res) => {
  const { sender, subject, preview, date, status } = req.body;
  if (!sender || !subject || !preview || !date || !status) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  db.run(
    "INSERT INTO communications (sender, subject, preview, date, status) VALUES (?, ?, ?, ?, ?)",
    [sender, subject, preview, date, status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, sender, subject, preview, date, status });
    }
  );
});

// PUT modifier un message
router.put("/:id", (req, res) => {
  const { sender, subject, preview, date, status } = req.body;
  db.run(
    "UPDATE communications SET sender = ?, subject = ?, preview = ?, date = ?, status = ? WHERE id = ?",
    [sender, subject, preview, date, status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, sender, subject, preview, date, status });
    }
  );
});

// DELETE supprimer un message
router.delete("/:id", (req, res) => {
  db.run(
    "DELETE FROM communications WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

module.exports = router;
