"use client";

import { IoArrowUpSharp } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CurrencyInput from "react-currency-input-field";
import { PickDate } from "./PickDate";
import SelectCategory from "./SelectCategory";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  NewTransactionFormSchemaType,
  NewTransactionSchema,
  NewTransactionSchemaType,
  TCategories,
  TTransactionType,
} from "@/lib/types/new-transaction-form-schema";

export default function NewTransactionForm({
  tabType,
  categories,
}: {
  tabType: TTransactionType;
  categories: TCategories[];
}) {
  const isExpense = tabType !== "income";

  const form = useForm<NewTransactionFormSchemaType>({
    defaultValues: { label: "", date: new Date() },
  });

  function onSubmit(data: NewTransactionFormSchemaType) {
    const actualData: NewTransactionSchemaType = {
      label: data.label,
      date: data.date,
      category: data.category,
      is_expense: isExpense,
    };
    console.log(
      "Success: ",
      NewTransactionSchema.safeParse(actualData).success,
    );
    console.log(actualData);
  }

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="inline-flex w-full items-center gap-2">
          <PickDate form={form} />

          <SelectCategory form={form} categories={categories} />
        </div>

        {/* --- --- INPUTS --- --- */}
        <section className="flex w-full flex-col items-start justify-center gap-8 rounded-3xl bg-card p-10">
          <div className="justify-betweens inline-flex w-full items-center">
            <input
              className="min-w-0 flex-1 bg-transparent text-lg outline-none"
              placeholder="Add a Label"
            />

            <IoArrowUpSharp
              size={16}
              className={cn(
                "rotate-0 text-success transition-all",
                isExpense && "rotate-180 text-destructive",
              )}
            />
          </div>

          <CurrencyInput
            decimalsLimit={2}
            allowNegativeValue={false}
            maxLength={8}
            placeholder="Amount"
            className={cn(
              "w-full truncate border-none bg-transparent text-5xl font-light tracking-tight outline-none",
              isExpense ? "text-destructive" : "text-success",
            )}
          />
        </section>

        <div className="flex flex-row-reverse items-center gap-2">
          <Button
            variant="secondary"
            className={cn(
              "h-14 w-full rounded-full bg-card text-base shadow-none",
              isExpense ? "text-destructive" : "text-success",
            )}
            type="submit"
          >
            Add
          </Button>
          <Button
            className="h-14 w-full rounded-full text-base text-foreground/50"
            variant="ghost"
            type="button"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
