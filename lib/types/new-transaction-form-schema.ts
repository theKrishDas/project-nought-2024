import { z } from "zod";

export type NewTransactionFormSchemaType = {
  label: string;
  date: Date;
  category: string;
};

export const NewTransactionSchema = z.object({
  // amount: z.number().min(0.01, { message: "Amount must be at least 0.01" }),
  label: z.string().optional(),
  category: z.string().nullable().optional(),
  is_expense: z.boolean(),
  date: z.date().optional(),
});
export type NewTransactionSchemaType = z.infer<typeof NewTransactionSchema>;
