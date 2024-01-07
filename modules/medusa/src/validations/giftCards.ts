import { z } from "zod"

export const GetGiftCards = z.object({
  storeId: z.string(),
})

export const GiftCardFormSchema = z
  .object({
    code: z.string().optional(),
    balance: z.string(),
    expiresAt: z.date().optional(),
    prefixShown: z.boolean(),
    prefix: z.string().optional(),
    postfixShown: z.boolean(),
    postfix: z.string().optional(),
    storeId: z.string(),
  })
  .superRefine((val, ctx) => {
    if (parseFloat(val.balance) < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Balance must be greater than or equal to 1",
        path: ["balance"],
      })
    } else if (val.code && val.code.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Code must be at least 6 characters long",
        path: ["code"],
      })
    } else if (
      (val.prefixShown && val.prefix === undefined) ||
      (val.prefixShown && val.prefix !== undefined && val.prefix.length < 4)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Prefix must be at least 4 characters long",
        path: ["prefix"],
      })
    } else if (
      (val.postfixShown && val.postfix === undefined) ||
      (val.postfixShown && val.postfix !== undefined && val.postfix.length < 4)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Postfix must be at least 4 characters long",
        path: ["postfix"],
      })
    }
  })
