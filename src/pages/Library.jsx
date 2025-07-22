import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/library";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newResource, setNewResource] = useState({
    title: "",
    type: "course",
    subject: "math",
    author: "",
    level: "3ème",
    format: "PDF",
    date: "",
    downloads: 0,
  });
  const resourceTypes = [
    { id: "all", name: "Tous les types" },
    { id: "course", name: "Cours" },
    { id: "exercises", name: "Exercices" },
    { id: "quiz", name: "Quiz" },
    { id: "exam", name: "Examens" },
  ];
  const subjects = [
    { id: "all", name: "Toutes les matières" },
    { id: "math", name: "Mathématiques" },
    { id: "french", name: "Français" },
    { id: "history", name: "Histoire-Géographie" },
    { id: "english", name: "Anglais" },
    { id: "physics", name: "Physique-Chimie" },
  ];

  useEffect(() => {
    axios.get(API_URL).then((res) => setResources(res.data));
  }, []);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || resource.type === selectedType;
    const matchesSubject =
      selectedSubject === "all" || resource.subject === selectedSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const handleChange = (e) => {
    setNewResource({ ...newResource, [e.target.name]: e.target.value });
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (
      newResource.title.trim() &&
      newResource.type.trim() &&
      newResource.subject.trim() &&
      newResource.author.trim() &&
      newResource.level.trim() &&
      newResource.format.trim() &&
      newResource.date.trim()
    ) {
      if (editId) {
        axios.put(`${API_URL}/${editId}`, newResource).then((res) => {
          setResources(
            resources.map((r) => (r.id === Number(editId) ? res.data : r))
          );
          setEditId(null);
          setShowForm(false);
          setNewResource({
            title: "",
            type: "course",
            subject: "math",
            author: "",
            level: "3ème",
            format: "PDF",
            date: "",
            downloads: 0,
          });
        });
      } else {
        axios.post(API_URL, newResource).then((res) => {
          setResources([...resources, res.data]);
          setShowForm(false);
          setNewResource({
            title: "",
            type: "course",
            subject: "math",
            author: "",
            level: "3ème",
            format: "PDF",
            date: "",
            downloads: 0,
          });
        });
      }
    }
  };

  const handleEdit = (resource) => {
    setEditId(resource.id);
    setNewResource({
      title: resource.title,
      type: resource.type,
      subject: resource.subject,
      author: resource.author,
      level: resource.level,
      format: resource.format,
      date: resource.date,
      downloads: resource.downloads,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setResources(resources.filter((r) => r.id !== id));
    });
  };

  // Statistiques dynamiques
  const totalCourses = resources.filter((r) => r.type === "course").length;
  const totalExercises = resources.filter((r) => r.type === "exercises").length;
  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bibliothèque</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setNewResource({
              title: "",
              type: "course",
              subject: "math",
              author: "",
              level: "3ème",
              format: "PDF",
              date: "",
              downloads: 0,
            });
          }}
        >
          + Nouvelle Ressource
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleAddResource}
          className="mb-6 bg-gray-50 p-4 rounded-lg shadow space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="title"
              placeholder="Titre de la ressource"
              value={newResource.title}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="type"
              value={newResource.type}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              {resourceTypes
                .filter((t) => t.id !== "all")
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
            <select
              name="subject"
              value={newResource.subject}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              {subjects
                .filter((s) => s.id !== "all")
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
            <input
              type="text"
              name="author"
              placeholder="Auteur"
              value={newResource.author}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="level"
              placeholder="Niveau (ex: 3ème)"
              value={newResource.level}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="format"
              placeholder="Format (ex: PDF)"
              value={newResource.format}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="date"
              name="date"
              value={newResource.date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="number"
              name="downloads"
              placeholder="Téléchargements"
              value={newResource.downloads}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              min="0"
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
            placeholder="Rechercher une ressource..."
            className="w-full p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="p-2 border rounded-lg"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {resourceTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {resource.title}
              </h2>
              <div className="text-sm text-gray-600 mb-1">
                Type : {resource.type}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                Matière : {resource.subject}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                Auteur : {resource.author}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                Niveau : {resource.level}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                Format : {resource.format}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                Date : {resource.date}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                Téléchargements : {resource.downloads}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-sm text-gray-500">
                Ajouté le {resource.date}
              </span>
              <div className="space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Télécharger
                </button>
                <button
                  className="text-gray-600 hover:text-gray-800 text-sm"
                  onClick={() => handleEdit(resource)}
                >
                  Éditer
                </button>
                <button
                  className="text-red-600 hover:text-red-800 text-sm"
                  onClick={() => handleDelete(resource.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-600">
            Total Ressources
          </h3>
          <p className="text-2xl font-bold text-blue-600">{resources.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-600">Cours</h3>
          <p className="text-2xl font-bold text-green-600">{totalCourses}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-600">Exercices</h3>
          <p className="text-2xl font-bold text-purple-600">{totalExercises}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-600">
            Total Téléchargements
          </h3>
          <p className="text-2xl font-bold text-indigo-600">{totalDownloads}</p>
        </div>
      </div>
    </div>
  );
};

export default Library;
