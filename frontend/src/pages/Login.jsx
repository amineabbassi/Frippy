import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // User is already logged in, redirect to home
      navigate("/");
    }
  }, [navigate]);

  // Close modal after 3 seconds
  useEffect(() => {
    let timer;
    if (showModal) {
      timer = setTimeout(() => {
        setShowModal(false);
        if (localStorage.getItem("token")) {
          navigate("/");
        }
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showModal, navigate]);

  // Handle form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const endpoint =
      currentState === "Login"
        ? "http://localhost:4000/api/user/login"
        : "http://localhost:4000/api/user/register";

    const payload =
      currentState === "Login"
        ? { email, password }
        : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Something went wrong.");
      } else {
        setError("");
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userEmail", email); // Store email for username display
          setModalMessage(`Welcome back, ${email.split('@')[0]}!`);
          setShowModal(true);
          // navigate will happen after modal closes via useEffect
        } else {
          // Registration successful, but no token returned
          setModalMessage(`Account created successfully!`);
          setShowModal(true);
          setCurrentState("Login");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Modal component
  const ConfirmationModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
        <div className="bg-white rounded-lg shadow-xl p-6 transform transition-all duration-500 ease-in-out scale-100 opacity-100 w-80">
          <div className="flex flex-col items-center">
            {/* Success animation */}
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h3 className="text-xl font-medium text-gray-900 mb-2">Success!</h3>
            <p className="text-center text-gray-600">{modalMessage}</p>
            
            {/* Progress bar */}
            <div className="w-full h-1 bg-gray-200 rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-green-500 animate-progressBar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showModal && <ConfirmationModal />}
      
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mt-10 mb-2">
          <p className="text-3xl prata-regular">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {currentState === "Login" ? (
          ""
        ) : (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-800 rounded transition duration-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            placeholder="Your Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        )}
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-800 rounded transition duration-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          placeholder="hello@gmail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-800 rounded transition duration-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-between w-full text-sm mt-[-8px]">
          <p className="cursor-pointer hover:text-gray-600 transition duration-300">Forgot your password?</p>
          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign Up")}
              className="cursor-pointer hover:text-gray-600 transition duration-300"
            >
              Create a new account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer hover:text-gray-600 transition duration-300"
            >
              Login here
            </p>
          )}
        </div>
        <button
          className={`px-8 py-2 mt-4 font-light text-white bg-black rounded hover:bg-gray-800 transition duration-300 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={loading}
        >
          {loading
            ? currentState === "Login"
              ? "Signing in..."
              : "Signing up..."
            : currentState === "Login"
            ? "Sign In"
            : "Sign Up"}
        </button>
      </form>
      
      {/* Add this style for the progress bar animation */}
      <style jsx>{`
        @keyframes progressAnimation {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .animate-progressBar {
          animation: progressAnimation 3s linear;
        }
      `}</style>
    </>
  );
};

export default Login;