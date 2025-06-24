import React from "react";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  return (
    <div className="h-10 w-full border-b flex items-center justify-between">
      <h1 className="w-[220px] h-full border-r flex items-center justify-center text-2xl font-bold">
        Solanize
      </h1>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
