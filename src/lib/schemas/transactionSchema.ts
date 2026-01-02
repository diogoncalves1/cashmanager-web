// lib/schemas/transactionSchema.ts
import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["revenue", "expense"], {
    required_error: "Selecione o tipo da transação",
  }),

  amount: z.coerce
    .number({
      invalid_type_error: "O valor deve ser um número",
      required_error: "O valor é obrigatório",
    })
    .positive({ message: "O valor deve ser maior que zero" })
    .min(0.01, { message: "O valor mínimo é R$ 0,01" }),

  category_id: z.number().min(1, { message: "Selecione uma categoria" }),

  description: z
    .string()
    .max(2000, { message: "A descrição pode ter no máximo 2000 caracteres" })
    .optional(),

  // Campos opcionais ou que você pode adicionar depois
  date: z.string().optional(),
  status: z.string().optional(),
  account_id: z.string().optional(),
});

// Tipo inferido para usar no form
export type TransactionFormValues = z.infer<typeof transactionSchema>;
