"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";

type Props = {
  children: React.ReactNode;
};

const WalletContextProvider = ({ children }: Props) => {
  const network = WalletAdapterNetwork.Devnet;

  //initial auto connect
  const { autoConnect } = useWallet();

  //you can also provide a custom RPC endpoint
  const endPoint = useMemo(() => clusterApiUrl(network), [network]);

  //wallets
  const wallets = useMemo(() => {
    new PhantomWalletAdapter();
  }, [network]);

  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
