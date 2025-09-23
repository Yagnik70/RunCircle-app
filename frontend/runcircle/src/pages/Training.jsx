
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Training = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch("http://localhost:5000/api/admin/routes", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data1 = await res1.json();
        setRoutes(data1);

        const res2 = await fetch("http://localhost:5000/api/admin/saved-routes", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data2 = await res2.json();
        setSavedRoutes(data2);
      } catch (err) {
        console.error("Error fetching training data", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);
  
  const filteredRoutes = routes.filter((r) =>
    [r.first_name, r.last_name, r.email, r.from_location, r.to_location]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredSavedRoutes = savedRoutes.filter((sr) =>
    [
      sr.first_name,
      sr.last_name,
      sr.email,
      sr.from_location,
      sr.to_location,
      sr.sport,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-gray-500">Loading training data...</p>;
  }

  return (
    <div className="p-4 space-y-10">
   
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="font-semibold">Search:</div>
        <input
          type="text"
          placeholder="Search by user, email, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:flex-1 shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">📍 All Routes</h2>
        {filteredRoutes.length === 0 ? (
          <p className="text-gray-500 text-center">🚫 No routes found</p>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto rounded-lg shadow">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">User</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">From</th>
                    <th className="p-2 text-left">To</th>
                    <th className="p-2 text-left">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map((route) => (
                    <tr key={route.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{route.first_name} {route.last_name}</td>
                      <td className="p-2">{route.email}</td>
                      <td className="p-2">{route.from_location}</td>
                      <td className="p-2">{route.to_location}</td>
                      <td className="p-2">{route.distance_km} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className="border rounded-lg p-3 shadow bg-white"
                >
                  <p className="font-semibold">👤 {route.first_name} {route.last_name}</p>
                  <p className="text-sm text-gray-600">📧 {route.email}</p>
                  <p className="text-sm">📍 {route.from_location} ➝ {route.to_location}</p>
                  <p className="text-sm">📏 {route.distance_km} km</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">💾 Saved Routes</h2>
        {filteredSavedRoutes.length === 0 ? (
          <p className="text-gray-500 text-center">🚫 No saved routes found</p>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto rounded-lg shadow">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">User</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">From</th>
                    <th className="p-2 text-left">To</th>
                    <th className="p-2 text-left">Distance</th>
                    <th className="p-2 text-left">Sport</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSavedRoutes.map((sr) => (
                    <tr key={sr.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{sr.first_name} {sr.last_name}</td>
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

            <div className="md:hidden space-y-3">
              {filteredSavedRoutes.map((sr) => (
                <div
                  key={sr.id}
                  className="border rounded-lg p-3 shadow bg-white"
                >
                  <p className="font-semibold">👤 {sr.first_name} {sr.last_name}</p>
                  <p className="text-sm text-gray-600">📧 {sr.email}</p>
                  <p className="text-sm">📍 {sr.from_location} ➝ {sr.to_location}</p>
                  <p className="text-sm">📏 {sr.distance_km} km</p>
                  <p className="text-sm">🏅 {sr.sport}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Training;