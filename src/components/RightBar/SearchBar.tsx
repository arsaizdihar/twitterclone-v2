import React, { useState } from "react";

const SearchBar = () => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <form
      className={`flex items-center rounded-full py-2 px-4 group border ${
        isFocus
          ? "bg-white dark:bg-black text-blue-500 border-blue-500"
          : "bg-gray-100 dark:bg-gray_dark text-trueGray-500 border-transparent"
      }`}
    >
      <div className="inline-flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        className="outline-none bg-transparent ml-4 text-gray-600 dark:text-gray-200"
        placeholder="Search Twitter"
      />
    </form>
  );
};

export default SearchBar;
