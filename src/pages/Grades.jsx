import React, { useState, useEffect } from "react";
import axios from "axios";

const API_STUDENTS = "http://localhost:5000/students";
const API_GRADES = "http://localhost:5000/grades";

const subjects = [
  { id: "math", name: "Mathématiques" },
  { id: "french", name: "Français" },
  { id: "history", name: "Histoire-Géographie" },
  { id: "english", name: "Anglais" },
  { id: "physics", name: "Physique-Chimie" },
];
const classes = ["3A", "3B", "4A", "4B"];

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newGrade, setNewGrade] = useState({
    student_id: "",
    subject: "math",
    value: "",
    coef: 1,
    date: "",
    type: "Contrôle",
  });
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("all");

  useEffect(() => {
    axios.get(API_STUDENTS).then((res) => setStudents(res.data));
    axios.get(API_GRADES).then((res) => setGrades(res.data));
  }, []);

  const handleChange = (e) => {
    setNewGrade({ ...newGrade, [e.target.name]: e.target.value });
  };

  // Fonction pour recalculer la moyenne d'un élève et la mettre à jour dans la base
  const updateStudentAverage = async (student_id) => {
    // Rafraîchir les notes
    const gradesRes = await axios.get(API_GRADES);
    const allGrades = gradesRes.data;
    setGrades(allGrades);
    const studentGrades = allGrades.filter(
      (g) => String(g.student_id) === String(student_id)
    );
    let average = "0";
    if (studentGrades.length > 0) {
      const total = studentGrades.reduce(
        (sum, g) => sum + parseFloat(g.value) * parseInt(g.coef),
        0
      );
      const totalCoef = studentGrades.reduce(
        (sum, g) => sum + parseInt(g.coef),
        0
      );
      average = totalCoef ? (total / totalCoef).toFixed(2) : "0";
    }
    // Récupérer l'étudiant à jour depuis l'API
    let student;
    try {
      const studentRes = await axios.get(`${API_STUDENTS}/${student_id}`);
      student = studentRes.data;
      if (!student) return;
    } catch (err) {
      // Si l'étudiant n'existe plus (404), on ignore la mise à jour de la moyenne
      return;
    }
    // Mettre à jour la moyenne dans la base
    await axios.put(`${API_STUDENTS}/${student_id}`, { ...student, average });
    // Rafraîchir la liste des étudiants après la mise à jour
    const studentsRes2 = await axios.get(API_STUDENTS);
    setStudents(studentsRes2.data);
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    if (
      newGrade.student_id &&
      newGrade.subject &&
      newGrade.value &&
      newGrade.coef &&
      newGrade.date &&
      newGrade.type
    ) {
      if (editId) {
        await axios.put(`${API_GRADES}/${editId}`, newGrade);
        await updateStudentAverage(newGrade.student_id);
        setShowForm(false);
        setEditId(null);
        setNewGrade({
          student_id: "",
          subject: "math",
          value: "",
          coef: 1,
          date: "",
          type: "Contrôle",
        });
      } else {
        await axios.post(API_GRADES, newGrade);
        await updateStudentAverage(newGrade.student_id);
        setShowForm(false);
        setNewGrade({
          student_id: "",
          subject: "math",
          value: "",
          coef: 1,
          date: "",
          type: "Contrôle",
        });
      }
      // Toujours rafraîchir la liste des étudiants après ajout/modif
      const studentsRes = await axios.get(API_STUDENTS);
      setStudents(studentsRes.data);
    }
  };

  const handleEdit = (grade) => {
    setEditId(grade.id);
    setNewGrade({
      student_id: grade.student_id,
      subject: grade.subject,
      value: grade.value,
      coef: grade.coef,
      date: grade.date,
      type: grade.type,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const gradeToDelete = grades.find((g) => g.id === id);
    await axios.delete(`${API_GRADES}/${id}`);
    if (gradeToDelete) await updateStudentAverage(gradeToDelete.student_id);
    // Toujours rafraîchir la liste des étudiants après suppression
    const studentsRes = await axios.get(API_STUDENTS);
    setStudents(studentsRes.data);
  };

  // Filtrage des élèves et notes
  const filteredStudents = students.filter(
    (s) => selectedClass === "all" || s.class === selectedClass
  );
  const filteredGrades = grades.filter(
    (g) =>
      (selectedClass === "all" || g.class === selectedClass) &&
      (selectedStudent === "all" ||
        String(g.student_id) === String(selectedStudent))
  );

  // Calcul de la moyenne par élève
  const getStudentAverage = (student_id) => {
    const studentGrades = grades.filter(
      (g) => String(g.student_id) === String(student_id)
    );
    if (studentGrades.length === 0) return "-";
    const total = studentGrades.reduce(
      (sum, g) => sum + parseFloat(g.value) * parseInt(g.coef),
      0
    );
    const totalCoef = studentGrades.reduce(
      (sum, g) => sum + parseInt(g.coef),
      0
    );
    return totalCoef ? (total / totalCoef).toFixed(2) : "-";
  };

  // Calcul de la moyenne de la classe filtrée
  const getClassAverage = () => {
    const classStudents = students.filter(
      (s) => selectedClass === "all" || s.class === selectedClass
    );
    const avgs = classStudents
      .map((s) => parseFloat(getStudentAverage(s.id)))
      .filter((v) => !isNaN(v));
    if (avgs.length === 0) return "-";
    return (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(2);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Gestion des Notes
      </h1>
      <div className="mb-6 flex gap-4">
        <select
          className="p-2 border rounded-lg"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="all">Toutes les classes</option>
          {classes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="all">Tous les élèves</option>
          {filteredStudents.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setNewGrade({
              student_id: "",
              subject: "math",
              value: "",
              coef: 1,
              date: "",
              type: "Contrôle",
            });
          }}
        >
          + Ajouter une note
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleAddGrade}
          className="mb-6 bg-gray-50 p-4 rounded-lg shadow space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <select
              name="student_id"
              value={newGrade.student_id}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Sélectionner un élève</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.class})
                </option>
              ))}
            </select>
            <select
              name="subject"
              value={newGrade.subject}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="value"
              placeholder="Note (/20)"
              value={newGrade.value}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              min="0"
              max="20"
              required
            />
            <input
              type="number"
              name="coef"
              placeholder="Coef"
              value={newGrade.coef}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              min="1"
              required
            />
            <input
              type="date"
              name="date"
              value={newGrade.date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="type"
              value={newGrade.type}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="Contrôle">Contrôle</option>
              <option value="Devoir">Devoir</option>
              <option value="Dissertation">Dissertation</option>
              <option value="Oral">Oral</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => setShowForm(false)}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {editId ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      )}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Élève
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matière
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coef
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGrades.map((grade) => (
              <tr key={grade.id}>
                <td className="px-6 py-4 whitespace-nowrap">{grade.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{grade.class}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {subjects.find((s) => s.id === grade.subject)?.name ||
                    grade.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{grade.value}</td>
                <td className="px-6 py-4 whitespace-nowrap">{grade.coef}</td>
                <td className="px-6 py-4 whitespace-nowrap">{grade.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{grade.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEdit(grade)}
                  >
                    Éditer
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(grade.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Moyenne de la classe
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {getClassAverage()}/20
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Moyenne par élève
          </h3>
          <ul className="text-gray-700">
            {filteredStudents.map((s) => (
              <li key={s.id}>
                {s.name} :{" "}
                <span className="font-bold">{getStudentAverage(s.id)}/20</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Grades;
