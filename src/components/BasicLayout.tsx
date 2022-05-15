import React from "react";
import LeftBar from "./main/LeftBar";
import { NavigationProvider } from "./NavigationContext";
import RightBar from "./RightBar";

function BasicLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center">
      <NavigationProvider>
        <LeftBar />
        {children}
      </NavigationProvider>
      <RightBar />
    </div>
  );
}

export default BasicLayout;
