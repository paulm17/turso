import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "@golfcart/prisma/blitz"
import { ulid } from "ulid"
import voucher_codes from "voucher-code-generator"
import { GiftCardFormSchema } from "../validations/giftCards"

export default resolver.pipe(
  resolver.zod(GiftCardFormSchema),
  resolver.authorize(),
  async ({ code, balance, expiresAt, prefix, postfix, storeId }, ctx) => {
    if (code === "" || code === undefined) {
      const codes = voucher_codes.generate({
        count: 1,
        length: 16,
        charset: voucher_codes.charset("alphanumeric"),
        pattern: "####-####-####-####",
        prefix: prefix ? `${prefix}-` : "",
        postfix: postfix ? `-${postfix}` : "",
      })

      code = codes[0]
    }

    const query = await db.medusaGiftCards.create({
      data: {
        id: ulid(),
        code: code || "",
        balance: new Prisma.Decimal(balance),
        expiresAt,
        storeId,
      },
      select: { id: true },
    })

    return query
  },
)
