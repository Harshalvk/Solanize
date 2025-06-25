"use client";

import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import * as SPLToken from "@solana/spl-token";

type MyTokenType = {
  tokenAddress: PublicKey;
  mintAddress: PublicKey;
  lamports: bigint;
};

const MyTokenPage = () => {
  const [myTokens, setMyTokens] = useState<MyTokenType[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { connection } = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    (async () => {
      if (!wallet.publicKey) {
        setMyTokens([]);
        return;
      }

      const tokens = await connection.getTokenAccountsByOwner(
        wallet.publicKey,
        {
          programId: TOKEN_2022_PROGRAM_ID,
        }
      );

      const uniqueAddress = new Set();
      const parsedTokens = [];

      for (const token of tokens.value) {
        const accountInfo = SPLToken.AccountLayout.decode(token.account.data);
        const tokenAddress = token.pubkey;

        if (!uniqueAddress.has(tokenAddress)) {
          uniqueAddress.add(tokenAddress);
          parsedTokens.push({
            tokenAddress,
            mintAddress: accountInfo.mint,
            lamports: accountInfo.amount,
          });
        }
      }

      setMyTokens(parsedTokens);
    })();
  }, [wallet.publicKey, connection]);

  return (
    <div className="w-full space-y-3">
      {myTokens.map((token, index) => (
        <div
          key={index}
          className="border p-2 rounded-lg flex justify-between bg-muted-foreground/5 shadow-sm hover:shadow-md transition-all"
        >
          <div>
            <h1 className="tracking-tight">Token Account</h1>
            <span
              onClick={() => {
                const key = token.tokenAddress.toBase58();
                navigator.clipboard.writeText(key);
                setCopiedKey(key);
                setTimeout(() => setCopiedKey(null), 2000);
              }}
              className="text-sm text-muted-foreground cursor-pointer flex items-center"
            >
              {token.tokenAddress.toBase58()}
              {copiedKey === token.tokenAddress.toBase58() && (
                <p className="ml-2 bg-green-700 text-xs py-0.5 px-1 rounded-lg pointer-events-none text-white">
                  Copied
                </p>
              )}
            </span>
          </div>
          <div>
            <h1>Balance</h1>
            <span className="text-sm text-muted-foreground">
              {Number(token.lamports) / LAMPORTS_PER_SOL}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTokenPage;
