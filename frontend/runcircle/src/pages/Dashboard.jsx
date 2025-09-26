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
import { TbRouteSquare } from "react-icons/tb";
import { FaRegBookmark, FaRoad, FaUserFriends, FaUser } from "react-icons/fa";

const Counter = ({ target, duration = 1000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(parseFloat(target.toFixed(3))); 
        clearInterval(timer);
      } else {
        setCount(parseFloat(start.toFixed(3))); 
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
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
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

        const url =
          user?.role === "admin"
            ? "http://localhost:5000/api/admin/profiles"
            : "http://localhost:5000/api/profile";
        const res3 = await fetch(url, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data3 = await res3.json();
        setProfiles(user?.role === "admin" ? data3 : [data3]);

        const res4 = await fetch("http://localhost:5000/api/groups");
        const data4 = await res4.json();
        setGroups(data4);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchAll();
  }, [user]);

  const totalDistance = routes.reduce(
    (sum, r) => sum + (r.distance_km || 0),
    0
  );
  const recentRoutes = routes.slice(0, 7);

  const savedDistanceData = savedRoutes.reduce((acc, r) => {
    const userName = `${r.first_name} ${r.last_name}`;
    if (!acc[userName]) acc[userName] = 0;
    acc[userName] += r.distance_km || 0;
    return acc;
  }, {});

  const chartData = Object.entries(savedDistanceData).map(
    ([user, TotalKm]) => ({
      user,
      TotalKm: parseFloat(TotalKm.toFixed(3)), // formatted
    })
  );

  if (loading)
    return <p className="text-center text-gray-500">Loading dashboard...</p>;

  return (
    <div className="p-4 space-y-10">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            <Counter target={routes.length} />
          </h2>
          <p className="text-gray-500 text-sm sm:text-base flex items-center justify-center gap-2">
            <TbRouteSquare className="text-blue-500 text-2xl sm:text-3xl" /> All
            Routes
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            <Counter target={savedRoutes.length} />
          </h2>
          <p className="text-gray-500 text-sm sm:text-base flex items-center justify-center gap-2">
            <FaRegBookmark className="text-pink-500 text-2xl sm:text-3xl" />{" "}
            Saved Routes
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            <Counter target={totalDistance} suffix=" km" />
          </h2>
          <p className="text-gray-500 text-sm sm:text-base flex items-center justify-center gap-2">
            <FaRoad className="text-green-500 text-2xl sm:text-3xl" /> Total
            Distance
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            <Counter target={profiles.length} />
          </h2>
          <p className="text-gray-500 text-sm sm:text-base flex items-center justify-center gap-2">
            {user?.role === "admin" ? (
              <>
                <FaUserFriends className="text-purple-500 text-2xl sm:text-3xl" />{" "}
                Users
              </>
            ) : (
              <>
                <FaUser className="text-purple-500 text-2xl sm:text-3xl" /> My
                Profile
              </>
            )}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            <Counter target={groups.length} />
          </h2>
          <p className="text-gray-500 text-sm sm:text-base flex items-center justify-center gap-2">
            <FaUserFriends className="text-orange-500 text-2xl sm:text-3xl" />{" "}
            Groups
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          🏃 Saved Routes - Total KM
        </h2>
        {chartData.length === 0 ? (
          <p className="text-gray-500 text-center">No saved routes 🚫</p>
        ) : (
          <div className="bg-white p-4 shadow rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(3)} km`} />
                <Bar dataKey="TotalKm" fill="#1f2c55" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg sm:text-xl font-bold mb-4">🕒 Recent Routes</h2>
        {recentRoutes.length === 0 ? (
          <p className="text-gray-500 text-center">No recent routes 🚫</p>
        ) : (
          <>
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
                      <td className="p-2">{r.distance_km?.toFixed(3)} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {recentRoutes.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-4 shadow rounded-lg space-y-1 text-sm"
                >
                  <p>
                    <span className="font-semibold">User:</span> {r.first_name}{" "}
                    {r.last_name}
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
                    {r.distance_km?.toFixed(3)} km
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

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
                  {p.birthday ? new Date(p.birthday).toLocaleDateString() : "-"}
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
