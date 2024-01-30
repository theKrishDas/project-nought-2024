"use server";
import { db } from "@/db";
import { transax } from "@/db/drizzle/schema";
import {
  NewTransactionSchema,
  NewTransactionSchemaType,
} from "@/lib/form-schema/new-transaction-schema";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function getTransactions() {
  try {
    const data = await db.select().from(transax);

    const transactions =
      data &&
      data.map(({ ...transaction }) => ({
        ...transaction,
        amount: transaction.amount / 100,
      }));

    return { transactions };
  } catch (error) {
    return { error: "An error occured while fetching transactions" };
  }
}

export async function insertTransactions(formData: NewTransactionSchemaType) {
  try {
    const user = await currentUser();
    if (!user) return { error: "You must be signed in to add transaction" };

    const validatedData = NewTransactionSchema.safeParse(formData);
    if (!validatedData.success) return { error: "Error parsing input values" };

    const { amount, label, is_expense, date } = validatedData.data;

    const newTransactionData: transactionInsertSchemaType = {
      userId: user.id,
      amount: is_expense ? amount * -100 : amount * 100,
      label: label,
      isExpense: is_expense,
      date: date?.toISOString(),
    };

    console.log(newTransactionData);

    await db.insert(transax).values(newTransactionData);

    // TODO: Use revalidate tag instead
    revalidatePath("/");

    return { success: "Add new transaction" };
  } catch (error) {
    return { error: "An error occured while adding new transaction" };
  }
}
