import React from "react";

const Tooltip = ({ content }) => {
  return (
    <div className="relative flex items-center justify-center w-4 h-4 ml-2">
      <span className="text-yellow-500 text-xs cursor-pointer group inline-flex items-center justify-center">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: "gold",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          i
        </span>

        {/* Tooltip Box */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 ml-9 bg-yellow-100 text-black text-sm px-4 py-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-normal text-left pointer-events-none">
          {content}
        </div>
      </span>
    </div>
  );
};

export default Tooltip;
