import React from "react";
import { NavLink } from "react-router-dom";
import pay from "../../assets/img/pay.png";
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
          {/* <NavLink to="/">
            <img src={pay} alt="Logo" className="w-[39px] h-auto" />
          </NavLink> */}
          <NavLink to="/">
               <img src={pay} alt="Logo" className="w-[39px] h-[39px] rounded-full" />
           </NavLink>

          <span className="ml-3 text-[#FFD700] text-2xl font-semibold">
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
          {/* <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-[#FFD700] text-sm font-bold transition"
                : "text-slate-300 text-sm font-bold hover:text-[#FFD700] transition"
            }
          >
            Home
          </NavLink> */}

<NavLink
  to="/admin/dashboard"
  end
  className={({ isActive }) =>
    isActive
      ? "text-[#FFD700] text-sm font-bold transition"
      : "text-slate-300 text-sm font-bold hover:text-[#FFD700] transition"
  }
>
  Home
</NavLink>


          <NavLink
            to="/admin/department"
            className={({ isActive }) =>
              isActive
                ? "text-[#FFD700] text-sm font-bold transition"
                : "text-slate-300 text-sm font-bold hover:text-[#FFD700] transition"
            }
          >
            Department
          </NavLink>

          <NavLink
            to="/admin/user"
            className={({ isActive }) =>
              isActive
                ? "text-[#FFD700] text-sm font-bold transition"
                : "text-slate-300 text-sm font-bold hover:text-[#FFD700] transition"
            }
          >
            User
          </NavLink>

          <NavLink
            to="/admin/company"
            className={({ isActive }) =>
              isActive
                ? "text-[#FFD700] text-sm font-bold transition"
                : "text-slate-300 text-sm font-bold hover:text-[#FFD700] transition"
            }
          >
            Company
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Header;
