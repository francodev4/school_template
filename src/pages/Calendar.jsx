import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/calendar";

const Calendar = () => {
  const [selectedView, setSelectedView] = useState("week");
  const [selectedClass, setSelectedClass] = useState("all");
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    day: "Lundi",
    teacher: "",
    room: "",
  });
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

  useEffect(() => {
    axios.get(API_URL).then((res) => setEvents(res.data));
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesClass =
      selectedClass === "all" || event.title.includes(selectedClass);
    return matchesClass;
  });

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (
      newEvent.title.trim() &&
      newEvent.start.trim() &&
      newEvent.end.trim() &&
      newEvent.day.trim() &&
      newEvent.teacher.trim() &&
      newEvent.room.trim()
    ) {
      if (editId) {
        axios.put(`${API_URL}/${editId}`, newEvent).then((res) => {
          setEvents(
            events.map((ev) => (ev.id === Number(editId) ? res.data : ev))
          );
          setEditId(null);
          setShowForm(false);
          setNewEvent({
            title: "",
            start: "",
            end: "",
            day: "Lundi",
            teacher: "",
            room: "",
          });
        });
      } else {
        axios.post(API_URL, newEvent).then((res) => {
          setEvents([...events, res.data]);
          setShowForm(false);
          setNewEvent({
            title: "",
            start: "",
            end: "",
            day: "Lundi",
            teacher: "",
            room: "",
          });
        });
      }
    }
  };

  const handleEdit = (event) => {
    setEditId(event.id);
    setNewEvent({
      title: event.title,
      start: event.start,
      end: event.end,
      day: event.day,
      teacher: event.teacher,
      room: event.room,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setEvents(events.filter((ev) => ev.id !== id));
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Calendrier</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setNewEvent({
              title: "",
              start: "",
              end: "",
              day: "Lundi",
              teacher: "",
              room: "",
            });
          }}
        >
          + Nouvel Événement
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleAddEvent}
          className="mb-6 bg-gray-50 p-4 rounded-lg shadow space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="title"
              placeholder="Titre de l'événement"
              value={newEvent.title}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="day"
              value={newEvent.day}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="teacher"
              placeholder="Enseignant"
              value={newEvent.teacher}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="room"
              placeholder="Salle"
              value={newEvent.room}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="start"
              value={newEvent.start}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Heure de début</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              name="end"
              value={newEvent.end}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Heure de fin</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jour
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Début
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enseignant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.day}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.start}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.end}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.teacher}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.room}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEdit(event)}
                  >
                    Éditer
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(event.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
