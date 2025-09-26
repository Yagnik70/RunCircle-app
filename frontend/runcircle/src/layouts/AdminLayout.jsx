import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import Dashboard from "../pages/Dashboard";
import Activities from "../pages/Activities";
import Training from "../pages/Training";
import Profile from "../pages/Profile";
import Groups from "../pages/Groups";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar setIsOpen={setIsOpen} />
        <main className="p-4 md:p-6 flex-1 overflow-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="activities" element={<Activities />} />
            <Route path="training" element={<Training />} />
            <Route path="groups" element={<Groups />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
