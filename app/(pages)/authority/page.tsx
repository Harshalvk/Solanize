"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation } from "@tanstack/react-query";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { Loader } from "lucide-react";
import * as SPLToken from "@solana/spl-token";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const TokenAuthorityPage = () => {
  const [tokenMintAddress, setTokenMintAddress] = useState<string | null>(null);
  const [recipiantAddress, setRecipiantAddress] = useState<string | null>(null);
  const [tokenMintAmount, setTokenMintAmount] = useState<number | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);

  const { connection } = useConnection();
  const wallet = useWallet();

  const {
    mutate: fetchTokenInfo,
    data: tokenInfo,
    isPending: isTokenInfoLoading,
  } = useMutation({
    mutationFn: async () => {
      if (!tokenMintAddress) return;
      const pubkey = new PublicKey(tokenMintAddress);
      const tokenInfo = await connection.getAccountInfo(pubkey);
      if (!tokenInfo) return;

      const mintData = SPLToken.MintLayout.decode(tokenInfo.data);

      return {
        freezeAuthority: mintData.freezeAuthorityOption
          ? new PublicKey(mintData.freezeAuthority)
          : null,
        mintAuthority: new PublicKey(mintData.mintAuthority),
        decimals: mintData.decimals,
        supply: mintData.supply,
      };
    },
  });

  const { mutate: mintTokens, isPending: isMintingTokenPending } = useMutation({
    mutationFn: async (data): Promise<{ transactionSignature: string }> => {
      if (!tokenMintAddress) {
        throw new Error("Token's mint address not provided.");
      }
      if (!wallet.publicKey) {
        throw new Error("User wallet not connected.");
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const { recipiantAddress, tokenMintAmount } = data;

      const recipiantAddressPubKey = new PublicKey(recipiantAddress);

      const tokenMint = new PublicKey(tokenMintAddress);

      const mintInfo = await SPLToken.getMint(
        connection,
        tokenMint,
        undefined,
        SPLToken.TOKEN_2022_PROGRAM_ID
      );

      const recipiantsAssociatedTokenAccountAddress =
        SPLToken.getAssociatedTokenAddressSync(
          tokenMint,
          recipiantAddressPubKey,
          false,
          SPLToken.TOKEN_2022_PROGRAM_ID,
          SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID
        );

      const ataInfo = await connection.getAccountInfo(
        recipiantsAssociatedTokenAccountAddress
      );

      if (!ataInfo) {
        const createRecipiantsAssociatedTokenAccountIx =
          SPLToken.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            recipiantsAssociatedTokenAccountAddress,
            recipiantAddressPubKey,
            tokenMint,
            SPLToken.TOKEN_2022_PROGRAM_ID,
            SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID
          );

        const mintToIx = SPLToken.createMintToInstruction(
          tokenMint,
          recipiantsAssociatedTokenAccountAddress,
          wallet.publicKey,
          BigInt(Number(tokenMintAmount) * 10 ** mintInfo.decimals),
          [],
          SPLToken.TOKEN_2022_PROGRAM_ID
        );

        const mintBlockhash = await connection.getLatestBlockhash();

        const mintTx = new Transaction({
          feePayer: wallet.publicKey,
          blockhash: mintBlockhash.blockhash,
          lastValidBlockHeight: mintBlockhash.lastValidBlockHeight,
        }).add(createRecipiantsAssociatedTokenAccountIx, mintToIx);

        const mintTxSig = await wallet.sendTransaction(mintTx, connection);

        setTxSig(mintTxSig);
        return { transactionSignature: mintTxSig };
      } else {
        const mintToIx = SPLToken.createMintToInstruction(
          tokenMint,
          recipiantsAssociatedTokenAccountAddress,
          wallet.publicKey,
          BigInt(Number(tokenMintAmount) * 10 ** mintInfo.decimals),
          [],
          SPLToken.TOKEN_2022_PROGRAM_ID
        );

        const mintBlockhash = await connection.getLatestBlockhash();

        const mintTx = new Transaction({
          feePayer: wallet.publicKey,
          blockhash: mintBlockhash.blockhash,
          lastValidBlockHeight: mintBlockhash.lastValidBlockHeight,
        }).add(mintToIx);

        const mintTxSig = await wallet.sendTransaction(mintTx, connection);

        setTxSig(mintTxSig);
        return { transactionSignature: mintTxSig };
      }
    },
    onMutate: () => {
      toast.loading("Minting new tokens...", { id: "mint-token" });
    },
    onSuccess: () => {
      toast.success("Token minted successfully!", { id: "mint-token" });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="w-full bg-zinc-800/50 p-3 rounded-md">
      <Label htmlFor="mint-address">Token Mint Address</Label>
      <div>
        <div className="flex gap-3 items-center">
          <Input
            disabled={isTokenInfoLoading || isMintingTokenPending}
            onChange={(e) => {
              setTokenMintAddress(e.target.value);
            }}
            name="mint-address"
            placeholder="Enter mint address"
          />
          <Button
            onClick={() => {
              if (tokenMintAddress?.length === 0 || tokenMintAddress === "") {
                return;
              }
              fetchTokenInfo();
            }}
            variant={"secondary"}
            size={"sm"}
            disabled={isTokenInfoLoading || isMintingTokenPending}
          >
            {isTokenInfoLoading ? <Loader className="animate-spin" /> : null}
            Fetch Info
          </Button>
        </div>
        {isTokenInfoLoading ? (
          <Skeleton className="w-full h-28 mt-4" />
        ) : tokenInfo ? (
          <div className="w-full bg-zinc-800/60 p-4 mt-4 rounded-md md:flex gap-4 space-y-3 md:space-y-0">
            <div className="space-y-3">
              <div>
                <p className="leading-3">Mint Authority</p>
                <span className="text-muted-foreground text-sm">
                  {tokenInfo?.mintAuthority.toBase58()}
                </span>
              </div>
              <div>
                <p className="leading-3">Supply</p>
                <span className="text-muted-foreground text-sm">
                  {Number(tokenInfo?.supply) / LAMPORTS_PER_SOL}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="leading-3">Freeze Authroity</p>
                <span className="text-muted-foreground text-sm">
                  {tokenInfo?.freezeAuthority?.toBase58()}
                </span>
              </div>
              <div>
                <p className="leading-3">Decimals</p>
                <span className="text-muted-foreground text-sm">
                  {tokenInfo?.decimals}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 mt-8">
        <h1>Mint Tokens</h1>
        <Label>Recipiants Address</Label>
        <Input
          placeholder="Enter recipiants address"
          onChange={(e) => setRecipiantAddress(e.target.value)}
          disabled={isMintingTokenPending}
        />
        <Label>
          Amount
          <span className="text-xs text-muted-foreground ml-1">
            (1 = 1 full token based on decimals)
          </span>
        </Label>
        <Input
          placeholder="Enter amount"
          type="number"
          onChange={(e) => setTokenMintAmount(Number(e.target.value))}
          disabled={isMintingTokenPending}
        />
        <Button
          onClick={() => {
            if (
              recipiantAddress &&
              tokenMintAmount &&
              !isNaN(Number(tokenMintAmount))
            ) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-expect-error
              mintTokens({ recipiantAddress, tokenMintAmount });
            }
          }}
          className="mt-2"
          disabled={isMintingTokenPending}
        >
          {isMintingTokenPending && <Loader className="h-3 w-3 animate-spin" />}
          Mint Tokens
        </Button>
      </div>
      {txSig && (
        <div className="bg-green-700 mt-5 p-2 rounded-md">
          <p>
            Signature:{" "}
            <span
              onClick={() => {
                navigator.clipboard.writeText(txSig);
              }}
            >
              {txSig}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TokenAuthorityPage;
