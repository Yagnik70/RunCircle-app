import db from "../config/db.js";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

export const startActivity = (req, res) => {
  const { savedRouteId, sportId, latitude, longitude } = req.body;
  const userId = req.user?.id;

  if (!userId || !sportId) {
    return res.status(400).json({ error: "User or sportId missing" });
  }

  db.query(
    `INSERT INTO activities (user_id, saved_route_id, sport_id, start_time) VALUES (?, ?, ?, NOW())`,
    [userId, savedRouteId || null, sportId],
    (err, result) => {
      if (err) {
        console.error("Error starting activity:", err);
        return res.status(500).json({ error: "Failed to start activity" });
      }

      const activityId = result.insertId;

      if (latitude && longitude) {
        db.query(
          "INSERT INTO activity_points (activity_id, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW())",
          [activityId, latitude, longitude],
          (err) => {
            if (err) console.error("Error adding first point:", err);
          }
        );
      }

      res.json({
        activityId,
        message: "Activity started successfully",
        userId,
      });
    }
  );
};

export const addPoint = (req, res) => {
  const { activityId, latitude, longitude } = req.body;

  if (!activityId || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing activityId or coordinates" });
  }

  db.query(
    `INSERT INTO activity_points (activity_id, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW())`,
    [activityId, latitude, longitude],
    (err) => {
      if (err) {
        console.error("Error adding point:", err);
        return res.status(500).json({ error: "Failed to save point" });
      }

      res.json({ message: "Point recorded" });
    }
  );
};

export const stopActivity = (req, res) => {
  const { activityId } = req.body;
  const userId = req.user?.id;

  if (!activityId || !userId) {
    return res.status(400).json({ error: "Missing activityId or user" });
  }

  db.query(
    "SELECT start_time, user_id FROM activities WHERE id = ?",
    [activityId],
    (err, activityRows) => {
      if (err) return res.status(500).json({ error: "Failed to fetch activity" });

      if (activityRows.length === 0) return res.status(404).json({ error: "Activity not found" });

      const activity = activityRows[0];
      if (activity.user_id !== userId) return res.status(403).json({ error: "Not authorized to stop this activity" });

      db.query(
        "SELECT latitude, longitude, timestamp FROM activity_points WHERE activity_id = ? ORDER BY timestamp ASC",
        [activityId],
        (err, points) => {
          if (err) return res.status(500).json({ error: "Failed to fetch points" });

          let totalDistance = 0;
          for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            totalDistance += calculateDistance(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
          }

          const startTime = new Date(activity.start_time);
          const endTime = new Date();
          const durationSeconds = Math.floor((endTime - startTime) / 1000);

          const minutes = Math.floor(durationSeconds / 60);
          const seconds = durationSeconds % 60;
          const formattedDuration = `${minutes} minutes ${seconds} seconds`;

         
          db.query(
            "UPDATE activities SET end_time = NOW(), duration = ?, distance = ? WHERE id = ?",
            [durationSeconds, totalDistance.toFixed(2), activityId],
            (err) => {
              if (err) return res.status(500).json({ error: "Failed to stop activity" });

              res.json({
                message: "Activity stopped successfully",
                duration: formattedDuration,
                distance: totalDistance.toFixed(2),
              });
            }
          );
        }
      );
    }
  );
};

export const getUserActivities = (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: "userId missing" });

  db.query(
    `SELECT a.id, a.start_time, a.end_time, a.duration, a.distance, 
            s.name as sport, sr.id as saved_route_id
     FROM activities a
     JOIN sports s ON a.sport_id = s.id
     LEFT JOIN saved_routes sr ON a.saved_route_id = sr.id
     WHERE a.user_id = ?
     ORDER BY a.start_time DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Failed to fetch activities" });

      res.json(rows);
    }
  );
};
