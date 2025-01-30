import { z } from "zod";

export const TokenLauchpadFormSchema = z.object({
  name: z.string().min(3).max(6),
  symbol: z.string(),
  initial_supply: z.string(),
  image: z.string(),
});
