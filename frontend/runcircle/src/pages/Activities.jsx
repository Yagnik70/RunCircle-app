import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaChevronLeft, FaChevronRight, FaTasks } from "react-icons/fa";

const Activities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchActivities = async () => {
    try {
      if (!user?.token) {
        setError("Token missing. Please login.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/activity/all", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Error ${res.status}`);
      }

      const data = await res.json();
      setActivities(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/activity/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Failed to delete activity");

      setActivities(activities.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const sortActivities = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";

    const sorted = [...activities].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setActivities(sorted);
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentActivities = activities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(activities.length / rowsPerPage);

  return (
    <div className="p-6">
      {/* Heading with Icon */}
      <h1 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
        <FaTasks className="text-blue-500 text-2xl" /> All Activities
      </h1>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {activities.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: "ID", key: "id" },
                    { label: "User", key: "user_name" },
                    { label: "Sport", key: "sport" },
                    { label: "Start", key: "start_time" },
                    { label: "End", key: "end_time" },
                    { label: "Duration", key: "duration" },
                    { label: "Distance", key: "distance" },
                    { label: "Actions", key: "actions" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => col.key !== "actions" && sortActivities(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortConfig.key === col.key && (
                          <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentActivities.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{a.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{a.user_name || a.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{a.sport}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{a.start_time ? new Date(a.start_time).toLocaleString() : "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{a.end_time ? new Date(a.end_time).toLocaleString() : "Active"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{a.duration || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{a.distance || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete Activity"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <label className="mr-2 font-medium">Rows per page:</label>
              <select
                className="border rounded px-2 py-1"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <FaChevronLeft /> Prev
              </button>
              <span className="px-2 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next <FaChevronRight />
              </button>
            </div>
          </div>
        </>
      ) : (
        !error && <p className="text-center text-gray-500 mt-4">No activities found.</p>
      )}
    </div>
  );
};

export default Activities;
