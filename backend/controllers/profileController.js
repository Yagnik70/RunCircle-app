import db from "../config/db.js";

export const createProfile = (req, res) => {

  console.log("REQ.BODY:", req.body);
  console.log("REQ.FILE:", req.file);
  console.log("REQ.USER:", req.user);

  const { first_name, last_name, birthday, gender } = req.body;
  const userId = req.user?.id;
  const profileImg = req.file ? `/uploads/${req.file.filename}` : null;

  if (!userId) 
    return res.status(400).json({ message: "User ID missing from token" });

  if (!first_name?.trim() || !last_name?.trim() || !birthday?.trim() || !gender?.trim())
    return res.status(400).json({ message: "All fields are required" });

  db.query(
    "INSERT INTO user_profile (user_id, first_name, last_name, birthday, gender, profile_img) VALUES (?,?,?,?,?,?)",
    [userId, first_name, last_name, birthday, gender, profileImg],
    (err, result) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ message: err.sqlMessage });
      }
      res.json({ message: "Profile created successfully", profileId: result.insertId });
    }
  );
};

export const getProfile = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(400).json({ message: "User ID missing from token" });

  db.query("SELECT * FROM user_profile WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ message: err.sqlMessage });
    if (result.length === 0) return res.status(404).json({ message: "Profile not found" });
    res.json(result[0]);
  });
};

export const updateProfile = (req, res) => {
  const { first_name, last_name, birthday, gender } = req.body;
  const userId = req.user?.id;
  const profileImg = req.file ? `/uploads/${req.file.filename}` : null;

  if (!userId) return res.status(400).json({ message: "User ID missing from token" });

  db.query("SELECT * FROM user_profile WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ message: err.sqlMessage });
    if (result.length === 0) return res.status(404).json({ message: "Profile not found" });

    const current = result[0];

    db.query(
      "UPDATE user_profile SET first_name=?, last_name=?, birthday=?, gender=?, profile_img=? WHERE user_id=?",
      [
        first_name || current.first_name,
        last_name || current.last_name,
        birthday || current.birthday,
        gender || current.gender,
        profileImg || current.profile_img,
        userId,
      ],
      (err) => {
        if (err) return res.status(500).json({ message: err.sqlMessage });
        res.json({ message: "Profile updated successfully" });
      }
    );
  });
};

export const deleteProfile = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(400).json({ message: "User ID missing from token" });

  db.query("DELETE FROM user_profile WHERE user_id = ?", [userId], (err) => {
    if (err) return res.status(500).json({ message: err.sqlMessage });
    res.json({ message: "Profile deleted successfully" });
  });
};
