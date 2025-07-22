const express = require("express");
const db = require("../db");
const router = express.Router();

// GET tous les étudiants
router.get("/", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST ajouter un étudiant
router.post("/", (req, res) => {
  const { name, class: studentClass, status, average } = req.body;
  if (!name || !studentClass || !status) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  db.run(
    "INSERT INTO students (name, class, status, average) VALUES (?, ?, ?, ?)",
    [name, studentClass, status, average || "0"],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        name,
        class: studentClass,
        status,
        average: average || "0",
      });
    }
  );
});

// PUT modifier un étudiant
router.put("/:id", (req, res) => {
  const { name, class: studentClass, status, average } = req.body;
  db.run(
    "UPDATE students SET name = ?, class = ?, status = ?, average = ? WHERE id = ?",
    [name, studentClass, status, average, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: req.params.id,
        name,
        class: studentClass,
        status,
        average,
      });
    }
  );
});

// DELETE supprimer un étudiant
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM students WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// GET un étudiant par id
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM students WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

module.exports = router;
