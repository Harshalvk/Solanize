import AppSidebar from "@/components/AppSidebar";
import React from "react";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-screen">{children}</div>
    </div>
  );
}
