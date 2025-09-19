import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "all fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password) VALUES (? , ? , ?)";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email alredy exists" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
export const login = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.json(500).json({ error: err.message });
    if (result.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "invalid credentials" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    res.json({ message: "login successful", token });
  });
};
