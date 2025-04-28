import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoBagCheck } from "react-icons/io5";
import { FaClipboardList } from "react-icons/fa";


const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen bg-gradient-to-b from-black via-gray-900 to-white shadow-lg border-r border-gray-800">
      <div className="flex flex-col gap-4 pt-8 pl-[10%] text-[15px]">
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 w-56 px-4 py-2 rounded-lg transition-all duration-150
            ${isActive
              ? "bg-gray-700 border-l-4 border-white text-white shadow"
              : "bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white"}`
          }
          to={"/add"}
        >
          <IoIosAddCircleOutline className="w-6 h-6 text-white"  alt="Add Items" />
          <p className="hidden text-lg font-semibold md:block">Add Items</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 w-56 px-4 py-2 rounded-lg transition-all duration-150
            ${isActive
              ? "bg-gray-700 border-l-4 border-white text-white shadow"
              : "bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white"}`
          }
          to={"/list"}
        >
          <FaClipboardList className="w-6 h-6 text-white" alt="Add Products" />          
          <p className="hidden text-lg font-semibold md:block">List Items</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 w-56 px-3 py-2 rounded-lg transition-all duration-150
            ${isActive
              ? "bg-gray-700 border-l-4 border-white text-white shadow"
              : "bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white"}`
          }
          to={"/orders"}
        >
          <IoBagCheck className="w-6 h-6 text-white" alt="List Items" />
          <p className="hidden text-lg font-semibold md:block">View Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
