import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResultDetail() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchResultDetail = async () => {
      try {
        const response = await fetch(`/api/personality/results/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Test result not found"
              : "Failed to load test result",
          );
        }

        const data = await response.json();
        setResult(data.result);
      } catch (err) {
        setError(err.message || "An error occurred while fetching this result");
        console.error("Error fetching result:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResultDetail();
  }, [id, token, currentUser, navigate]);

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

  const getPersonalityDescription = (type) => {
    const descriptions = {
      INTJ: 'Strategic, independent, and insightful. Known as "The Architect" or "The Mastermind."',
      INTP: 'Logical, curious, and innovative. Known as "The Thinker" or "The Logician."',
      ENTJ: 'Decisive, efficient, and strategic leader. Known as "The Commander."',
      ENTP: 'Innovative, adaptable, and enthusiastic. Known as "The Debater" or "The Visionary."',
      INFJ: 'Insightful, principled, and compassionate. Known as "The Advocate" or "The Counselor."',
      INFP: 'Idealistic, creative, and empathetic. Known as "The Mediator" or "The Healer."',
      ENFJ: 'Charismatic, inspiring, and empathetic leader. Known as "The Protagonist" or "The Giver."',
      ENFP: 'Enthusiastic, creative, and sociable. Known as "The Campaigner" or "The Champion."',
      ISTJ: 'Practical, responsible, and detail-oriented. Known as "The Inspector" or "The Logistician."',
      ISFJ: 'Dedicated, warm, and conscientious. Known as "The Protector" or "The Defender."',
      ESTJ: 'Practical, traditional, and organized. Known as "The Supervisor" or "The Executive."',
      ESFJ: 'Caring, social, and organized. Known as "The Provider" or "The Consul."',
      ISTP: 'Adaptable, practical, and action-oriented. Known as "The Craftsman" or "The Virtuoso."',
      ISFP: 'Gentle, artistic, and adaptable. Known as "The Artist" or "The Adventurer."',
      ESTP: 'Energetic, spontaneous, and practical. Known as "The Doer" or "The Entrepreneur."',
      ESFP: 'Enthusiastic, spontaneous, and friendly. Known as "The Performer."',
    };

    return (
      descriptions[type] ||
      "Your personality type combines several traits that make you unique."
    );
  };

  const getTypeCharacteristics = (type) => {
    if (!type || type.length !== 4) return [];

    const characteristics = {
      E: "Extraversion: You gain energy from external interaction and engagement with others.",
      I: "Introversion: You gain energy from internal reflection and value depth over breadth in relationships.",
      S: "Sensing: You focus on concrete facts and details, trusting information that's practical and experiential.",
      N: "Intuition: You focus on patterns, possibilities, and the big picture, looking toward the future.",
      T: "Thinking: You make decisions based on logic, consistency, and objective analysis.",
      F: "Feeling: You make decisions based on values, harmony, and how actions affect others.",
      J: "Judging: You prefer structure, plans, and closure in your external life.",
      P: "Perceiving: You prefer flexibility, adaptability, and keeping options open.",
    };

    return [...type].map((letter) => ({
      letter,
      description: characteristics[letter],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading result details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-800 mb-6">Error</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
            <Link
              to="/dashboard"
              className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-800 mb-6">
              Result Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The test result you're looking for doesn't seem to exist.
            </p>
            <Link
              to="/dashboard"
              className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract scores from the result
  const scores =
    typeof result.score === "string" ? JSON.parse(result.score) : result.score;

  return (
    <div className="bg-gradient-to-b from-purple-100 to-blue-100 py-12 px-4 min-h-screen w-full overflow-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 mb-1">
              Personality Result
            </h1>
            <p className="text-gray-600">
              Taken on {getFormattedDate(result.created_at)}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="mt-4 sm:mt-0 text-purple-600 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Result Type and Description */}
        <div className="text-center mb-10">
          <div className="bg-purple-50 inline-block px-6 py-3 rounded-lg shadow-sm">
            <span className="text-6xl font-bold text-purple-800">
              {result.result_type}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">
            {result.result_type.split("").join("-")} Personality
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            {getPersonalityDescription(result.result_type)}
          </p>
        </div>

        {/* Type breakdown */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            Your Type Breakdown
          </h2>
          <div className="space-y-4">
            {getTypeCharacteristics(result.result_type).map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="text-xl font-bold text-purple-700 w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full mr-3">
                    {item.letter}
                  </span>
                  <span className="text-gray-800">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dimension Score Visualization */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            Dimension Scores
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                Extraversion (E) vs. Introversion (I)
              </h3>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${
                      (scores.EI.E / (scores.EI.E + scores.EI.I)) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>E: {scores.EI.E}</span>
                <span>I: {scores.EI.I}</span>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                Sensing (S) vs. Intuition (N)
              </h3>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${
                      (scores.SN.S / (scores.SN.S + scores.SN.N)) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>S: {scores.SN.S}</span>
                <span>N: {scores.SN.N}</span>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                Thinking (T) vs. Feeling (F)
              </h3>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{
                    width: `${
                      (scores.TF.T / (scores.TF.T + scores.TF.F)) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>T: {scores.TF.T}</span>
                <span>F: {scores.TF.F}</span>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                Judging (J) vs. Perceiving (P)
              </h3>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${
                      (scores.JP.J / (scores.JP.J + scores.JP.P)) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>J: {scores.JP.J}</span>
                <span>P: {scores.JP.P}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/dashboard"
            className="bg-purple-600 text-white text-center font-semibold py-2 px-6 rounded-lg hover:bg-purple-700"
          >
            Back to Dashboard
          </Link>
          <Link
            to="/test"
            className="bg-blue-600 text-white text-center font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Take New Test
          </Link>
        </div>
      </div>
    </div>
  );
}
