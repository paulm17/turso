import { z } from "zod"
import slugify from "slugify"

export const GetCategories = z.object({
  storeId: z.string(),
})

export const CategoryUpdate = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      parentId: z.string().nullable(),
    }),
  ),
  storeId: z.string(),
})

export const CategoryFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    enabled: z.boolean(),
    parentId: z.string().optional(),
    imageId: z.string().optional(),
    description: z.string().optional(),
    title: z.string().optional(),
    metaDescription: z.string().optional(),
    slug: z.string(),
    storeId: z.string(),
  })
  .transform(val => {
    if (val.slug === "") {
      val.slug = slugify(val.name)
    } else {
      val.slug = slugify(val.slug)
    }

    return val
  })
