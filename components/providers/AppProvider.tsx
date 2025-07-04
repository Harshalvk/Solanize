"use client";

import { ReactNode, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import WalletContextProvider from "@/app/(pages)/launchpad/_components/Wallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../ui/sonner";

export function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute={"class"}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <WalletContextProvider>{children}</WalletContextProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
