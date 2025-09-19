import React from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Topbar = ({ setIsOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white shadow px-4 py-4 md:px-6 sticky top-0 z-30">
      <button
        className="md:hidden text-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={28} />
      </button>

      <h1 className="text-lg font-bold">RunCircle Admin</h1>

      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium hidden sm:block">
          {user?.email}
        </span>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
