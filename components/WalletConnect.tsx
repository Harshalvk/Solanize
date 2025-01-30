"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { Wallet } from "lucide-react";

type Props = {};

const WalletConnect = (props: Props) => {
  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect, connecting } = useWallet();

  const [open, setOpen] = useState(false);
  const [userWalletAddress, setUserWalletAddress] = useState("");

  useEffect(() => {
    setUserWalletAddress(publicKey?.toBase58()!);
  }, [publicKey]);

  const handleWalletSelect = (walletName: any) => {
    if (walletName) {
      try {
        select(walletName);
        setOpen(false);
      } catch (error) {
        console.log("wallet connection error: ", error);
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <div>
          {!publicKey ? (
            <DialogTrigger asChild>
              <Button className="w-full">
                <Wallet size={20} />
                {connecting ? "Connection..." : "Connect Wallet"}
              </Button>
            </DialogTrigger>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full">
                  <div className="truncate md:w-[150px] w-[100px]">
                    {publicKey.toBase58()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem>
                  <Button
                    onClick={handleDisconnect}
                    className="w-full"
                    variant={"ghost"}
                  >
                    Disconnect
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DialogContent className="max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Select Wallet</DialogTitle>
              <DialogDescription>
                Below is the list of wallet available in your browser.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.adapter.name}
                  onClick={() => handleWalletSelect(wallet.adapter.name)}
                  variant={"ghost"}
                  className="w-full"
                >
                  <div className="w-full flex items-center">
                    <Image
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      height={30}
                      width={30}
                    />
                    <div className="font-slackey text-white wallet-name text-xl ml-2">
                      {wallet.adapter.name}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default WalletConnect;
