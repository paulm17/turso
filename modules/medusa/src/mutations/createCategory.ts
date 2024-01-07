import { resolver } from "@blitzjs/rpc"
import db from "@golfcart/prisma/blitz"
import { ulid } from "ulid"
import { CategoryFormSchema } from "../validations/categories"

export default resolver.pipe(
  resolver.zod(CategoryFormSchema),
  resolver.authorize(),
  async (
    {
      name,
      enabled,
      parentId,
      imageId,
      description,
      title,
      metaDescription,
      slug,
      storeId,
    },
    ctx,
  ) => {
    const row = await db.medusaCategories.findFirst({
      where: {
        name: name,
        deletedAt: null,
      },
    })

    if (row) {
      throw new Error("Category already exists")
    }

    const query = await db.medusaCategories.create({
      data: {
        id: ulid(),
        parentId: parentId === "" ? undefined : parentId,
        name,
        enabled,
        description,
        pageTitle: title,
        metaDescription,
        slug,
        storeId,
      },
      select: { id: true, name: true },
    })

    if (imageId !== "" && imageId !== undefined) {
      await db.medusaCategoryImages.create({
        data: {
          id: ulid(),
          categoryId: query.id,
          damFileId: imageId,
          storeId,
        },
      })
    }

    return query
  },
)
