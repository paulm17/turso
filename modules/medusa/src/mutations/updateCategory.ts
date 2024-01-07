import { resolver } from "@blitzjs/rpc"
import db from "@golfcart/prisma/blitz"
import { CategoryUpdate } from "../validations/categories"

export default resolver.pipe(
  resolver.zod(CategoryUpdate),
  resolver.authorize(),
  async ({ data, storeId }, ctx) => {
    const transactions: any = []

    if (data && data.length > 0) {
      data.forEach(category => {
        const result = db.medusaCategories.updateMany({
          where: {
            id: category.id,
            storeId,
          },
          data: {
            parentId: category.parentId,
          },
        })

        transactions.push(result)
      })
    }
    if (transactions.length) {
      const res = await db.$transaction(transactions)
      console.log(res)
    }

    return false
  },
)
