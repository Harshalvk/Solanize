"use client";

import React from "react";
import TokenLaunchpadForm from "./_components/form/TokenLaunchpadForm";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

type Props = {};

const page = (props: Props) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return (
    <div className="min-w-96 h-screen flex flex-col items-center justify-center">
      <div>
        <h1 className="text-7xl font-semibold tracking-tighter text-center bg-gradient-to-t from-zinc-400 to-white bg-clip-text text-transparent mb-6">
          Token Launchpad
        </h1>
      </div>
      <div className="w-2/3">
        <TokenLaunchpadForm connection={connection} wallet={wallet} />
      </div>
    </div>
  );
};

export default page;
