"use client"

import React from "react";
import TokenLaunchpadForm from "./_components/form/TokenLaunchpadForm";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

type Props = {};

const page = (props: Props) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return (
    <div className="translate-y-1/3">
      <div>
        <h1 className="text-5xl font-semibold tracking-tighter text-center bg-gradient-to-t from-zinc-400 to-white bg-clip-text text-transparent">
          Token Launchpad
        </h1>
      </div>
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <TokenLaunchpadForm connection={connection} wallet={wallet} />
      </div>
    </div>
  );
};

export default page;
