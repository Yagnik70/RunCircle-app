import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const url =
        user.role === "admin"
          ? "http://localhost:5000/api/admin/profiles"
          : "http://localhost:5000/api/profile";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const result = await res.json();
      if (res.ok) {
        setData(user.role === "admin" ? result : [result]);
      } else {
        alert(result.error || "Failed to fetch profile data");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleToggleStatus = async (id, currentStatus) => {
    setData((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status_flag: currentStatus ? 0 : 1 } : u
      )
    );

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ status_flag: currentStatus ? 0 : 1 }),
        }
      );

      if (!res.ok) {
        const result = await res.json();
        alert(result.error || "Status update failed");
        setData((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status_flag: currentStatus } : u
          )
        );
      }
    } catch (err) {
      console.error("Toggle Error:", err);
      setData((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, status_flag: currentStatus } : u
        )
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?"))
      return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/profiles/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const result = await res.json();
      if (res.ok) {
        fetchData();
      } else {
        alert(result.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold">
          {user?.role === "admin" ? "All User Profiles" : "My Profile"}
        </h2>
      </div>

      <div className="hidden sm:block bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold">Profile</th>
              <th className="p-3 text-left font-semibold">First Name</th>
              <th className="p-3 text-left font-semibold">Last Name</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Gender</th>
              <th className="p-3 text-left font-semibold">Birthday</th>
              <th className="p-3 text-left font-semibold">Role</th>
              <th className="p-3 text-left font-semibold">Status</th>
              {user?.role === "admin" && (
                <th className="p-3 text-center font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-3">
                  {u.profile_img ? (
                    <img
                      src={u.profile_img}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      👤
                    </div>
                  )}
                </td>
                <td className="p-3">{u.first_name || "-"}</td>
                <td className="p-3">{u.last_name || "-"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.gender || "-"}</td>
                <td className="p-3">
                  {u.birthday ? new Date(u.birthday).toLocaleDateString() : "-"}
                </td>
                <td className="p-3">{u.role || "user"}</td>
                <td className="p-3">
                  {user?.role === "admin" ? (
                    <div
                      onClick={() => handleToggleStatus(u.id, u.status_flag)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                        u.status_flag ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          u.status_flag ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </div>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        u.status_flag
                          ? "bg-green-100 text-green-900"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {u.status_flag ? "Active" : "Inactive"}
                    </span>
                  )}
                </td>
                {user?.role === "admin" && (
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      🗑
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sm:hidden space-y-4">
        {data.map((u) => (
          <div
            key={u.id}
            className="bg-white shadow rounded-lg p-4 border space-y-2 text-sm"
          >
            <div className="flex items-center space-x-3">
              {u.profile_img ? (
                <img
                  src={u.profile_img}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg">
                  👤
                </div>
              )}
              <div>
                <p className="font-semibold">
                  {u.first_name} {u.last_name}
                </p>
                <p className="text-gray-500 text-xs">{u.email}</p>
              </div>
            </div>

            <p>
              <span className="font-semibold">Gender:</span> {u.gender || "-"}
            </p>
            <p>
              <span className="font-semibold">Birthday:</span>{" "}
              {u.birthday ? new Date(u.birthday).toLocaleDateString() : "-"}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {u.role || "user"}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Status:</span>
              <div
                onClick={() => handleToggleStatus(u.id, u.status_flag)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                  u.status_flag ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    u.status_flag ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            {user?.role === "admin" && (
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => handleDelete(u.id)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  🗑
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Profile;
