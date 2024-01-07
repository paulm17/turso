import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Box, Group, Stack, Text } from "@mantine/core"
import { useFocusTrap } from "@mantine/hooks"
import {
  Form,
  MantineFormLabel,
  MantineFormInput,
  MantineFormButton,
  FormTagPicker,
  FormSwitch,
  FormDescription,
  MultipleOptions,
  MultipleOption,
  FontAwesomeIcon,
  FormInputNumber,
} from "@golfcart/ui"
import {
  Controller,
  UseFormReturn,
  useFieldArray,
  UseFormWatch,
} from "react-hook-form"
import { OptionFormSchema } from "./schema"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

interface typeSwitcherProps {
  control: any
  data: any
  name: string
}

function TypeSwitcher({ name, data, control }: typeSwitcherProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <MultipleOptions value={value} options={data} onChange={onChange} />
      )}
    />
  )
}

interface formChangeProps {
  watch: UseFormWatch<any>
  setInputType: Dispatch<SetStateAction<string>>
}

function FormChange({ watch, setInputType }: formChangeProps) {
  const inputType = watch("inputType")

  useEffect(() => {
    setInputType(inputType)
  }, [inputType])

  return <></>
}

interface optionModalProps {
  index: number
  control: any
  onSubmit: (values) => void
  close: () => void
}

function OptionModal({ index, control, onSubmit, close }: optionModalProps) {
  const focusTrapRef = useFocusTrap()
  const [inputType, setInputType] = useState("select")

  const typeOptions: MultipleOption[] = [
    {
      id: "select",
      title: "Select",
      description: "Multiple preset option values",
      icon: "list-dropdown",
    },
    {
      id: "toggle",
      title: "Toggle",
      description: "Binary option values (on/off)",
      icon: "toggle-on",
    },
    {
      id: "shortText",
      title: "Short Text",
      description: "Small text field for user input",
      icon: "grip-lines",
    },
    {
      id: "longText",
      title: "Long Text",
      description: "Large text area for user input",
      icon: "align-justify",
    },
  ]

  const { fields } = useFieldArray({ control, name: "options" })

  return (
    <Form
      labelComponent={MantineFormLabel}
      inputComponent={MantineFormInput}
      buttonComponent={MantineFormButton}
      schema={OptionFormSchema as any}
      values={fields[index]}
      isNested={true}
      onSubmit={values => {
        onSubmit(values)
      }}
    >
      {({ Field, Errors, Button, formState, control, watch }) => (
        <Stack>
          <Field name="name" type="text">
            {({ Label, SmartInput, Errors }) => (
              <>
                <Stack spacing={4} ref={focusTrapRef}>
                  <Label size={14}>Name</Label>
                  <SmartInput autoComplete="off" />
                  <Text size="xs" color="red">
                    <Errors />
                  </Text>
                </Stack>
              </>
            )}
          </Field>
          <Field name="active" type="boolean">
            {({ Errors }) => (
              <>
                <Stack spacing={4}>
                  <FormSwitch name="enabled" control={control} />
                  <Text size="xs" color="red">
                    <Errors />
                  </Text>
                </Stack>
              </>
            )}
          </Field>
          <Field name="inputType" type="text">
            {({ Label, Errors }) => (
              <>
                <Stack spacing={4}>
                  <Label size={14}>Input Type</Label>
                  <TypeSwitcher
                    name="inputType"
                    data={typeOptions}
                    control={control}
                  />
                  <Text size="xs" color="red">
                    <Errors />
                  </Text>
                </Stack>
              </>
            )}
          </Field>
          {inputType === "select" && (
            <Field name="tags">
              {({ Label, Errors }) => (
                <>
                  <Stack spacing={4}>
                    <Label size={14}>Option values</Label>
                    <FormTagPicker
                      name="tags"
                      control={control}
                      placeholder="Separate values with a comma"
                    />
                    <Text size="xs" color="red">
                      <Errors />
                    </Text>
                  </Stack>
                </>
              )}
            </Field>
          )}
          {inputType === "toggle" && (
            <>
              <Group grow>
                <Field name="price" type="text">
                  {({ Label, Errors }) => (
                    <>
                      <Stack spacing={4}>
                        <Group spacing={6}>
                          <Label size={14}>Add price</Label>
                          <Text size={12}>
                            <Box id="price-tooltip">
                              <FontAwesomeIcon
                                icon="circle-question"
                                type="fas"
                              />
                            </Box>
                          </Text>
                          <Tooltip
                            anchorSelect="#price-tooltip"
                            content={`Will be added to the original product price`}
                            style={{
                              backgroundColor: "#404040",
                              color: "#C1C2C5",
                              fontSize: "14px",
                              width: "270px",
                            }}
                          />
                        </Group>
                        <FormInputNumber
                          name="price"
                          control={control}
                          decimalScale={2}
                        />
                        <Text size="xs" color="red">
                          <Errors />
                        </Text>
                      </Stack>
                    </>
                  )}
                </Field>
                <Field name="shippingWeight" type="text">
                  {({ Label, Errors }) => (
                    <>
                      <Stack spacing={4}>
                        <Group spacing={6}>
                          <Label size={14}>Add shipping weight</Label>
                          <Text size={12}>
                            <Box id="shippingWeight-tooltip">
                              <FontAwesomeIcon
                                icon="circle-question"
                                type="fas"
                              />
                            </Box>
                          </Text>
                          <Tooltip
                            anchorSelect="#shippingWeight-tooltip"
                            content={`Will be added to the original product weight for shipping calculation`}
                            style={{
                              backgroundColor: "#404040",
                              color: "#C1C2C5",
                              fontSize: "14px",
                              width: "270px",
                            }}
                          />
                        </Group>
                        <FormInputNumber
                          name="shippingWeight"
                          control={control}
                        />
                        <Text size="xs" color="red">
                          <Errors />
                        </Text>
                      </Stack>
                    </>
                  )}
                </Field>
              </Group>
            </>
          )}
          {inputType === "shortText" && (
            <>
              <Field name="shortPlaceholder" type="text">
                {({ Label, SmartInput, Errors }) => (
                  <>
                    <Stack spacing={4}>
                      <Group spacing={6}>
                        <Label size={14}>Placeholder</Label>
                        <Text size={12}>
                          <Box id="placeholder-tooltip">
                            <FontAwesomeIcon
                              icon="circle-question"
                              type="fas"
                            />
                          </Box>
                        </Text>
                        <Tooltip
                          anchorSelect="#placeholder-tooltip"
                          content={`Placeholder should indicate how this option should be used`}
                          style={{
                            backgroundColor: "#404040",
                            color: "#C1C2C5",
                            fontSize: "14px",
                            width: "300px",
                          }}
                        />
                      </Group>
                      <SmartInput autoComplete="off" placeholder="Optional" />
                      <Text size="xs" color="red">
                        <Errors />
                      </Text>
                    </Stack>
                  </>
                )}
              </Field>
            </>
          )}
          {inputType === "longText" && (
            <Field name="longPlaceholder" type="text">
              {({ Label, Errors }) => (
                <>
                  <Stack spacing={4}>
                    <Group spacing={6}>
                      <Label size={14}>Placeholder</Label>
                      <Text size={12}>
                        <Box id="placeholder-tooltip">
                          <FontAwesomeIcon icon="circle-question" type="fas" />
                        </Box>
                      </Text>
                      <Tooltip
                        anchorSelect="#placeholder-tooltip"
                        content={`Placeholder should indicate how this option should be used`}
                        style={{
                          backgroundColor: "#404040",
                          color: "#C1C2C5",
                          fontSize: "14px",
                          width: "300px",
                        }}
                      />
                    </Group>
                    <FormDescription
                      name="longPlaceholder"
                      control={control}
                      placeholder="Optional"
                    />
                    <Text size="xs" color="red">
                      <Errors />
                    </Text>
                  </Stack>
                </>
              )}
            </Field>
          )}
          <Field name="description" type="text">
            {({ Label, Errors }) => (
              <>
                <Stack spacing={4}>
                  <Label size={14}>Description</Label>
                  <FormDescription
                    name="description"
                    control={control}
                    placeholder="Optional"
                  />
                  <Text size="xs" color="red">
                    <Errors />
                  </Text>
                </Stack>
              </>
            )}
          </Field>
          <Errors />
          <Group position="right">
            <Button
              color="gray"
              type="button"
              disabled={formState.isSubmitting}
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              color="green"
              type="submit"
              disabled={formState.isSubmitting}
              loading={formState.isSubmitting}
            >
              Save
            </Button>
          </Group>
          <FormChange watch={watch} setInputType={setInputType} />
        </Stack>
      )}
    </Form>
  )
}

export default OptionModal
