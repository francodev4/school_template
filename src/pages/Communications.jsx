import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/communications";

const Communications = () => {
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newMessage, setNewMessage] = useState({
    sender: "",
    subject: "",
    preview: "",
    date: "",
    status: "unread",
  });

  useEffect(() => {
    axios.get(API_URL).then((res) => setMessages(res.data));
  }, []);

  const handleChange = (e) => {
    setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
  };

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (
      newMessage.sender.trim() &&
      newMessage.subject.trim() &&
      newMessage.preview.trim() &&
      newMessage.date.trim()
    ) {
      if (editId) {
        axios.put(`${API_URL}/${editId}`, newMessage).then((res) => {
          setMessages(
            messages.map((m) => (m.id === Number(editId) ? res.data : m))
          );
          setEditId(null);
          setShowForm(false);
          setNewMessage({
            sender: "",
            subject: "",
            preview: "",
            date: "",
            status: "unread",
          });
        });
      } else {
        axios.post(API_URL, newMessage).then((res) => {
          setMessages([...messages, res.data]);
          setShowForm(false);
          setNewMessage({
            sender: "",
            subject: "",
            preview: "",
            date: "",
            status: "unread",
          });
        });
      }
    }
  };

  const handleEdit = (message) => {
    setEditId(message.id);
    setNewMessage({
      sender: message.sender,
      subject: message.subject,
      preview: message.preview,
      date: message.date,
      status: message.status,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setMessages(messages.filter((m) => m.id !== id));
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Communications</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setNewMessage({
              sender: "",
              subject: "",
              preview: "",
              date: "",
              status: "unread",
            });
          }}
        >
          + Nouveau Message
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleAddMessage}
          className="mb-6 bg-gray-50 p-4 rounded-lg shadow space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="sender"
              placeholder="Expéditeur"
              value={newMessage.sender}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Sujet"
              value={newMessage.subject}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="preview"
              placeholder="Aperçu"
              value={newMessage.preview}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="date"
              name="date"
              value={newMessage.date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="status"
              value={newMessage.status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="unread">Non lu</option>
              <option value="read">Lu</option>
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
                Expéditeur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sujet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aperçu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message) => (
              <tr key={message.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {message.sender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {message.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {message.preview}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{message.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {message.status === "unread" ? "Non lu" : "Lu"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEdit(message)}
                  >
                    Éditer
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(message.id)}
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

export default Communications;
