import { useRouter } from "next/router"
import { CategoriesForm } from "./form"
import { FORM_ERROR } from "@golfcart/ui"
import getCategories from "../../queries/getCategories"
import { CategoryFormSchema } from "../../validations/categories"

function NewCategories() {
  const router = useRouter()

  return (
    <CategoriesForm
      title="Edit Name"
      submitIcon="rocket"
      submitText="Update"
      schema={CategoryFormSchema}
      // initialValues={episodeData}
      onSubmit={async values => {
        console.log(values)
        try {
          //   await updateMutation({ ...values, id: episodeData.id })
          //   await invalidateQuery(getAll)
          router.push("/tapes")
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
