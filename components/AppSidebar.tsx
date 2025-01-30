"use client";

import { CircleEqual, Hand } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import WalletConnect from "./WalletConnect";

const routes = [
  {
    href: "launchpad",
    label: "Token Launchpad",
    icon: Hand,
  },
  {
    href: "liquidity",
    label: "Liquidity Pool",
    icon: CircleEqual,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];

  return (
    <div className="hidden relative md:block min-w-[220px] max-w-[220px] h-screen overflow-hidden w-full bg-primary/15 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r border-separate lg:flex lg:flex-col lg:justify-between py-3 px-1">
      <div className="flex flex-col gap-1 justify-start">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={buttonVariants({
              variant: activeRoute.href === route.href ? "secondary" : "ghost",
              className: "w-full rounded-md",
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
      <WalletConnect />
    </div>
  );
}
