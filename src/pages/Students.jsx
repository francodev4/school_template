import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { exportToCSV } from "../utils/export.js";

const API_STUDENTS = "http://localhost:5000/students";
const API_GRADES = "http://localhost:5000/grades";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "3ème A",
    status: "Présent",
    average: "0",
  });
  const fileInputRef = useRef(null);
  const classes = ["all", "3ème A", "3ème B", "4ème A", "4ème B"];
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    axios.get(API_STUDENTS).then((res) => setStudents(res.data));
    axios.get(API_GRADES).then((res) => setGrades(res.data));
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Calcul dynamique de la moyenne à partir des notes
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

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const refreshStudents = () => {
    axios.get(API_STUDENTS).then((res) => setStudents(res.data));
  };

  // Ajouter ou modifier un étudiant
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (
      newStudent.name.trim() &&
      newStudent.class.trim() &&
      newStudent.status.trim()
    ) {
      if (editId) {
        // Modifier
        axios
          .put(`${API_STUDENTS}/${editId}`, newStudent)
          .then(() => {
            refreshStudents();
            setShowForm(false);
            setEditId(null);
            setNewStudent({ name: "", class: "3ème A", status: "Présent" });
            setNotification({
              type: "success",
              message: "Étudiant modifié avec succès.",
            });
          })
          .catch(() =>
            setNotification({
              type: "error",
              message: "Erreur lors de la modification.",
            })
          );
      } else {
        // Ajouter
        axios
          .post(API_STUDENTS, { ...newStudent, average: "0" })
          .then(() => {
            refreshStudents();
            setShowForm(false);
            setNewStudent({ name: "", class: "3ème A", status: "Présent" });
            setNotification({
              type: "success",
              message: "Étudiant ajouté avec succès.",
            });
          })
          .catch(() =>
            setNotification({
              type: "error",
              message: "Erreur lors de l'ajout.",
            })
          );
      }
    }
  };

  // Préparer la modification
  const handleEdit = (student) => {
    setEditId(student.id);
    setNewStudent({
      name: student.name,
      class: student.class,
      status: student.status,
      average: student.average || "0",
    });
    setShowForm(true);
  };

  // Supprimer un étudiant
  const handleDelete = (id) => {
    axios
      .delete(`${API_STUDENTS}/${id}`)
      .then(() => {
        refreshStudents();
        setNotification({
          type: "success",
          message: "Étudiant supprimé avec succès.",
        });
      })
      .catch(() =>
        setNotification({
          type: "error",
          message: "Erreur lors de la suppression.",
        })
      );
  };

  const handleExport = () => {
    const columns = ["name", "class", "status", "average"];
    const csv = exportToCSV(students, columns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "etudiants.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      import("../utils/import.js").then(({ parseCSV }) => {
        const imported = parseCSV(text);
        const valid = imported.every(
          (obj) =>
            "name" in obj &&
            "class" in obj &&
            "status" in obj &&
            "average" in obj
        );
        if (!valid) {
          alert(
            "Le fichier CSV doit contenir les colonnes : name, class, status, average"
          );
          return;
        }
        // Ajout en base pour chaque étudiant importé
        Promise.all(imported.map((s) => axios.post(API_STUDENTS, s))).then(
          (responses) => {
            setStudents([...students, ...responses.map((r) => r.data)]);
          }
        );
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div>
      {notification && (
        <div
          className={`mb-4 p-3 rounded text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestion des Étudiants
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setNewStudent({
              name: "",
              class: "3ème A",
              status: "Présent",
              average: "0",
            });
          }}
        >
          + Nouvel Étudiant
        </button>
      </div>

      {/* Formulaire d'ajout/modification d'étudiant */}
      {showForm && (
        <form
          onSubmit={handleAddStudent}
          className="mb-6 bg-gray-50 p-4 rounded-lg shadow space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nom de l'étudiant"
              value={newStudent.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="class"
              value={newStudent.class}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              {classes
                .filter((c) => c !== "all")
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
            <select
              name="status"
              value={newStudent.status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="Présent">Présent</option>
              <option value="Absent">Absent</option>
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

      {/* Filtres */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            className="w-full p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="p-2 border rounded-lg"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Toutes les classes" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Table des étudiants */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Moyenne
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {student.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.class}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === "Présent"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.average !== undefined ? student.average : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEdit(student)}
                  >
                    Éditer
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(student.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions en masse */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          onClick={handleExport}
        >
          Exporter la liste
        </button>
        <button
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          onClick={handleImportClick}
        >
          Importer une liste
        </button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
          Imprimer les cartes
        </button>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
          Envoyer un message
        </button>
      </div>
    </div>
  );
};

export default Students;
