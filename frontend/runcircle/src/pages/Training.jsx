import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaRuler,
  FaMedal,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Training = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [routesPage, setRoutesPage] = useState(1);
  const [savedRoutesPage, setSavedRoutesPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch("http://localhost:5000/api/admin/routes", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data1 = await res1.json();
        setRoutes(data1);

        const res2 = await fetch(
          "http://localhost:5000/api/admin/saved-routes",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
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

  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };
  const totalPagesRoutes = Math.ceil(filteredRoutes.length / itemsPerPage);
  const totalPagesSaved = Math.ceil(filteredSavedRoutes.length / itemsPerPage);

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading training data...</p>
    );
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
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-500 text-2xl" /> All Routes
        </h2>
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
                  {getPaginatedData(filteredRoutes, routesPage).map((route) => (
                    <tr key={route.id} className="border-t hover:bg-gray-50">
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

            <div className="md:hidden space-y-3">
              {getPaginatedData(filteredRoutes, routesPage).map((route) => (
                <div
                  key={route.id}
                  className="border rounded-lg p-3 shadow bg-white"
                >
                  <p className="font-semibold flex items-center gap-2">
                    <FaUser className="text-gray-700" /> {route.first_name}{" "}
                    {route.last_name}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaEnvelope className="text-blue-500" /> {route.email}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-700" />{" "}
                    {route.from_location} ➝ {route.to_location}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <FaRuler className="text-pink-500" /> {route.distance_km} km
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center gap-2 mt-3">
              <div className="flex items-center gap-2">
                <label className="font-semibold">Items per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setRoutesPage(1);
                    setSavedRoutesPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 shadow-sm"
                >
                  {[5, 7, 10, 20].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center gap-2 mt-3">
                <button
                  onClick={() => setRoutesPage((p) => Math.max(p - 1, 1))}
                  disabled={routesPage === 1}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                <span>
                  {routesPage} / {totalPagesRoutes}
                </span>
                <button
                  onClick={() =>
                    setRoutesPage((p) => Math.min(p + 1, totalPagesRoutes))
                  }
                  disabled={routesPage === totalPagesRoutes}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaMedal className="text-yellow-500 text-2xl" /> Saved Routes
        </h2>
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
                  {getPaginatedData(filteredSavedRoutes, savedRoutesPage).map(
                    (sr) => (
                      <tr key={sr.id} className="border-t hover:bg-gray-50">
                        <td className="p-2">
                          {sr.first_name} {sr.last_name}
                        </td>
                        <td className="p-2">{sr.email}</td>
                        <td className="p-2">{sr.from_location}</td>
                        <td className="p-2">{sr.to_location}</td>
                        <td className="p-2">{sr.distance_km} km</td>
                        <td className="p-2">{sr.sport}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {getPaginatedData(filteredSavedRoutes, savedRoutesPage).map(
                (sr) => (
                  <div
                    key={sr.id}
                    className="border rounded-lg p-3 shadow bg-white"
                  >
                    <p className="font-semibold flex items-center gap-2">
                      <FaUser className="text-gray-700" /> {sr.first_name}{" "}
                      {sr.last_name}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" /> {sr.email}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-700" />{" "}
                      {sr.from_location} ➝ {sr.to_location}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <FaRuler className="text-pink-500" /> {sr.distance_km} km
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <FaMedal className="text-yellow-500" /> {sr.sport}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="flex justify-between items-center gap-2 mt-3">
              <div className="flex items-center gap-2">
                <label className="font-semibold">Items per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setRoutesPage(1);
                    setSavedRoutesPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 shadow-sm"
                >
                  {[5, 7, 10, 20].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center gap-2 mt-3">
                <button
                  onClick={() => setRoutesPage((p) => Math.max(p - 1, 1))}
                  disabled={routesPage === 1}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                <span>
                  {routesPage} / {totalPagesRoutes}
                </span>
                <button
                  onClick={() =>
                    setRoutesPage((p) => Math.min(p + 1, totalPagesRoutes))
                  }
                  disabled={routesPage === totalPagesRoutes}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Training;
