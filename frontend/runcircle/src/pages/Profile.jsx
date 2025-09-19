import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    id: null,
    first_name: "",
    last_name: "",
    gender: "",
    birthday: "",
    user_id: "",
    profile_img: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `http://localhost:5000/api/admin/profiles/${form.id}`
        : "http://localhost:5000/api/admin/profiles";

      const formData = new FormData();
      formData.append("first_name", form.first_name);
      formData.append("last_name", form.last_name);
      formData.append("gender", form.gender);
      formData.append("birthday", form.birthday);

      if (!isEditing) formData.append("user_id", form.user_id);

      if (form.profile_img instanceof File) {
        formData.append("profile_img", form.profile_img);
      }

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setShowModal(false);
        setIsEditing(false);
        fetchData();
      } else {
        alert(result.error || "Action failed");
      }
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  const handleEdit = (profile) => {
    setForm({
      ...profile,
      profile_img: null,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
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
        {user?.role === "admin" && (
          <button
            onClick={() => {
              setForm({
                id: null,
                first_name: "",
                last_name: "",
                gender: "",
                birthday: "",
                user_id: "",
                profile_img: null,
              });
              setIsEditing(false);
              setShowModal(true);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base"
          >
            + Add Profile
          </button>
        )}
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
                {user?.role === "admin" && (
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      ✏️
                    </button>
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

            {user?.role === "admin" && (
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  ✏️
                </button>
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Profile" : "Add Profile"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="date"
                  name="birthday"
                  value={form.birthday}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="file"
                  name="profile_img"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, profile_img: e.target.files[0] })
                  }
                  className="border p-2 rounded w-full col-span-2"
                />

                {!isEditing && (
                  <input
                    type="number"
                    name="user_id"
                    placeholder="User ID"
                    value={form.user_id}
                    onChange={handleChange}
                    className="border p-2 rounded w-full col-span-2"
                    required
                  />
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
