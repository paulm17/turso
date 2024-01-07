import { z } from "zod"
import { OptionFormSchema } from "../components/products/option/schema"

export const GetProducts = z.object({
  storeId: z.string(),
})

const PriceRules = z
  .object({
    price: z.string(),
    minQty: z.string(),
    maxQty: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.price === "0" || val.price?.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price must be greater than 0",
        path: ["price"],
      })
    }
    if (val.minQty === "0" || val.minQty?.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quantity must be greater than 0",
        path: ["minQty"],
      })
    }
    if (val.maxQty === "0" || val.maxQty?.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quantity must be greater than 0",
        path: ["maxQty"],
      })
    }
  })

const Subscription = z
  .object({
    billing: z.object({
      intervalQty: z.string(),
      intervalDate: z.string().optional(),
      price: z.string(),
      trialDays: z.string(),
      description: z.string().optional(),
      limit: z.string(),
    }),
    fulfillSeparately: z.boolean(),
    order: z.object({
      intervalQty: z.string(),
      intervalDate: z.string().optional(),
      limit: z.string(),
    }),
  })
  .superRefine((val, ctx) => {
    if (
      val.billing.intervalQty === "0" ||
      val.billing.intervalQty?.trim() === ""
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Interval Qty must be greater than 0",
        path: ["billing", "intervalQty"],
      })
    }
    if (val.billing.price === "0" || val.billing.price?.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price must be greater than 0",
        path: ["billing", "price"],
      })
    }
    if (val.billing.trialDays === "0" || val.billing.price?.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Trial Days must be greater than 0",
        path: ["billing", "trialDays"],
      })
    }
    if (val.fulfillSeparately) {
      if (
        val.order.intervalQty === "0" ||
        val.order.intervalQty?.trim() === ""
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Interval Qty must be greater than 0",
          path: ["order", "intervalQty"],
        })
      }
    }
  })

export const ProductFormSchema = z
  .object({
    name: z.string().min(1, "Product Name is required"),
    sku: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
    pageTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    slug: z.string().optional(),
    type: z.string(),
    active: z.boolean(),
    images: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          extension: z.string(),
          size: z.number(),
          type: z.string(),
          image: z.string(),
        }),
      )
      .optional(),
    categories: z.array(z.string()).min(1, "At least one category is required"),
    cost: z.string(),
    showStandardPricing: z.boolean(),
    standardPricing: z.object({
      listPrice: z.string().optional(),
      showSalePrice: z.boolean(),
      salePrice: z.string().optional(),
      priceRules: z.array(PriceRules).optional(),
    }),
    showSubscriptionPricing: z.boolean(),
    subscriptionPricing: z.array(Subscription).optional(),
    showOptions: z.boolean(),
    options: z.array(OptionFormSchema).optional(),
    // related: z.object({}).optional(),
    storeId: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (parseFloat(val.cost) === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cost must be greater than 0",
        path: ["cost"],
      })
    }
  })
