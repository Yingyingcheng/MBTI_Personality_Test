import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser, token, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Fetch user's test results
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/personality/results", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch test results");
        }

        const data = await response.json();
        setResults(data.results);
      } catch (err) {
        setError(
          err.message || "An error occurred while fetching your results",
        );
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [currentUser, token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome, {currentUser?.username}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <Link
              to="/test"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Take New Test
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">
            Your Test Results
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading your results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-600 mb-4">
                You haven't taken any personality tests yet.
              </p>
              <Link
                to="/test"
                className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700"
              >
                Take Your First Test
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Result</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((result) => {
                    const resultScore =
                      typeof result.score === "string"
                        ? JSON.parse(result.score)
                        : result.score;

                    return (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {getFormattedDate(result.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-purple-700 text-lg">
                            {result.result_type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            to={`/results/${result.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
