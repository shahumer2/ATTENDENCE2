import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import pay from "../../assets/img/pay.png";
import { PiDotsNineBold } from "react-icons/pi";
import { BsBuildings, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle, AiOutlinePoweroff } from "react-icons/ai";

function Header() {

  const navigate = useNavigate(); 
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const userDropdownTimeoutRef = useRef(null);
  const masterDropdownTimeoutRef = useRef(null);
  const employeeDropdownTimeoutRef = useRef(null);

  // Clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (userDropdownTimeoutRef.current) {
        clearTimeout(userDropdownTimeoutRef.current);
      }
      if (employeeDropdownTimeoutRef.current) {
        clearTimeout(employeeDropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleUserMouseEnter = () => {
    if (userDropdownTimeoutRef.current) {
      clearTimeout(userDropdownTimeoutRef.current);
    }
    setUserDropdownOpen(true);
  };

  const handleUserMouseLeave = () => {
    userDropdownTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  //master
  const handleMasterMouseEnter = () => {
    if (masterDropdownTimeoutRef.current) {
      clearTimeout(masterDropdownTimeoutRef.current);
    }
    setMasterDropdownOpen(true);
  };

  const handleMasterMouseLeave = () => {
    masterDropdownTimeoutRef.current = setTimeout(() => {
      setMasterDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  const handleEmployeeMouseEnter = () => {
    if (employeeDropdownTimeoutRef.current) {
      clearTimeout(employeeDropdownTimeoutRef.current);
    }
    setEmployeeDropdownOpen(true);
  };

  const handleEmployeeMouseLeave = () => {
    employeeDropdownTimeoutRef.current = setTimeout(() => {
      setEmployeeDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  return (
    <nav className="bg-[#0e2288] p-3 h-[90px]">
      <div className="flex flex-col items-start w-full">
        {/* Top Row: Logo + Title + Icons */}
        <div className="flex items-center mb-2 w-full">
          <NavLink to="/">
            <img src={pay} alt="Logo" className="w-[39px] h-[39px] rounded-full" />
          </NavLink>

          <span className="ml-3 text-[#FFD700] text-2xl font-semibold">PAYROLL</span>

          {/* Right Icons */}
          <div className="ml-auto flex items-center">
            <PiDotsNineBold className="text-white text-2xl ml-4 cursor-pointer" />
            <BsBuildings className="text-white text-2xl ml-4 cursor-pointer" />
            <IoNotificationsOutline className="text-white text-2xl ml-4 cursor-pointer" />
            <AiOutlineQuestionCircle className="text-white text-2xl ml-4 cursor-pointer" />
            <AiOutlinePoweroff
  onClick={() => navigate("/login")}
  className="text-white text-2xl ml-4 cursor-pointer"
/>

          </div>
        </div>

        {/* Bottom Row: Navigation Links */}
        <div className="flex space-x-6 relative">
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
{/* master */}

          <div
            className="relative group"
            onMouseEnter={handleMasterMouseEnter}
            onMouseLeave={handleMasterMouseLeave}
          >
            <div className="flex items-center text-sm font-bold cursor-pointer transition 
              group-hover:text-[#FFD700] 
              text-slate-300 
              hover:text-[#FFD700]"
            >
              Master
              {masterDropdownOpen ? (
                <BsChevronUp className="ml-1" />
              ) : (
                <BsChevronDown className="ml-1" />
              )}
            </div>

            {/* Dropdown content */}
            {masterDropdownOpen && (
              <div
                className="absolute left-0 mt-1 w-48 bg-[#0e2288] border border-[#FFD700] rounded-md shadow-lg z-50"
                onMouseEnter={handleMasterMouseEnter}
                onMouseLeave={handleMasterMouseLeave}
              >
                <NavLink
                 to="/admin/department"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${
                      isActive
                        ? "bg-[#FFD700] text-[#0e2288] font-bold"
                        : "text-slate-300 hover:bg-[#1a3188] hover:text-[#FFD700]"
                    }`
                  }
                >
                 Designation
                </NavLink>
                {/* <NavLink
                  to="/admin/designation"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${
                      isActive
                        ? "bg-[#FFD700] text-[#0e2288] font-bold"
                        : "text-slate-300 hover:bg-[#1a3188] hover:text-[#FFD700]"
                    }`
                  }
                >
                  View Users
                </NavLink> */}
              </div>
            )}
          </div>

          {/* <NavLink
            to="/admin/department"
            className={({ isActive }) =>
              isActive
                ? "text-[#FFD700] text-sm font-bold transition"
                : "text-slate-300 text-sm font-bold hover:text-[#FFD700] transition"
            }
          >
            Department
          </NavLink> */}

          {/* USER DROPDOWN */}
          <div
            className="relative group"
            onMouseEnter={handleUserMouseEnter}
            onMouseLeave={handleUserMouseLeave}
          >
            <div className="flex items-center text-sm font-bold cursor-pointer transition 
              group-hover:text-[#FFD700] 
              text-slate-300 
              hover:text-[#FFD700]"
            >
              Administration
              {userDropdownOpen ? (
                <BsChevronUp className="ml-1" />
              ) : (
                <BsChevronDown className="ml-1" />
              )}
            </div>

            {/* Dropdown content */}
            {userDropdownOpen && (
              <div
                className="absolute left-0 mt-1 w-48 bg-[#0e2288] border border-[#FFD700] rounded-md shadow-lg z-50"
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
              >
                <NavLink
                  to="/admin/user/add"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${
                      isActive
                        ? "bg-[#FFD700] text-[#0e2288] font-bold"
                        : "text-slate-300 hover:bg-[#1a3188] hover:text-[#FFD700]"
                    }`
                  }
                >
                  Add User
                </NavLink>
                <NavLink
                  to="/admin/user/view"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${
                      isActive
                        ? "bg-[#FFD700] text-[#0e2288] font-bold"
                        : "text-slate-300 hover:bg-[#1a3188] hover:text-[#FFD700]"
                    }`
                  }
                >
                  View Users
                </NavLink>
              </div>
            )}
          </div>

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

          {/* EMPLOYEE DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={handleEmployeeMouseEnter}
            onMouseLeave={handleEmployeeMouseLeave}
          >
            <button
              className={`flex items-center text-sm font-bold transition ${
                employeeDropdownOpen || window.location.pathname.includes('/admin/employee/add')
                  ? "text-[#FFD700]"
                  : "text-slate-300 hover:text-[#FFD700]"
              }`}
            >
              Employee
              {employeeDropdownOpen ? (
                <BsChevronUp className="ml-1" />
              ) : (
                <BsChevronDown className="ml-1" />
              )}
            </button>
            {employeeDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-48 bg-[#0e2288] border border-[#FFD700] rounded-md shadow-lg z-10"
                onMouseEnter={handleEmployeeMouseEnter}
                onMouseLeave={handleEmployeeMouseLeave}
              >
                <NavLink
                  to="/admin/employee/add"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${
                      isActive
                        ? "bg-[#FFD700] text-[#0e2288] font-bold"
                        : "text-slate-300 hover:bg-[#1a3188] hover:text-[#FFD700]"
                    }`
                  }
                >
                  Add Employee
                </NavLink>
                <NavLink
                  to="/admin/employee/view"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${
                      isActive
                        ? "bg-[#FFD700] text-[#0e2288] font-bold"
                        : "text-slate-300 hover:bg-[#1a3188] hover:text-[#FFD700]"
                    }`
                  }
                >
                  View Employees
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;