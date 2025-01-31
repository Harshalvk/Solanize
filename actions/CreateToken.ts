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
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { uploadMetadata } from "./UploadMetadata";

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

  const sMetadata = {
    name: values.name,
    symbol: values.symbol,
    description: values.description,
    image: values.image,
  };

  const metadataRes = await uploadMetadata(sMetadata);

  console.log(metadataRes);

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

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey!,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      wallet.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      9,
      wallet.publicKey!,
      null,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mintKeypair.publicKey,
      metadata: mintKeypair.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: wallet.publicKey!,
      updateAuthority: wallet.publicKey!,
    })
  );

  transaction.feePayer = wallet.publicKey!;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.partialSign(mintKeypair);

  const res = await wallet.sendTransaction(transaction, connection);
  console.log("@HASH", res);

  const associatedToken = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    wallet.publicKey!,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  console.log(associatedToken.toBase58());

  const transaction2 = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      wallet.publicKey!,
      associatedToken,
      wallet.publicKey!,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    )
  );

  await wallet.sendTransaction(transaction2, connection);

  const transaction3 = new Transaction().add(
    createMintToInstruction(
      mintKeypair.publicKey,
      associatedToken,
      wallet.publicKey!,
      +values.initial_supply,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  await wallet.sendTransaction(transaction3, connection);
}
