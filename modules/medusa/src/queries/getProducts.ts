import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "@golfcart/prisma/blitz"

interface Input
  extends Pick<Prisma.MedusaProductsFindManyArgs, "skip" | "take"> {
  searchTerm: string
  storeId: string
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ searchTerm, storeId, take, skip }: Input, ctx) => {
    const where = {
      code: {
        contains: searchTerm,
      },
      storeId: storeId,
    }

    const {
      items: result,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.medusaProducts.count({ where }),
      query: paginateArgs =>
        db.medusaProducts.findMany({
          ...paginateArgs,
          where,
        }),
    })

    return {
      result,
      nextPage,
      hasMore,
      count,
    }
  },
)
