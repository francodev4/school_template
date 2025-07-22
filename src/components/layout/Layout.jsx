import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Tableau de bord", icon: "📊" },
    { path: "/students", label: "Étudiants", icon: "👥" },
    { path: "/teachers", label: "Enseignants", icon: "👨‍🏫" },
    { path: "/calendar", label: "Calendrier", icon: "📅" },
    { path: "/communications", label: "Communications", icon: "📨" },
    { path: "/grades", label: "Notes", icon: "📝" },
    { path: "/library", label: "Bibliothèque", icon: "📚" },
    { path: "/settings", label: "Paramètres", icon: "⚙️" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white w-64 min-h-screen p-4 shadow-lg ${
          isSidebarOpen ? "" : "hidden"
        }`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">GestionÉcole</h1>
        </div>
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 mb-2 rounded transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700 font-bold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mb-4 p-2 rounded bg-white shadow"
        >
          {isSidebarOpen ? "←" : "→"}
        </button>
        {children}
      </main>
    </div>
  );
};

export default Layout;
