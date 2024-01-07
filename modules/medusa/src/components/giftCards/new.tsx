import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { FORM_ERROR } from "@golfcart/ui"
import { GiftCardsForm } from "./form"
import getGiftCards from "../../queries/getGiftCards"
import createGiftCard from "../../mutations/createGiftCard"
import { GiftCardFormSchema } from "../../validations/giftCards"

function NewCategories() {
  const router = useRouter()
  const [createMutation] = useMutation(createGiftCard)

  return (
    <GiftCardsForm
      title="New Gift Card"
      submitIcon="save"
      submitText="Save"
      schema={GiftCardFormSchema}
      initialValues={{
        balance: "1",
        prefixShown: false,
        storeId: "01GZKFVZZ1HNEVN70YNV7M7D16",
      }}
      onSubmit={async values => {
        try {
          await createMutation(values)
          await invalidateQuery(getGiftCards)
          router.push("/medusa/giftcards")
        } catch (error) {
          return { [FORM_ERROR]: error.toString() }
        }
      }}
      onCancel={() => {
        router.push("/medusa/giftcards")
      }}
    />
  )
}

export default NewCategories
