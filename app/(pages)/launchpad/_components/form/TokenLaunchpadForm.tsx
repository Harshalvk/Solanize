"use client";

import { TokenLauchpadFormSchema } from "@/schema/tokenLaunchpad.schema";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Connection } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { createToken } from "@/actions/CreateToken";

const TokenLaunchpadForm = ({
  connection,
  wallet,
}: {
  connection: Connection;
  wallet: WalletContextState;
}) => {
  const form = useForm<z.infer<typeof TokenLauchpadFormSchema>>({
    resolver: zodResolver(TokenLauchpadFormSchema),
    defaultValues: {
      name: "",
      image: "",
      initial_supply: undefined,
      symbol: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof TokenLauchpadFormSchema>) => {
    const res = await createToken({ values, connection, wallet });
    console.log("@TOKEN CREATED");
    console.log(res);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., doge" {...field} />
              </FormControl>
              <FormDescription>Give a name to your token.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Give a symbol to your token.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="initial_supply"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Supply</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., 10000000" />
              </FormControl>
              <FormDescription>
                Provide initial supply for you token.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Provide image for you token.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type={"submit"}>Submit</Button>
      </form>
    </Form>
  );
};

export default TokenLaunchpadForm;
