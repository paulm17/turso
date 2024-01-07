import { useEffect } from "react"
import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Control, useFieldArray, UseFormWatch } from "react-hook-form"
import { FontAwesomeIcon, FormInput, FormTagPicker } from "@golfcart/ui"
import OptionModal from "./optionModal"

interface productOptionItemProps {
  index: number
  Field: any
  formState: any
  flattenErrors: any
  control: Control<any, any>
  onDelete: any
  setValue: any
  watch: UseFormWatch<any>
}

function ProductOptionItem({
  index,
  Field,
  formState,
  flattenErrors,
  control,
  onDelete,
  setValue,
  watch,
}: productOptionItemProps) {
  const [opened, { open, close }] = useDisclosure(false)
  const onMore = () => {
    open()
  }

  const watchedField = watch(`options.${index}`)

  const onSubmit = value => {
    setValue(`options.${index}.name`, value.name)
    setValue(`options.${index}.inputType`, value.inputType)
    setValue(`options.${index}.active`, value.active)
    setValue(`options.${index}.description`, value.description)

    if (value.inputType === "select") {
      setValue(`options.${index}.tags`, value.tags)
      setValue(`options.${index}.genVariants`, value.genVariants)
    } else if (value.inputType === "toggle") {
      setValue(`options.${index}.price`, value.price)
      setValue(`options.${index}.shippingWeight`, value.shippingWeight)
      setValue(`options.${index}.genVariants`, value.genVariants)
    } else if (value.inputType === "shortText") {
      setValue(`options.${index}.shortPlaceholder`, value.shortPlaceholder)
    } else if (value.inputType === "longText") {
      setValue(`options.${index}.longPlaceholder`, value.longPlaceholder)
    }

    close()
  }

  const optionsErrors = flattenErrors(formState.errors, "options")

  return (
    <>
      <Group
        sx={{
          alignItems: "flex-start",
        }}
      >
        <Stack spacing={4}>
          <FormInput
            control={control}
            name={`options.${index}.name`}
            placeholder="e.g. Color, Size"
          />
          <Text size="xs" color="red">
            {optionsErrors[`options.${index}.name`]}
          </Text>
        </Stack>
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Stack spacing={4}>
            <FormTagPicker
              disabled={watchedField.inputType !== "select"}
              control={control}
              name={`options.${index}.tags`}
              placeholder="Separate values with a comma"
            />

            <Text size="xs" color="red">
              {optionsErrors[`options.${index}.tags`]}
            </Text>
          </Stack>
        </Box>
        <Button color="gray" onClick={onMore}>
          More
        </Button>
        <Button
          color="red.9"
          onClick={onDelete}
          styles={{
            root: {
              paddingLeft: "10px",
              paddingRight: "10px",
            },
          }}
        >
          <Text size={12}>
            <FontAwesomeIcon icon="trash-alt" type="fas" />
          </Text>
        </Button>
      </Group>
      <Modal
        opened={opened}
        onClose={close}
        title="Edit Option"
        size="lg"
        styles={{
          header: {
            border: "1px solid rgb(55, 58, 64)",
            borderLeft: 0,
            borderRight: 0,
            borderTop: 0,
            marginBottom: "1rem",
          },
        }}
      >
        <OptionModal
          index={index}
          control={control}
          onSubmit={values => onSubmit(values)}
          close={close}
        />
      </Modal>
    </>
  )
}

interface productOptionProps {
  control: Control<any, any>
  formState: any
  flattenErrors: any
  Field: any
  setValue: any
  watch: UseFormWatch<any>
}

export function ProductOption({
  control,
  formState,
  flattenErrors,
  Field,
  setValue,
  watch,
}: productOptionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "options" })

  useEffect(() => {
    if (fields.length === 0) {
      append({
        name: "",
        active: true,
        inputType: "select",
        tags: [],
        genVariants: false,
        description: "",
      })
    }
    return () => {
      setValue("options", [])
    }
  }, [])

  return (
    <Stack spacing={0}>
      <Stack
        p={5}
        sx={{
          background: "#212529",
        }}
      >
        {fields.map((nfield, index: number) => {
          return (
            <ProductOptionItem
              key={nfield.id}
              index={index}
              Field={Field}
              formState={formState}
              flattenErrors={flattenErrors}
              control={control}
              setValue={setValue}
              watch={watch}
              onDelete={() => remove(index)}
            />
          )
        })}
      </Stack>
      <Button
        my={fields.length > 0 ? 10 : 0}
        onClick={() => {
          append({
            name: "",
            active: true,
            inputType: "select",
            tags: [],
            genVariants: false,
            description: "",
          })
        }}
        compact
        color="gray"
        styles={{
          root: {
            width: "125px",
          },
        }}
      >
        Option
      </Button>
    </Stack>
  )
}
