import { z } from "zod";

export const TokenLauchpadFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Token Name should be atleast 3 characters long.",
    })
    .max(16, { message: "Token Name should only contains 16 characters max." }),
  symbol: z
    .string()
    .min(1, { message: "Token symbol must contain at least 1 character." })
    .max(5, { message: "Token symbol should of 5 characters max" }),
  initial_supply: z.string(),
  image: z.string(),
  description: z.string(),
});
