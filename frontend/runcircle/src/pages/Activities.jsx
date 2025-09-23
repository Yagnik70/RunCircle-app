import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Activities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">All Activities</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {activities.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Sport</th>
                <th className="p-2">Start</th>
                <th className="p-2">End</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Distance</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{a.id}</td>
                  <td className="p-2">{a.user_name || a.user_id}</td>
                  <td className="p-2">{a.sport}</td>
                  <td className="p-2">
                    {a.start_time ? new Date(a.start_time).toLocaleString() : "N/A"}
                  </td>
                  <td className="p-2">
                    {a.end_time ? new Date(a.end_time).toLocaleString() : "Active"}
                  </td>
                  <td className="p-2">{a.duration || 0}</td>
                  <td className="p-2">{a.distance || 0}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p>No activities found.</p>
      )}
    </div>
  );
};

export default Activities;
