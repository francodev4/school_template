import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/teachers";

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    department: "Mathématiques",
    classes: "",
    status: "Actif",
    contact: "",
  });
  const departments = [
    "all",
    "Mathématiques",
    "Français",
    "Sciences",
    "Histoire-Géographie",
    "Anglais",
  ];

  useEffect(() => {
    axios.get(API_URL).then((res) => setTeachers(res.data));
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || teacher.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (
      newTeacher.name.trim() &&
      newTeacher.department.trim() &&
      newTeacher.classes.trim() &&
      newTeacher.status.trim() &&
      newTeacher.contact.trim()
    ) {
      if (editId) {
        axios.put(`${API_URL}/${editId}`, newTeacher).then((res) => {
          setTeachers(
            teachers.map((t) => (t.id === Number(editId) ? res.data : t))
          );
          setEditId(null);
          setShowForm(false);
          setNewTeacher({
            name: "",
            department: "Mathématiques",
            classes: "",
            status: "Actif",
            contact: "",
          });
        });
      } else {
        axios.post(API_URL, newTeacher).then((res) => {
          setTeachers([...teachers, res.data]);
          setShowForm(false);
          setNewTeacher({
            name: "",
            department: "Mathématiques",
            classes: "",
            status: "Actif",
            contact: "",
          });
        });
      }
    }
  };

  const handleEdit = (teacher) => {
    setEditId(teacher.id);
    setNewTeacher({
      name: teacher.name,
      department: teacher.department,
      classes: teacher.classes,
      status: teacher.status,
      contact: teacher.contact,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setTeachers(teachers.filter((t) => t.id !== id));
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestion des Enseignants
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setNewTeacher({
              name: "",
              department: "Mathématiques",
              classes: "",
              status: "Actif",
              contact: "",
            });
          }}
        >
          + Nouvel Enseignant
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleAddTeacher}
          className="mb-6 bg-gray-50 p-4 rounded-lg shadow space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nom de l'enseignant"
              value={newTeacher.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="department"
              value={newTeacher.department}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              {departments
                .filter((d) => d !== "all")
                .map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
            <input
              type="text"
              name="classes"
              placeholder="Classes (séparées par virgule)"
              value={newTeacher.classes}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="status"
              value={newTeacher.status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="Actif">Actif</option>
              <option value="En congé">En congé</option>
            </select>
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={newTeacher.contact}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
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
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher un enseignant..."
            className="w-full p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="p-2 border rounded-lg"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d === "all" ? "Tous les départements" : d}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Département
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {teacher.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {teacher.department}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{teacher.classes}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      teacher.status === "Actif"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {teacher.contact}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEdit(teacher)}
                  >
                    Éditer
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(teacher.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex gap-4">
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
          Exporter la liste
        </button>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
          Envoyer un message groupé
        </button>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
          Planifier une réunion
        </button>
      </div>
    </div>
  );
};

export default Teachers;
