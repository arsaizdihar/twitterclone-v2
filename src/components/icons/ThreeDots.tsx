const ThreeDots = () => {
  return (
    <div className="flex flex-grow justify-end">
      <div className="hover:text-blue-500 text-trueGray-500 rounded-full h-8 w-8 hover:bg-blue-100 dark:hover:bg-trueGray-800 flex justify-center items-center cursor-pointer">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
        >
          <g>
            <circle cx="5" cy="12" r="2"></circle>
            <circle cx="12" cy="12" r="2"></circle>
            <circle cx="19" cy="12" r="2"></circle>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ThreeDots;
