"use client";

import { TokenLauchpadFormSchema } from "@/schema/tokenLaunchpad.schema";
import React, { useCallback } from "react";
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
import { AutosizeTextarea } from "@/components/ui/autoresize-textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
      description: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-token"],
    mutationFn: createToken,
    onSuccess: () => {
      toast.success("Token created!", { id: "create-token" });
    },
    onError: () => {
      toast.error("Failed to create token", { id: "create-token" });
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof TokenLauchpadFormSchema>) => {
      toast.loading("Creating token...", { id: "create-token" });
      mutate({ values, connection, wallet });
    },
    [mutate]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Ntame</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., doge"
                  {...field}
                  disabled={isPending}
                />
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
                <Input {...field} disabled={isPending} />
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
                <Input
                  {...field}
                  placeholder="e.g., 10000000"
                  disabled={isPending}
                />
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
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>Provide image for you token.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <AutosizeTextarea
              placeholder="Describe your token"
              maxHeight={200}
              className="resize-none"
            />
          )}
        />
        <Button type={"submit"} disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default TokenLaunchpadForm;
