"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ConfirmedSignatureInfo } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState<ConfirmedSignatureInfo[]>(
    []
  );
  const { connection } = useConnection();
  const wallet = useWallet();

  const getClusterName = (
    endpoint: string
  ): "devnet" | "testnet" | "mainnet-beta" | "unknown" => {
    if (endpoint.includes("devnet")) return "devnet";
    if (endpoint.includes("testnet")) return "testnet";
    if (endpoint.includes("mainnet")) return "mainnet-beta";
    return "unknown";
  };
  const cluster = getClusterName(connection.rpcEndpoint);

  useEffect(() => {
    (async () => {
      if (!wallet.publicKey) return;

      const txs = await connection.getSignaturesForAddress(wallet.publicKey);

      if (!txs) return;

      setTransactions(txs);
    })();
  }, [wallet.publicKey, connection]);

  return (
    <div className="w-full overflow-x-hidden border p-3 rounded-lg bg-muted-foreground/10 space-y-4">
      <h1 className="font-semibold tracking-tight mb-4">Transaction History</h1>
      {transactions.map((tx, index) => (
        <div
          key={index}
          className="p-2 rounded-lg flex items-center justify-between bg-muted-foreground/20 shadow-sm hover:shadow-md transition-shadow"
        >
          <div>
            <p className="leading-4 text-sm">
              {tx.blockTime &&
                format(new Date(tx.blockTime * 1000), "do MMMM yyyy, h:mm a")}
            </p>
            <p
              className="text-xs text-muted-foreground cursor-pointer hover:text-muted-foreground/60"
              onClick={() => {
                navigator.clipboard.writeText(tx.signature);
              }}
            >
              {tx.signature}
            </p>
            <Link
              target="_blank"
              href={`https://explorer.solana.com/tx/${tx.signature}?cluster=${cluster}`}
              className="text-xs text-yellow-700 underline underline-offset-2"
            >
              View on Explorer
            </Link>
          </div>
          <p className="bg-green-700 rounded-full py-0.5 px-1 text-xs text-white">
            {tx.confirmationStatus}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistoryPage;
