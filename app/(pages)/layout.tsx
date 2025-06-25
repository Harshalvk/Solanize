import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <div className="p-4 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
