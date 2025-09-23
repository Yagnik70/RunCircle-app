import db from "../config/db.js";
import jwt from "jsonwebtoken";

export const adminlogin = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, rows) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const admin = rows[0];

    if (password !== admin.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      id: admin.id,
      email: admin.email,
      role: "admin",
      token,
    });
  });
};

export const getAllUsers = (req, res) => {
  db.query(
    "SELECT id, first_name, last_name, email, role FROM users",
    (err, rows) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Failed to fetch users" });
      }
      res.json(rows);
    }
  );
};

export const getAllProfiles = (req, res) => {
  const query = `
    SELECT 
      up.id,
      up.user_id,
      up.first_name,
      up.last_name,
      u.email,
      up.gender,
      up.birthday,
      up.profile_img,
      u.role
    FROM user_profile up
    LEFT JOIN users u ON up.user_id = u.id
  `;

  db.query(query, (err, rows) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Failed to fetch profiles" });
    }

    const profiles = rows.map((row) => ({
      ...row,
      profile_img: row.profile_img
        ? `${req.protocol}://${req.get("host")}${row.profile_img}`
        : null,
    }));

    res.json(profiles);
  });
};
export const toggleUserStatus = (req, res) => {
  const { id } = req.params;
  const { status_flag } = req.body;

  db.query(
    "UPDATE users SET status_flag = ? WHERE id = ?",
    [status_flag, id],
    (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Failed to update status" });
      }
      res.json({ message: "User status updated successfully" });
    }
  );
};

export const deleteProfile = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM user_profile WHERE id=?", [id], (err) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Failed to delete profile" });
    }
    res.json({ message: "Profile deleted successfully" });
  });
};
