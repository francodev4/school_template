import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    events: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Charger toutes les stats en parallèle
    Promise.all([
      axios.get("http://localhost:5000/students"),
      axios.get("http://localhost:5000/teachers"),
      axios.get("http://localhost:5000/library"),
      axios.get("http://localhost:5000/calendar"),
      axios.get("http://localhost:5000/communications"),
    ]).then(([studentsRes, teachersRes, libraryRes, calendarRes, commRes]) => {
      setStats({
        students: studentsRes.data.length,
        teachers: teachersRes.data.length,
        courses: libraryRes.data.filter((r) => r.type === "course").length,
        events: calendarRes.data.length,
      });
      // Générer les activités récentes (exemple : derniers ajouts)
      const activities = [];
      if (studentsRes.data.length > 0) {
        const lastStudent = studentsRes.data[studentsRes.data.length - 1];
        activities.push({
          type: "student",
          text: `Nouvel étudiant inscrit - ${lastStudent.name}`,
        });
      }
      if (commRes.data.length > 0) {
        const lastMsg = commRes.data[commRes.data.length - 1];
        activities.push({
          type: "message",
          text: `Message envoyé - ${lastMsg.subject}`,
        });
      }
      if (calendarRes.data.length > 0) {
        const lastEvent = calendarRes.data[calendarRes.data.length - 1];
        activities.push({
          type: "event",
          text: `Nouvel événement ajouté - ${lastEvent.title}`,
        });
      }
      if (libraryRes.data.length > 0) {
        const lastCourse = libraryRes.data[libraryRes.data.length - 1];
        activities.push({
          type: "course",
          text: `Nouveau cours ajouté - ${lastCourse.title}`,
        });
      }
      setRecentActivities(activities);
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link
          to="/students"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Total Étudiants
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.students}
              </p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </Link>
        <Link
          to="/teachers"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Enseignants
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.teachers}
              </p>
            </div>
            <span className="text-3xl">👨‍🏫</span>
          </div>
        </Link>
        <Link
          to="/library"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Cours Actifs
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.courses}
              </p>
            </div>
            <span className="text-3xl">📚</span>
          </div>
        </Link>
        <Link
          to="/calendar"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Événements à venir
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.events}
              </p>
            </div>
            <span className="text-3xl">📅</span>
          </div>
        </Link>
      </div>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Activités Récentes
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ul className="space-y-4">
            {recentActivities.length === 0 && (
              <li className="text-gray-500">Aucune activité récente.</li>
            )}
            {recentActivities.map((activity, idx) => (
              <li key={idx} className="flex items-center text-gray-700">
                <span className="mr-3">
                  {activity.type === "student" && "👥"}
                  {activity.type === "message" && "📨"}
                  {activity.type === "event" && "📅"}
                  {activity.type === "course" && "📚"}
                </span>
                <span>{activity.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
