"use client";

import { CircleEqual, Hand } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletConnect from "./WalletConnect";

const routes = [
  {
    href: "launchpad",
    label: "Token Launchpad",
    icon: Hand,
  },
  {
    href: "overview",
    label: "Token overview",
    icon: CircleEqual,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden relative min-w-[220px] max-w-[220px] h-full overflow-hidden w-full bg-muted-foreground/10 dark:text-foreground text-muted-foreground border-r border-separate md:flex flex-col justify-between py-3 px-1">
      <div className="text-sm space-y-2">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={`flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-muted transition ${
              pathname.includes(route.href)
                ? "dark:bg-zinc-900 bg-zinc-100 border"
                : ""
            }`}
          >
            <route.icon size={14} />
            {route.label}
          </Link>
        ))}
      </div>
      <WalletConnect />
    </div>
  );
}
