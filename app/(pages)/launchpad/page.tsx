"use client";

import React, { useEffect, useState } from "react";
import TokenLaunchpadForm from "./_components/form/TokenLaunchpadForm";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Info } from "lucide-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const LaunchPadPage = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [successDetails, setSuccessDetails] = useState<Record<
    string,
    string
  > | null>(null);
  const [userSOLBalance, setUserSOLBalance] = useState(0);

  const formatKey = (key: string) =>
    key
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

  useEffect(() => {
    if (wallet.publicKey) {
      const SOL = connection.getAccountInfo(wallet.publicKey);
      SOL.then((res) => {
        if (res?.lamports) {
          setUserSOLBalance(res?.lamports / LAMPORTS_PER_SOL);
        }
      });
    }
  }, [connection, wallet.publicKey]);

  return (
    <div className="">
      <div className="min-w-96 p-4 flex flex-col items-center justify-center border rounded-md bg-muted-foreground/10 gap-6">
        <div className="bg-muted-foreground/10 w-full p-2 border rounded-md flex items-center justify-between">
          <div className="flex gap-2">
            <Info size={15} />
            <div>
              <h2 className="text-sm font-bold">Creation Fee</h2>
              <p className="text-xs text-muted-foreground font-semibold">
                A fee of 0.05 SOL will be charged to create your token.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold">Your Balance</h2>
            <h2 className="text-xs text-muted-foreground font-semibold">
              {userSOLBalance}
            </h2>
          </div>
        </div>
        <div className="w-full h-full">
          <TokenLaunchpadForm
            connection={connection}
            wallet={wallet}
            successDetails={successDetails}
            setSuccessDetails={setSuccessDetails}
          />
        </div>
      </div>
      {successDetails ? (
        <div className="w-full bg-muted-foreground/10 mt-2 rounded-lg border border-white/5 p-4">
          {Object.entries(successDetails).map(([key, value]) => (
            <div key={key} className="text-sm">
              {formatKey(key)}:{" "}
              <span className="text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default LaunchPadPage;
