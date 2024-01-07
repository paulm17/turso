import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "@golfcart/prisma/blitz"

interface Input
  extends Pick<Prisma.MedusaGiftCardsFindManyArgs, "skip" | "take"> {
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
      count: () => db.medusaGiftCards.count({ where }),
      query: paginateArgs =>
        db.medusaGiftCards.findMany({
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
