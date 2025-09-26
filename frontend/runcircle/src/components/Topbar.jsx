import React from "react";
import { Menu, CircleUser, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Topbar = ({ setIsOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white shadow px-4 py-3 md:px-6 sticky top-0 z-30">
      <button
        className="md:hidden text-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={28} />
      </button>

      <div className="flex items-center gap-2">
        <CircleUser className="text-blue-600" size={28} />
        <h1 className="text-lg font-bold text-gray-800">RunCircle Admin</h1>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center gap-2">
            <CircleUser className="text-gray-600 hidden sm:block" size={22} />
            <span className="text-gray-700 font-medium hidden sm:block">
              {user?.email}
            </span>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
