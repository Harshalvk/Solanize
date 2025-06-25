"use client";

import { TokenLauchpadFormSchema } from "@/schema/tokenLaunchpad.schema";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
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
import Image from "next/image";
import axios from "axios";
import { cn } from "@/lib/utils";

const TokenLaunchpadForm = ({
  connection,
  wallet,
  successDetails,
  setSuccessDetails,
}: {
  connection: Connection;
  wallet: WalletContextState;
  successDetails?: Record<string, string> | null;
  setSuccessDetails?: Dispatch<SetStateAction<Record<string, string> | null>>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<z.infer<typeof TokenLauchpadFormSchema>>({
    resolver: zodResolver(TokenLauchpadFormSchema),
    defaultValues: {
      name: "",
      image: "",
      initial_supply: "",
      symbol: "",
      description: "",
    },
  });

  const { mutate: createTokenMutation, isPending } = useMutation({
    mutationKey: ["create-token"],
    mutationFn: createToken,
    onSuccess: (data) => {
      toast.success("Token created!", { id: "create-token" });
      form.reset();
      setFile(null);
      if (setSuccessDetails) {
        setSuccessDetails(data);
      }
    },
    onError: () => {
      toast.error("Failed to create token", { id: "create-token" });
    },
  });

  useEffect(() => {
    console.log(successDetails);
  }, [setSuccessDetails, successDetails]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  };

  const onSubmit = useCallback(
    async (values: z.infer<typeof TokenLauchpadFormSchema>) => {
      toast.loading("Creating token...", { id: "create-token" });
      try {
        let url = "";
        if (file) {
          setUploadingImage(true);
          const uploaded = await uploadImage(file);
          if (!uploaded) throw new Error("upload failed");
          url = uploaded.url;
        }

        setUploadingImage(false);

        createTokenMutation({
          values: { ...values, image: url },
          connection,
          wallet,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        console.error(error.message);
        toast.error("Failed to upload image", { id: "create-token" });
      }
    },
    [file, createTokenMutation, connection, wallet]
  );

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., doge"
                    {...field}
                    disabled={isPending || uploadingImage}
                  />
                </FormControl>
                <FormDescription>Give a name to your token.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending || uploadingImage} />
                  </FormControl>
                  <FormDescription>
                    Give a symbol to your token.
                  </FormDescription>
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
                      disabled={isPending || uploadingImage}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide initial supply for you token.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Image</FormLabel>
                <FormControl>
                  {file ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="token image"
                      width={100}
                      height={100}
                      className={cn(
                        "rounded-lg aspect-auto h-52 w-auto",
                        isPending || uploadingImage ? "brightness-50" : ""
                      )}
                    />
                  ) : (
                    <Input
                      {...field}
                      disabled={isPending || uploadingImage}
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFile(file);
                        }
                      }}
                    />
                  )}
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
                {...field}
              />
            )}
          />
          <Button
            variant={"secondary"}
            className="border"
            type={"submit"}
            disabled={isPending || uploadingImage}
          >
            Create Token
          </Button>
        </form>
      </Form>
    </>
  );
};

export default TokenLaunchpadForm;
