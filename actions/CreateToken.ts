import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { TokenLauchpadFormSchema } from "@/schema/tokenLaunchpad.schema";
import { z } from "zod";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { uploadMetadata } from "./UploadMetadata";
import { Metadata } from "@/lib/types";

export async function createToken({
  values,
  connection,
  wallet,
}: {
  values: z.infer<typeof TokenLauchpadFormSchema>;
  connection: Connection;
  wallet: WalletContextState;
}) {
  const mintKeypair = Keypair.generate();

  const sMetadata: Metadata = {
    name: values.name,
    symbol: values.symbol,
    description: values.description,
    image: values.image,
  };

  const metadataRes = await uploadMetadata(sMetadata);

  const metadata = {
    mint: mintKeypair.publicKey,
    name: values.name,
    symbol: values.symbol,
    image: values.image,
    uri: metadataRes,
    additionalMetadata: [],
  };

  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen
  );

  const associatedToken = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    wallet.publicKey!,
    false,
    TOKEN_PROGRAM_ID
  );

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey!,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLen,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      wallet.publicKey,
      mintKeypair.publicKey,
      TOKEN_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      9,
      wallet.publicKey!,
      null,
      TOKEN_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_PROGRAM_ID,
      mint: mintKeypair.publicKey,
      metadata: mintKeypair.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: wallet.publicKey!,
      updateAuthority: wallet.publicKey!,
    }),
    createAssociatedTokenAccountInstruction(
      wallet.publicKey!,
      associatedToken,
      wallet.publicKey!,
      mintKeypair.publicKey,
      TOKEN_PROGRAM_ID
    ),
    createMintToInstruction(
      mintKeypair.publicKey,
      associatedToken,
      wallet.publicKey!,
      +values.initial_supply,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  transaction.feePayer = wallet.publicKey!;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.partialSign(mintKeypair);

  const txSig = await wallet.sendTransaction(transaction, connection);

  console.log("from server actionlike:::", {
    accountPubkey: mintKeypair.publicKey.toBase58(),
    transactionSignature: txSig,
  });

  return {
    accountPubkey: mintKeypair.publicKey.toBase58(),
    transactionSignature: txSig,
  };
}
