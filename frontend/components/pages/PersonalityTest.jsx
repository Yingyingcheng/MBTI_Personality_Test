import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Sample questions for MBTI test
const questions = [
  {
    id: 1,
    question: "At a party, you typically:",
    options: [
      { value: "E", text: "Meet and talk to many people, including strangers" },
      { value: "I", text: "Interact with a few people you already know" },
    ],
    dimension: "EI", // Extraversion (E) vs. Introversion (I)
  },
  {
    id: 2,
    question: "You tend to focus on:",
    options: [
      { value: "S", text: "Details and facts in the present" },
      { value: "N", text: "The big picture and future possibilities" },
    ],
    dimension: "SN", // Sensing (S) vs. Intuition (N)
  },
  {
    id: 3,
    question: "When making decisions, you usually consider:",
    options: [
      { value: "T", text: "Objective principles and logical consequences" },
      {
        value: "F",
        text: "How the decision affects people and their feelings",
      },
    ],
    dimension: "TF", // Thinking (T) vs. Feeling (F)
  },
  {
    id: 4,
    question: "You prefer to:",
    options: [
      { value: "J", text: "Have things settled and decided" },
      { value: "P", text: "Keep options open and flexible" },
    ],
    dimension: "JP", // Judging (J) vs. Perceiving (P)
  },
  {
    id: 5,
    question: "You are more:",
    options: [
      { value: "E", text: "Outgoing and energized by social interaction" },
      { value: "I", text: "Reserved and energized by time alone" },
    ],
    dimension: "EI",
  },
  {
    id: 6,
    question: "You are more interested in:",
    options: [
      { value: "S", text: "What is real and actual" },
      { value: "N", text: "What is possible and theoretical" },
    ],
    dimension: "SN",
  },
  {
    id: 7,
    question: "In evaluating information, you are more likely to:",
    options: [
      { value: "T", text: "Find logical inconsistencies" },
      { value: "F", text: "Consider the impact on people" },
    ],
    dimension: "TF",
  },
  {
    id: 8,
    question: "You prefer to work:",
    options: [
      { value: "J", text: "On a schedule with clear deadlines" },
      { value: "P", text: "In a flexible environment adapting as you go" },
    ],
    dimension: "JP",
  },
  {
    id: 9,
    question: "You prefer to:",
    options: [
      { value: "E", text: "Think out loud and discuss" },
      { value: "I", text: "Think quietly and then share" },
    ],
    dimension: "EI",
  },
  {
    id: 10,
    question: "You are more likely to trust:",
    options: [
      { value: "S", text: "Your direct experiences" },
      { value: "N", text: "Your gut feelings and intuition" },
    ],
    dimension: "SN",
  },
  {
    id: 11,
    question: "Which is more important in a decision:",
    options: [
      { value: "T", text: "Being fair and rational" },
      { value: "F", text: "Being compassionate and understanding" },
    ],
    dimension: "TF",
  },
  {
    id: 12,
    question: "You prefer projects that:",
    options: [
      { value: "J", text: "Follow a clear plan" },
      { value: "P", text: "Evolve as you work on them" },
    ],
    dimension: "JP",
  },
];

export default function PersonalityTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleAnswer = (value) => {
    const updatedAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(updatedAnswers);

    // Move to next question or calculate result if finished
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(updatedAnswers);
    }
  };

  const calculateResult = (answers) => {
    const scores = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    // Count scores for each dimension
    Object.values(answers).forEach((value) => {
      scores[value]++;
    });

    // Determine personality type
    const type = [
      scores.E > scores.I ? "E" : "I",
      scores.S > scores.N ? "S" : "N",
      scores.T > scores.F ? "T" : "F",
      scores.J > scores.P ? "J" : "P",
    ].join("");

    const detailedScores = {
      EI: { E: scores.E, I: scores.I },
      SN: { S: scores.S, N: scores.N },
      TF: { T: scores.T, F: scores.F },
      JP: { J: scores.J, P: scores.P },
    };

    setResult({ type, scores: detailedScores });
    saveResult(type, detailedScores);
  };

  const saveResult = async (type, scores) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const response = await fetch("/api/personality/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          result_type: type,
          score: scores,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save test result");
      }
    } catch (err) {
      setError(err.message || "An error occurred while saving your result");
      console.error("Error saving result:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setError("");
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

  // Show results if test is complete
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">
            Your Personality Type
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error} (Your results are still displayed below)
            </div>
          )}

          <div className="text-center mb-8">
            <span className="text-5xl font-bold text-purple-700">
              {result.type}
            </span>
            <p className="mt-4 text-lg text-gray-700">
              {getPersonalityDescription(result.type)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                Extraversion (E) vs. Introversion (I)
              </h3>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${
                      (result.scores.EI.E /
                        (result.scores.EI.E + result.scores.EI.I)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>E: {result.scores.EI.E}</span>
                <span>I: {result.scores.EI.I}</span>
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
                      (result.scores.SN.S /
                        (result.scores.SN.S + result.scores.SN.N)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>S: {result.scores.SN.S}</span>
                <span>N: {result.scores.SN.N}</span>
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
                      (result.scores.TF.T /
                        (result.scores.TF.T + result.scores.TF.F)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>T: {result.scores.TF.T}</span>
                <span>F: {result.scores.TF.F}</span>
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
                      (result.scores.JP.J /
                        (result.scores.JP.J + result.scores.JP.P)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>J: {result.scores.JP.J}</span>
                <span>P: {result.scores.JP.P}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={resetTest}
              className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700"
            >
              Take Test Again
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show test questions
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-purple-800">
              Personality Test
            </h1>
            <span className="text-gray-600 text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() =>
              currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)
            }
            disabled={currentQuestion === 0}
            className="text-purple-600 hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            Previous Question
          </button>

          <div className="text-sm text-gray-500">
            {Object.keys(answers).length} of {questions.length} answered
          </div>
        </div>
      </div>
    </div>
  );
}
