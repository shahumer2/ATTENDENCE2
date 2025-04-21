import React from "react";
import reactlogo from "../../assets/img/reactlogo.png";

function Header() {
  return (
    <nav className="bg-[#0e2288] p-4">
      <div className="container mx-auto flex flex-col items-start">
        {/* Top Row: Logo + Title */}
        <div className="flex items-center mb-3">
          <a href="#" onClick={(e) => e.preventDefault()}>
            <img src={reactlogo} alt="Logo" className="w-[70px] h-auto" />
          </a>
          <span className="ml-3 text-[#FFD700] text-xl font-semibold">
            PAYROLL
          </span>
        </div>

        {/* Bottom Row: Navigation Links */}
        <div className="flex space-x-8">
          {["Home", "Department", "User", "Company"].map((item, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-white text-lg font-medium hover:text-[#FFD700] transition"
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
