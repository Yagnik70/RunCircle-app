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

export const createProfile = (req, res) => {
  const { user_id, first_name, last_name, birthday, gender } = req.body;
  const profileImg = req.file ? `/uploads/${req.file.filename}` : null;

  if (!user_id || !first_name || !last_name) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const query = `
    INSERT INTO user_profile (user_id, first_name, last_name, birthday, gender, profile_img) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [user_id, first_name, last_name, birthday, gender, profileImg],
    (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Failed to create profile" });
      }

      const imgUrl = profileImg
        ? `${req.protocol}://${req.get("host")}${profileImg}`
        : null;

      res.json({
        message: "Profile created successfully",
        id: result.insertId,
        profile_img: imgUrl,
      });
    }
  );
};

export const updateProfile = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, birthday, gender } = req.body;
  const profileImg = req.file ? `/uploads/${req.file.filename}` : null;

  db.query("SELECT * FROM user_profile WHERE id=?", [id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Failed to fetch profile" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const current = result[0];

    const query = `
      UPDATE user_profile 
      SET first_name=?, last_name=?, birthday=?, gender=?, profile_img=? 
      WHERE id=?
    `;

    db.query(
      query,
      [
        first_name || current.first_name,
        last_name || current.last_name,
        birthday || current.birthday,
        gender || current.gender,
        profileImg || current.profile_img,
        id,
      ],
      (err2) => {
        if (err2) {
          console.error("DB Error:", err2);
          return res.status(500).json({ error: "Failed to update profile" });
        }

        const imgUrl = profileImg
          ? `${req.protocol}://${req.get("host")}${profileImg}`
          : current.profile_img
          ? `${req.protocol}://${req.get("host")}${current.profile_img}`
          : null;

        res.json({
          message: "Profile updated successfully",
          profile_img: imgUrl,
        });
      }
    );
  });
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
