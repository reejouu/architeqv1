import React from "react";

const dashedArrow = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12h3m3 0h3m4 0h7" />
        <path d="M14 20l8 -8" />
        <path d="M14 4l8 8" />
      </svg>
    </div>
  );
};

export default dashedArrow;
