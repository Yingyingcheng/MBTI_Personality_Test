import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-purple-800 mb-6">
            Discover Your Personality Type
          </h1>
          <p className="text-xl text-gray-700 mb-10">
            Take our scientifically backed personality test to gain insights
            about yourself and understand how you interact with the world around
            you.
          </p>

          <div className="mt-12">
            {currentUser ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-700 mb-4">
                  Welcome back,{" "}
                  <span className="font-semibold">{currentUser.username}</span>!
                </p>
                <Link
                  to="/dashboard"
                  className="inline-block bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-purple-700 mr-4"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/test"
                  className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700"
                >
                  Take the Test
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-gray-700 mb-4">
                  Create an account or log in to take the test and save your
                  results
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-purple-700 mr-4"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">
                Understand Yourself
              </h3>
              <p className="text-gray-600">
                Gain deep insights into your personality traits, strengths, and
                areas for growth.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">
                Save Your Results
              </h3>
              <p className="text-gray-600">
                Create an account to save your test results and track how your
                personality evolves over time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">
                Scientific Approach
              </h3>
              <p className="text-gray-600">
                Our test is based on the Myers-Briggs Type Indicator (MBTI), a
                well-established personality framework.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
