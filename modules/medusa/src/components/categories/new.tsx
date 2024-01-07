import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { FORM_ERROR } from "@golfcart/ui"
import { CategoriesForm } from "./form"
import getCategories from "../../queries/getCategories"
import createCategory from "../../mutations/createCategory"
import { CategoryFormSchema } from "../../validations/categories"

function NewCategories() {
  const router = useRouter()

  const [createMutation] = useMutation(createCategory)

  return (
    <CategoriesForm
      title="New Category"
      submitIcon="save"
      submitText="Save"
      schema={CategoryFormSchema}
      initialValues={{
        name: "",
        enabled: true,
        parentId: "",
        description: "",
        title: "",
        metaDescription: "",
        slug: "",
        storeId: "01GZKFVZZ1HNEVN70YNV7M7D16",
      }}
      onSubmit={async values => {
        try {
          await createMutation(values)
          await invalidateQuery(getCategories)
          router.push("/medusa/categories")
        } catch (error) {
          return { [FORM_ERROR]: error.toString() }
        }
      }}
      onCancel={() => {
        router.push("/medusa/categories")
      }}
    />
  )
}

export default NewCategories
