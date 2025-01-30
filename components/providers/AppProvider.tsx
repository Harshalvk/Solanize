import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import WalletContextProvider from "@/app/(pages)/launchpad/_components/Wallet";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute={"class"}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WalletContextProvider>{children}</WalletContextProvider>
    </ThemeProvider>
  );
}
