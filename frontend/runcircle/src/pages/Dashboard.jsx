
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Counter = ({ target, duration = 1000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
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

        const url =
          user?.role === "admin"
            ? "http://localhost:5000/api/admin/profiles"
            : "http://localhost:5000/api/profile";
        const res3 = await fetch(url, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data3 = await res3.json();
        setProfiles(user?.role === "admin" ? data3 : [data3]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchAll();
  }, [user]);

  const totalDistance = routes.reduce((sum, r) => sum + (r.distance_km || 0), 0);
  const recentRoutes = routes.slice(0, 7);

  if (loading)
    return <p className="text-center text-gray-500">Loading dashboard...</p>;

  return (
    <div className="p-4 space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            <Counter target={routes.length} />
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">All Routes</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            <Counter target={savedRoutes.length} />
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">Saved Routes</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            <Counter target={totalDistance} suffix=" km" />
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">Total Distance</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            <Counter target={profiles.length} />
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {user?.role === "admin" ? "Users" : "My Profile"}
          </p>
        </div>
      </div>

      {/* Chart */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold mb-4">
           Distance per Route
        </h2>
        {recentRoutes.length === 0 ? (
          <p className="text-gray-500 text-center">No routes available 🚫</p>
        ) : (
          <div className="bg-white p-4 shadow rounded-lg">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={recentRoutes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="from_location" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="distance_km"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Recent Routes */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold mb-4">🕒 Recent Routes</h2>
        {recentRoutes.length === 0 ? (
          <p className="text-gray-500 text-center">No recent routes 🚫</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">User</th>
                    <th className="p-2 text-left">From</th>
                    <th className="p-2 text-left">To</th>
                    <th className="p-2 text-left">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRoutes.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">
                        {r.first_name} {r.last_name}
                      </td>
                      <td className="p-2">{r.from_location}</td>
                      <td className="p-2">{r.to_location}</td>
                      <td className="p-2">{r.distance_km} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {recentRoutes.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-4 shadow rounded-lg space-y-1 text-sm"
                >
                  <p>
                    <span className="font-semibold">User:</span>{" "}
                    {r.first_name} {r.last_name}
                  </p>
                  <p>
                    <span className="font-semibold">From:</span>{" "}
                    {r.from_location}
                  </p>
                  <p>
                    <span className="font-semibold">To:</span> {r.to_location}
                  </p>
                  <p>
                    <span className="font-semibold">Distance:</span>{" "}
                    {r.distance_km} km
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Users Overview */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          👤 {user?.role === "admin" ? "Users Overview" : "My Profile"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow rounded-lg p-4 flex items-center space-x-4"
            >
              {p.profile_img ? (
                <img
                  src={p.profile_img}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  👤
                </div>
              )}
              <div>
                <p className="font-semibold">
                  {p.first_name} {p.last_name}
                </p>
                <p className="text-sm text-gray-500">{p.email}</p>
                <p className="text-xs text-gray-400">
                  {p.gender || "-"} |{" "}
                  {p.birthday
                    ? new Date(p.birthday).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

