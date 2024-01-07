import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { FORM_ERROR } from "@golfcart/ui"
import { ProductsForm } from "./form"
import getProducts from "../../queries/getProducts"
import createProduct from "../../mutations/createProduct"
import { ProductFormSchema } from "../../validations/products"

function NewProducts() {
  const router = useRouter()
  const [createMutation] = useMutation(createProduct)

  return (
    <ProductsForm
      title="New Product"
      submitIcon="save"
      submitText="Save"
      schema={ProductFormSchema}
      initialValues={{
        type: "physical",
        active: true,
        categories: [],
        cost: "0.00",
        images: [],
        showStandardPricing: false,
        standardPricing: {
          showSalePrice: false,
          priceRules: [],
        },
        showSubscriptionPricing: false,
        subscriptionPricing: [],
        showOptions: false,
        options: [],
        // related: {},
        tags: [],
        storeId: "01GZKFVZZ1HNEVN70YNV7M7D16",
      }}
      onSubmit={async values => {
        try {
          await createMutation(values)
          await invalidateQuery(getProducts)
          router.push("/medusa/products")
        } catch (error) {
          return { [FORM_ERROR]: error.toString() }
        }
      }}
      onCancel={() => {
        router.push("/medusa/products")
      }}
    />
  )
}

export default NewProducts
