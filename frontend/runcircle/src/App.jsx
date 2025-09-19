import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin/*"
        element={
          user?.role === "admin" ? <AdminLayout /> : <Navigate to="/login" />
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
