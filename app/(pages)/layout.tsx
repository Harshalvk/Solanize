import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <div className="flex-1 m-4 rounded-md">{children}</div>
      </div>
    </div>
  );
}
