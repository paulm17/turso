import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "@golfcart/prisma/blitz"
import { ulid } from "ulid"
import voucher_codes from "voucher-code-generator"
import { ProductFormSchema } from "../validations/products"

export default resolver.pipe(
  resolver.zod(ProductFormSchema),
  resolver.authorize(),
  async ({ storeId }, ctx) => {
    const query = await db.medusaProducts.create({
      data: {
        id: ulid(),
        storeId,
      },
      select: { id: true, name: true },
    })

    // if (imageId !== "" && imageId !== undefined) {
    //   await db.medusaCategoryImages.create({
    //     data: {
    //       id: ulid(),
    //       categoryId: query.id,
    //       damFileId: imageId,
    //       storeId,
    //     },
    //   })
    // }

    return query
  },
)
