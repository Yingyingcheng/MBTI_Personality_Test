import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return setError("Please fill in all fields");
    }

    try {
      setError("");
      setLoading(true);
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Log In</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Please log in to your account.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 hover:bg-purple-700 disabled:bg-purple-300"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-purple-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
