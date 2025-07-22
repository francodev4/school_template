const express = require("express");
const db = require("../db");
const router = express.Router();

// GET tous les enseignants
router.get("/", (req, res) => {
  db.all("SELECT * FROM teachers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST ajouter un enseignant
router.post("/", (req, res) => {
  const { name, department, classes, status, contact } = req.body;
  if (!name || !department || !classes || !status || !contact) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  db.run(
    "INSERT INTO teachers (name, department, classes, status, contact) VALUES (?, ?, ?, ?, ?)",
    [name, department, classes, status, contact],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, department, classes, status, contact });
    }
  );
});

// PUT modifier un enseignant
router.put("/:id", (req, res) => {
  const { name, department, classes, status, contact } = req.body;
  db.run(
    "UPDATE teachers SET name = ?, department = ?, classes = ?, status = ?, contact = ? WHERE id = ?",
    [name, department, classes, status, contact, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: req.params.id,
        name,
        department,
        classes,
        status,
        contact,
      });
    }
  );
});

// DELETE supprimer un enseignant
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM teachers WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
