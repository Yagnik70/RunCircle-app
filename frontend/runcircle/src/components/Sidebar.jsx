import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">RunCircle Admin</h2>

        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="mt-6 space-y-2 px-2">
        <Link
          to="/admin/dashboard"
          className="block px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/activities"
          className="block px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Activities
        </Link>
        <Link
          to="/admin/training"
          className="block px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Training
        </Link>
        <Link
          to="/admin/profile"
          className="block px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Profile
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
