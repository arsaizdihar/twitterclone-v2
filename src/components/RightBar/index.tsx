import React from "react";
import SearchBar from "./SearchBar";
import Trends from "./Trends";
import WhoToFollows from "./WhoToFollows";

const RightBar: React.FC = () => {
  return (
    <div className="hidden lg:block p-2 sticky max-h-screen overflow-y-auto right-0 top-0 w-[350px]">
      <SearchBar />
      <Trends />
      <WhoToFollows />
    </div>
  );
};

export default RightBar;
