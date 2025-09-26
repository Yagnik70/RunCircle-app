import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Activity,
  Dumbbell,
  User,
  LogOut,
  Circle,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Activities",
      icon: <Activity size={20} />,
      path: "/admin/activities",
    },
    { name: "Training", icon: <Dumbbell size={20} />, path: "/admin/training" },
    { name: "Groups", icon: <Users size={20} />, path: "/admin/groups" },
    { name: "Profile", icon: <User size={20} />, path: "/admin/profile" },
  ];

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Circle className="text-blue-400" size={28} />
          <h2 className="text-xl font-bold text-blue-400">RunCircle Admin</h2>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="mt-6 space-y-1 px-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600 hover:text-white transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
