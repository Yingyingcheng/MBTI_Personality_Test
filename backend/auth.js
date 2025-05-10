import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const router = express.Router();

// User registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if username or email already exists
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
    );

    if (existingUsers.length > 0) {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, username },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: result.insertId, username, email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user by username
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = users[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user profile (protected route)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [req.user.id],
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      req.user = user;
      next();
    },
  );
}

export default router;
export { authenticateToken };
