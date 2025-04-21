import React from "react";
import { useLocation } from "react-router-dom";
import reactlogo from "../../assets/img/reactlogo.png";
import { PiDotsNineBold } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle, AiOutlinePoweroff } from "react-icons/ai";
import routes from "routes.js";

function Header() {
  return (
    <nav className="bg-[#0e2288] p-3 h-[90px]">
      {/* Removed container mx-auto */}
      <div className="flex flex-col items-start w-full">
        {/* Top Row: Logo + Title + Icons */}
        <div className="flex items-center mb-2 w-full">
          <a href="#" onClick={(e) => e.preventDefault()}>
            <img src={reactlogo} alt="Logo" className="w-[65px] h-auto" />
          </a>
          <span className="ml-3 text-[#FFD700] text-xl font-semibold">
            PAYROLL
          </span>

          {/* Icons aligned to the right */}
          <div className="ml-auto flex items-center">
            <PiDotsNineBold className="text-white text-2xl ml-4 cursor-pointer" />
            <BsBuildings className="text-white text-2xl ml-4 cursor-pointer" />
            <IoNotificationsOutline className="text-white text-2xl ml-4 cursor-pointer" />
            <AiOutlineQuestionCircle className="text-white text-2xl ml-4 cursor-pointer" />
            <AiOutlinePoweroff className="text-white text-2xl ml-4 cursor-pointer" />
          </div>
        </div>

        {/* Bottom Row: Navigation Links */}
        <div className="flex space-x-6">
          {["Home", "Department", "User", "Company"].map((item, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-white text-sm font-medium hover:text-[#FFD700] transition"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Header;
