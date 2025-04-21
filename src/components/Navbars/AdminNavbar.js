import React from "react";
import { Link } from "react-router-dom";
import reactlogo from "../../assets/img/reactlogo.png";
import { PiDotsNineBold } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle, AiOutlinePoweroff } from "react-icons/ai";

function Header() {
  return (
    <nav className="bg-[#0e2288] p-3 h-[90px]">
      <div className="flex flex-col items-start w-full">
        {/* Top Row: Logo + Title + Icons */}
        <div className="flex items-center mb-2 w-full">
          <Link to="/">
            <img src={reactlogo} alt="Logo" className="w-[65px] h-auto" />
          </Link>
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
          <Link
            to="/"
            className="text-slate-300 text-sm font-medium hover:text-[#FFD700] transition"
          >
            Home
          </Link>
          <Link
            to="/admin/department"
            className="text-slate-300 text-sm font-medium hover:text-[#FFD700] transition"
          >
            Department
          </Link>
          <Link
            to="/admin/user"
            className="text-slate-300 text-sm font-medium hover:text-[#FFD700] transition"
          >
            User
          </Link>
          <Link
            to="/admin/company"
            className="text-slate-300 text-sm font-medium hover:text-[#FFD700] transition"
          >
            Company
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
