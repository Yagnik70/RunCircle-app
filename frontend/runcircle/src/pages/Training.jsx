import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Training = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 All Routes
        const res1 = await fetch("http://localhost:5000/api/admin/routes", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data1 = await res1.json();
        setRoutes(data1);

        // 🔹 All Saved Routes
        const res2 = await fetch("http://localhost:5000/api/admin/saved-routes", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data2 = await res2.json();
        setSavedRoutes(data2);
      } catch (err) {
        console.error("Error fetching training data", err);
      }
    };
    if (user) fetchData();
  }, [user]);

  return (
    <div className="p-4 space-y-10">
      {/* ----------------- All Routes ----------------- */}
      <section>
        <h2 className="text-xl font-bold mb-4">📍 All Routes</h2>

        {/* ✅ Table for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Email</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Distance</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id} className="border-t">
                  <td className="p-2">
                    {route.first_name} {route.last_name}
                  </td>
                  <td className="p-2">{route.email}</td>
                  <td className="p-2">{route.from_location}</td>
                  <td className="p-2">{route.to_location}</td>
                  <td className="p-2">{route.distance_km} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Card View for Mobile */}
        <div className="md:hidden space-y-3">
          {routes.map((route) => (
            <div
              key={route.id}
              className="border rounded-lg p-3 shadow bg-white"
            >
              <p className="font-semibold">
                👤 {route.first_name} {route.last_name}
              </p>
              <p className="text-sm text-gray-600">📧 {route.email}</p>
              <p className="text-sm">
                📍 {route.from_location} ➝ {route.to_location}
              </p>
              <p className="text-sm">📏 {route.distance_km} km</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- All Saved Routes ----------------- */}
      <section>
        <h2 className="text-xl font-bold mb-4">💾 Saved Routes</h2>

        {/* ✅ Table for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Email</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Distance</th>
                <th className="p-2">Sport</th>
              </tr>
            </thead>
            <tbody>
              {savedRoutes.map((sr) => (
                <tr key={sr.id} className="border-t">
                  <td className="p-2">
                    {sr.first_name} {sr.last_name}
                  </td>
                  <td className="p-2">{sr.email}</td>
                  <td className="p-2">{sr.from_location}</td>
                  <td className="p-2">{sr.to_location}</td>
                  <td className="p-2">{sr.distance_km} km</td>
                  <td className="p-2">{sr.sport}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Card View for Mobile */}
        <div className="md:hidden space-y-3">
          {savedRoutes.map((sr) => (
            <div
              key={sr.id}
              className="border rounded-lg p-3 shadow bg-white"
            >
              <p className="font-semibold">
                👤 {sr.first_name} {sr.last_name}
              </p>
              <p className="text-sm text-gray-600">📧 {sr.email}</p>
              <p className="text-sm">
                📍 {sr.from_location} ➝ {sr.to_location}
              </p>
              <p className="text-sm">📏 {sr.distance_km} km</p>
              <p className="text-sm">🏅 {sr.sport}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Training;
