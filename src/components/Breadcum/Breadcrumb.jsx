import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

const Breadcrumb = ({ items }) => {
  // items will be string with commas → convert to array
  const crumbs = typeof items === "string" ? items.split(",") : items;

  return (
    <nav className="flex items-center text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={index} className="flex items-center">
            {index > 0 && <MdKeyboardArrowRight className="mx-1 text-gray-500" />}
            {isLast ? (
              <span className="capitalize font-semibold text-[#242424]">{crumb.trim()}</span>
            ) : (
              <span className="capitalize hover:text-blue-600">{crumb.trim()}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
