const express = require("express");
const db = require("../db");
const router = express.Router();

// GET toutes les notes (avec nom de l'élève)
router.get("/", (req, res) => {
  db.all(
    `SELECT grades.*, students.name, students.class FROM grades JOIN students ON grades.student_id = students.id`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// GET notes d'un élève
router.get("/student/:student_id", (req, res) => {
  db.all(
    `SELECT * FROM grades WHERE student_id = ?`,
    [req.params.student_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// POST ajouter une note
router.post("/", (req, res) => {
  const { student_id, subject, value, coef, date, type } = req.body;
  if (
    !student_id ||
    !subject ||
    value === undefined ||
    !coef ||
    !date ||
    !type
  ) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  db.run(
    `INSERT INTO grades (student_id, subject, value, coef, date, type) VALUES (?, ?, ?, ?, ?, ?)`,
    [student_id, subject, value, coef, date, type],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        student_id,
        subject,
        value,
        coef,
        date,
        type,
      });
    }
  );
});

// PUT modifier une note
router.put("/:id", (req, res) => {
  const { student_id, subject, value, coef, date, type } = req.body;
  db.run(
    `UPDATE grades SET student_id = ?, subject = ?, value = ?, coef = ?, date = ?, type = ? WHERE id = ?`,
    [student_id, subject, value, coef, date, type, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: req.params.id,
        student_id,
        subject,
        value,
        coef,
        date,
        type,
      });
    }
  );
});

// DELETE supprimer une note
router.delete("/:id", (req, res) => {
  db.run(`DELETE FROM grades WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
