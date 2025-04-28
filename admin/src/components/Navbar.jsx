import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import logo from "../assets/logoW.png";

const Navbar = ({ setToken }) => {
  return (
    <div className="top-0 left-0 z-50 w-full bg-gradient-to-r from-black via-gray-900 to-gray-800 border-b border-gray-800 shadow-md backdrop-blur-md">
      <div className="flex items-center py-3 px-[4%] justify-between">
        <Link to={"/"}>
          <img
            className="w-24 transition-all duration-200 hover:underline hover:decoration-2 hover:decoration-gray-400"
            src={logo}
            alt="Frippy"
            style={{ filter: "grayscale(10%) brightness(1.1)" }}
          />
        </Link>
        <button
          onClick={() => setToken("")}
          className="px-8 py-4 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black border border-gray-700 rounded-full shadow hover:bg-gradient-to-l hover:from-black hover:to-gray-800 hover:text-gray-200 transition-all duration-150"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
