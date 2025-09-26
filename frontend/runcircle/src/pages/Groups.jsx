import React, { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";

const GroupsList = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch((err) => console.error("Error fetching groups:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex gap-3">
        {" "}
        <FiUsers />
        All Groups
      </h1>

      <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Created By
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {groups.map((group, index) => (
              <tr
                key={group.id}
                className={`transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50`}
              >
                <td className="px-4 py-2 text-sm text-gray-700">{group.id}</td>
                <td className="px-4 py-2 text-sm text-gray-800 font-medium">
                  {group.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 capitalize">
                  {group.type}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {group.description || "-"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {group.created_by}
                </td>
              </tr>
            ))}
            {groups.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No groups found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {groups.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No groups found </p>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="bg-white shadow rounded-lg p-4 space-y-2 transition hover:shadow-md"
            >
              <p className="text-sm text-gray-500">
                <span className="font-semibold">ID:</span> {group.id}
              </p>
              <p className="text-sm text-gray-800 font-medium">
                <span className="font-semibold">Name:</span> {group.name}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                <span className="font-semibold">Type:</span> {group.type}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Description:</span>{" "}
                {group.description || "-"}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Created By:</span>{" "}
                {group.created_by}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupsList;
