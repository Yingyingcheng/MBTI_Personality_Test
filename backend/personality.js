import express from "express";
import { pool } from "./db.js";
import { authenticateToken } from "./auth.js";

const router = express.Router();

// Helper function to safely parse JSON
const safelyParseJSON = (json) => {
  if (!json) return null;

  // If it's already an object, return it
  if (typeof json === "object") return json;

  // If it's not a string, can't parse it
  if (typeof json !== "string") return json;

  try {
    return JSON.parse(json);
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return json; // Return the original string if parsing fails
  }
};

// Get all tests for a user
router.get("/results", authenticateToken, async (req, res) => {
  try {
    const [results] = await pool.query(
      "SELECT * FROM test_results WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id],
    );

    // Process each result to safely handle score field
    const processedResults = results.map((result) => ({
      ...result,
      score: safelyParseJSON(result.score),
    }));

    res.json({ results: processedResults });
  } catch (error) {
    console.error("Error fetching test results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Save a new test result
router.post("/results", authenticateToken, async (req, res) => {
  try {
    const { result_type, score } = req.body;

    // Validate input
    if (!result_type || !score) {
      return res
        .status(400)
        .json({ error: "Result type and score are required" });
    }

    // Make sure score is properly stringified before storing
    const scoreJSON = typeof score === "string" ? score : JSON.stringify(score);

    // Insert new test result
    const [result] = await pool.query(
      "INSERT INTO test_results (user_id, result_type, score) VALUES (?, ?, ?)",
      [req.user.id, result_type, scoreJSON],
    );

    res.status(201).json({
      message: "Test result saved successfully",
      id: result.insertId,
      result_type,
      score,
      created_at: new Date(),
    });
  } catch (error) {
    console.error("Error saving test result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific test result
router.get("/results/:id", authenticateToken, async (req, res) => {
  try {
    const [results] = await pool.query(
      "SELECT * FROM test_results WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Test result not found" });
    }

    // Get the result and safely parse the score field
    const result = {
      ...results[0],
      score: safelyParseJSON(results[0].score),
    };

    res.json({ result });
  } catch (error) {
    console.error("Error fetching test result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
