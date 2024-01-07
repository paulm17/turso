import { z } from "zod"

export const OptionFormSchema = z
  .object({
    name: z.string(),
    active: z.boolean(),
    inputType: z.string(),
    tags: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
    price: z.string().optional(),
    genVariants: z.boolean().optional(),
    shippingWeight: z.string().optional(),
    shortPlaceholder: z.string().optional(),
    longPlaceholder: z.string().optional(),
    description: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.name === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name field cannot be empty",
        path: ["name"],
      })
    }
    if (val.inputType === "select" && val.tags?.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must enter at least 1 tag",
        path: ["tags"],
      })
    } else if (val.inputType === "toggle") {
      if (val.price === "0" || val.price?.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Price must be greater than 0",
          path: ["price"],
        })
      }
      if (val.shippingWeight === "0") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Shipping Weight must be greater than 0",
          path: ["shippingWeight"],
        })
      }
    }
  })
