import React from "react";

const Activities = () => {
  const data = [
    { id: "A001", user: "John Doe", date: "2023-09-15", distance: "5 km", status: "Completed" },
    { id: "A002", user: "Jane Smith", date: "2023-09-16", distance: "10 km", status: "Pending" },
    { id: "A003", user: "Alex Ray", date: "2023-09-17", distance: "7 km", status: "Completed" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Activities</h2>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          + Add Activity
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">User</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Distance</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="text-center">
              <td className="border px-4 py-2">{row.id}</td>
              <td className="border px-4 py-2">{row.user}</td>
              <td className="border px-4 py-2">{row.date}</td>
              <td className="border px-4 py-2">{row.distance}</td>
              <td className="border px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    row.status === "Completed" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="border px-4 py-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activities;
