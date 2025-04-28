import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard"; // Import the new Dashboard page
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Utility functions for token management
const getToken = () => localStorage.getItem("token") || "";
const setToken = (token) => localStorage.setItem("token", token);

// Backend URL and currency formatter
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = (price) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

// Routes configuration
const routes = [
  { path: "/", component: Dashboard }, // Default route to Dashboard
  { path: "/add", component: Add },
  { path: "/list", component: List },
  { path: "/orders", component: Orders },
];

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-center text-red-500">Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const App = () => {
  const [token, setTokenState] = useState(getToken());

  useEffect(() => {
    setToken(token);
  }, [token]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {token === "" ? (
          <Login setToken={setTokenState} />
        ) : (
          <>
            <Navbar setToken={setTokenState} />
            <hr />
            <div className="flex w-full">
              <Sidebar />
              <div className="flex-1 mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                <Routes>
                  {routes.map(({ path, component: Component }) => (
                    <Route key={path} path={path} element={<Component token={token} />} />
                  ))}
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
