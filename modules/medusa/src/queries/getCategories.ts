import { resolver } from "@blitzjs/rpc"
import db from "@golfcart/prisma/blitz"
import { GetCategories } from "../validations/categories"

export default resolver.pipe(
  resolver.zod(GetCategories),
  resolver.authorize(),
  async ({ storeId }, ctx) => {
    const query = await db.medusaCategories.findMany({
      where: {
        storeId: storeId,
      },
    })

    return query
  },
)
