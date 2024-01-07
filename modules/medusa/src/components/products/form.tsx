import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { useToggle, useFocusTrap } from "@mantine/hooks"
import { Controller, UseFormWatch } from "react-hook-form"
import {
  FontAwesomeIcon,
  Form,
  FormDescription,
  FormInputNumber,
  FormSwitch,
  FormTagPicker,
  FormProps2,
  MantineFormLabel,
  MantineFormInput,
  MantineFormButton,
  MultipleOptions,
  MultipleOption,
  TreeSelect,
  Wizard,
  useWizardContext,
  FormUpload,
} from "@golfcart/ui"
import { PricingRules } from "./pricingRules"
import { SubscriptionPricing } from "./subscriptionPricing"
import { ProductOption } from "./option"
import getCategories from "../../queries/getCategories"
import { z } from "zod"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

interface controlProps {
  control: any
}

interface categoryProps extends controlProps {
  data: any
}

function Categories({ control, data }: categoryProps) {
  return (
    <Controller
      control={control}
      name="categories"
      render={({ field: { onChange, value } }) => (
        <>
          {data !== undefined && (
            <TreeSelect data={data} tags={value} onChange={onChange} />
          )}
        </>
      )}
    />
  )
}

interface typeSwitcherProps extends controlProps {
  data: any
}

function TypeSwitcher({ data, control }: typeSwitcherProps) {
  return (
    <Controller
      control={control}
      name="type"
      render={({ field: { onChange, value } }) => (
        <MultipleOptions value={value} options={data} onChange={onChange} />
      )}
    />
  )
}

function IdleComponentTitle({ watch, maxFiles }) {
  const imageCount = watch("images").length
  const imageLeft = maxFiles - imageCount
  const imageText = maxFiles - imageCount === 1 ? "image" : "images"

  return (
    <>
      {imageCount === 0
        ? `Add (${maxFiles || 0}) Images`
        : `Add (${imageLeft || 0} more) ${imageText}`}
    </>
  )
}

interface formChangeProps {
  watch: UseFormWatch<any>
  setTitleLength: Dispatch<SetStateAction<number>>
  setMetaDescriptionLength: Dispatch<SetStateAction<number>>
}

function FormChange({
  watch,
  setTitleLength,
  setMetaDescriptionLength,
}: formChangeProps) {
  const metaDescription = watch("metaDescription")
  const title = watch("title")

  useEffect(() => {
    if (title) {
      setTitleLength(title.length)
    } else {
      setTitleLength(0)
    }
  }, [title])

  useEffect(() => {
    if (metaDescription) {
      setMetaDescriptionLength(metaDescription.length)
    } else {
      setMetaDescriptionLength(0)
    }
  }, [metaDescription])

  return <></>
}

function FormStepChange({ formRef, trigger, watch, setFocus }) {
  const { handleStep, activeStepName } = useWizardContext()

  handleStep(async () => {
    if (activeStepName === "Main") {
      return await trigger(["name", "type", "enabled", "categories", "cost"], {
        shouldFocus: true,
      })
    } else if (activeStepName === "Pricing") {
      const [showStandardPricing, standardPricing] = watch(
        ["showStandardPricing", "standardPricing"],
        {
          shouldFocus: true,
        },
      )

      if (showStandardPricing && standardPricing.priceRules.length > 0) {
        standardPricing.priceRules.forEach((rule, index) => {
          if (rule.price === "0" || rule.price.trim() === "") {
            setFocus(`standardPricing.priceRules.${index}.price`)
          } else if (rule.minQty === "0" || rule.minQty.trim() === "") {
            setFocus(`standardPricing.priceRules.${index}.minQty`)
          } else if (rule.maxQty === "0" || rule.maxQty.trim() === "") {
            setFocus(`standardPricing.priceRules.${index}.maxQty`)
          }
        })

        return await trigger(["standardPricing"])
      }
    } else if (activeStepName === "Subscription") {
      const [showSubscriptionPricing, subscriptionPricing] = watch(
        ["showSubscriptionPricing", "subscriptionPricing"],
        {
          shouldFocus: true,
        },
      )

      if (showSubscriptionPricing && subscriptionPricing.length > 0) {
        subscriptionPricing.forEach((sub, index) => {
          if (
            sub.billing.intervalQty === "0" ||
            sub.billing.intervalQty.trim() === ""
          ) {
            setFocus(`subscriptionPricing.${index}.billing.intervalQty`)
          } else if (
            sub.billing.price === "0" ||
            sub.billing.price.trim() === ""
          ) {
            setFocus(`subscriptionPricing.${index}.billing.price`)
          } else if (
            sub.billing.trialDays === "0" ||
            sub.billing.trialDays.trim() === ""
          ) {
            setFocus(`subscriptionPricing.${index}.billing.trialDays`)
          }

          if (sub.fulfillSeparately) {
            if (
              sub.order.intervalQty === "0" ||
              sub.order.intervalQty.trim() === ""
            ) {
              setFocus(`subscriptionPricing.${index}.order.intervalQty`)
            }
          }
        })

        return await trigger(["subscriptionPricing"])
      }
    } else if (activeStepName === "Options") {
      const [showOptions, options] = watch(["showOptions", "options"], {
        shouldFocus: true,
      })

      if (showOptions && options.length > 0) {
        options.forEach((option, index) => {
          if (option.name === "") {
            setFocus(`options.${index}.name`, { shouldSelect: true })
          } else if (option.tags.length === 0) {
            setFocus(`options.${index}.tags`)
          }
        })

        return await trigger(["options"])
      }
    } else if (activeStepName === "Related") {
      // return true
    } else if (activeStepName === "Content") {
      const res = await trigger(
        ["description", "tags", "pageTitle", "metaDescription", "slug"],
        {
          shouldFocus: true,
        },
      )

      if (!res) {
        return true
      }

      if (formRef.current) {
        ;(formRef.current as EventTarget).dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true }),
        )
      }
    }

    return true
  })

  return <></>
}

export function ProductsForm<S extends z.ZodType<any, any>>(
  props: FormProps2<S>,
) {
  const formRef = useRef(null)
  const focusTrapRef = useFocusTrap()

  const [showRelated, showRelatedToggle] = useToggle([false, true])
  const [titleLength, setTitleLength] = useState(0)
  const [metaDescriptionLength, setMetaDescriptionLength] = useState(0)
  const [data] = useQuery(
    getCategories,
    { storeId: "01GZKFVZZ1HNEVN70YNV7M7D16" },
    {
      suspense: false,
      staleTime: Infinity,
    },
  )

  const typeOptions: MultipleOption[] = [
    {
      id: "physical",
      title: "Physical",
      description: "Item has weight and needs shipping or customer pickup",
      icon: "cube",
    },
    {
      id: "digital",
      title: "Digital",
      description: "Item is delivered digitally or provided as a service",
      icon: "credit-card",
    },
    {
      id: "bundle",
      title: "Bundle",
      description: "Item is a group of several physical or digital products",
      icon: "layer-group",
    },
    {
      id: "gift",
      title: "Gift card",
      description: "Generates a unique code for store credit when purchased",
      icon: "gift",
    },
  ]

  return (
    <Container mt={20} w="100%" maw={"65rem"}>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Card.Section>
          <Group position="apart" mt="xs" ml="md" mr="md">
            <Title order={3}>{props.title}</Title>
          </Group>
          <Divider my="sm" />
        </Card.Section>
        <Card.Section p="md" pt={0}>
          <Form
            labelComponent={MantineFormLabel}
            inputComponent={MantineFormInput}
            buttonComponent={MantineFormButton}
            schema={props.schema as any}
            values={props.initialValues}
            onSubmit={props.onSubmit}
            ref={formRef}
          >
            {({
              Field,
              formState,
              control,
              trigger,
              watch,
              setValue,
              setFocus,
              flattenErrors,
            }) => (
              <>
                <Wizard direction="horizontal">
                  <Wizard.Step name="Main">
                    <Stack>
                      <Grid>
                        <Grid.Col span="auto">
                          <Field name="name" type="text">
                            {({ Label, SmartInput, Errors }) => (
                              <>
                                <Stack spacing={4} ref={focusTrapRef}>
                                  <Label size={14}>Product name</Label>
                                  <SmartInput autoComplete="off" />
                                  <Text size="xs" color="red">
                                    <Errors />
                                  </Text>
                                </Stack>
                              </>
                            )}
                          </Field>
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Field name="sku" type="text">
                            {({ Label, SmartInput, Errors }) => (
                              <>
                                <Stack spacing={4}>
                                  <Label size={14}>SKU</Label>
                                  <SmartInput
                                    autoComplete="off"
                                    placeholder="Optional"
                                  />
                                  <Text size="xs" color="red">
                                    <Errors />
                                  </Text>
                                </Stack>
                              </>
                            )}
                          </Field>
                        </Grid.Col>
                      </Grid>
                      <Field name="type" type="text">
                        {({ Label, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Label size={14}>Type</Label>
                              <TypeSwitcher
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
                      <Field name="active" type="boolean">
                        {({ Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Group mt={8}>
                                <FormSwitch
                                  name="active"
                                  control={control}
                                  label="Active"
                                  size="xs"
                                />
                                <Text size={12}>
                                  <Box id="enabled-tooltip">
                                    <FontAwesomeIcon
                                      icon="circle-question"
                                      type="fas"
                                    />
                                  </Box>
                                </Text>
                                <Tooltip
                                  anchorSelect="#enabled-tooltip"
                                  content={`An active product is visible to customers`}
                                  style={{
                                    backgroundColor: "#404040",
                                    color: "#C1C2C5",
                                    fontSize: "14px",
                                    width: "230px",
                                  }}
                                />
                              </Group>
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                      <Field name="images" type="array">
                        {({ Label, Errors }) => (
                          <Stack spacing={4}>
                            <Label size={14}>Images</Label>
                            <FormUpload
                              name="images"
                              control={control}
                              withBorder
                              maxFiles={9}
                              showUploads
                              acceptComponent={
                                <Stack spacing={0} align="center">
                                  <Text size={50}>
                                    <FontAwesomeIcon
                                      icon="cloud-check"
                                      type="fas"
                                    />
                                  </Text>
                                  <Title order={4} mt={-8}>
                                    File accepted
                                  </Title>
                                  <Text size={14}>
                                    Drop file to be uploaded
                                  </Text>
                                </Stack>
                              }
                              rejectComponent={
                                <Stack spacing={0} align="center">
                                  <Text size={50}>
                                    <FontAwesomeIcon icon="ban" type="fas" />
                                  </Text>
                                  <Title order={4} mt={-8}>
                                    File(s) not accepted
                                  </Title>
                                  <Text size={14}>
                                    Incorrect file type detected or higher than
                                    max count for drop zone
                                  </Text>
                                </Stack>
                              }
                              idleComponent={
                                <Stack spacing={0} align="center">
                                  <Text size={50}>
                                    <FontAwesomeIcon
                                      icon="cloud-arrow-up"
                                      type="fas"
                                    />
                                  </Text>
                                  <Title order={4} mt={-8}>
                                    <IdleComponentTitle
                                      watch={watch}
                                      maxFiles={9}
                                    />
                                  </Title>
                                  <Text size={14}>Drag & drop to upload</Text>
                                </Stack>
                              }
                            />
                            {/* {JSON.stringify(watch("images"))} */}
                            <Text size="xs" color="red">
                              <Errors />
                            </Text>
                          </Stack>
                        )}
                      </Field>
                      <Field name="categories" type="array">
                        {({ Label, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Label size={14}>Categories</Label>
                              <Categories control={control} data={data} />
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                      <Field name="cost" type="text">
                        {({ Label, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Label size={14}>Cost</Label>
                              <FormInputNumber
                                name="cost"
                                control={control}
                                decimalScale={2}
                              />
                              <Text size={12}>Must be £0.99 or more</Text>
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                    </Stack>
                  </Wizard.Step>
                  <Wizard.Step name="Pricing">
                    <Stack spacing={4}>
                      <Group>
                        <Title order={5}>Standard pricing</Title>
                        <Box ml="auto" mr="0">
                          <FormSwitch
                            name="showStandardPricing"
                            control={control}
                            size="xs"
                          />
                        </Box>
                      </Group>
                      <Text size={12} my="xs">
                        Manage standard pricing with optional price rules
                      </Text>
                    </Stack>
                    {watch("showStandardPricing") && (
                      <Stack spacing={4}>
                        <Group>
                          <Field name="standardPricing.listPrice" type="text">
                            {({ Label, Errors }) => (
                              <>
                                <Stack spacing={4}>
                                  <Group>
                                    <Label size={14}>List price</Label>
                                    <Text size={12}>
                                      <Box id="listPrice-tooltip">
                                        <FontAwesomeIcon
                                          icon="circle-question"
                                          type="fas"
                                        />
                                      </Box>
                                    </Text>
                                    <Tooltip
                                      anchorSelect="#listPrice-tooltip"
                                      content={`The default price used when a product is not on sale`}
                                      style={{
                                        backgroundColor: "#404040",
                                        color: "#C1C2C5",
                                        fontSize: "14px",
                                        width: "300px",
                                      }}
                                    />
                                  </Group>
                                  <FormInputNumber
                                    name="standardPricing.listPrice"
                                    control={control}
                                    decimalScale={2}
                                    placeholder="£0.00"
                                  />
                                  <Text size="xs" color="red">
                                    <Errors />
                                  </Text>
                                </Stack>
                              </>
                            )}
                          </Field>
                          <Field name="standardPricing.salePrice" type="text">
                            {({ Label, Errors }) => (
                              <>
                                <Stack spacing={4}>
                                  <Group>
                                    <Label size={14}>Sale price</Label>
                                    <FormSwitch
                                      name="standardPricing.showSalePrice"
                                      control={control}
                                      size="xs"
                                    />
                                    <Text size={12}>
                                      <Box id="salePrice-tooltip">
                                        <FontAwesomeIcon
                                          icon="circle-question"
                                          type="fas"
                                        />
                                      </Box>
                                    </Text>
                                    <Tooltip
                                      anchorSelect="#salePrice-tooltip"
                                      content={`Enable to override list price and display savings`}
                                      style={{
                                        backgroundColor: "#404040",
                                        color: "#C1C2C5",
                                        fontSize: "14px",
                                        width: "300px",
                                      }}
                                    />
                                  </Group>
                                  <FormInputNumber
                                    name="standardPricing.salePrice"
                                    control={control}
                                    decimalScale={2}
                                    placeholder="£0.00"
                                  />
                                  <Text size="xs" color="red">
                                    <Errors />
                                  </Text>
                                </Stack>
                              </>
                            )}
                          </Field>
                        </Group>
                        <PricingRules
                          Field={Field}
                          control={control}
                          formState={formState}
                          flattenErrors={flattenErrors}
                          setValue={setValue}
                          watch={watch}
                        />
                      </Stack>
                    )}
                  </Wizard.Step>
                  <Wizard.Step name="Subscription">
                    <Stack spacing={4}>
                      <Group>
                        <Title order={5}>Subscription pricing</Title>
                        <Box ml="auto" mr="0">
                          <FormSwitch
                            size="xs"
                            name="showSubscriptionPricing"
                            control={control}
                          />
                        </Box>
                      </Group>
                      <Text size={12} my="xs">
                        Manage subscription pricing with billing intervals
                      </Text>
                    </Stack>
                    {watch("showSubscriptionPricing") && (
                      <>
                        <Field name="subscriptionPricing" type="object">
                          {({ Errors }) => (
                            <>
                              <SubscriptionPricing
                                control={control}
                                formState={formState}
                                flattenErrors={flattenErrors}
                                Field={Field}
                                setValue={setValue}
                                watch={watch}
                              />
                              <Errors />
                            </>
                          )}
                        </Field>
                      </>
                    )}
                  </Wizard.Step>
                  <Wizard.Step name="Options">
                    <Stack spacing={4}>
                      <Group>
                        <Title order={5}>Options</Title>
                        <Box ml="auto" mr="0">
                          <FormSwitch
                            size="xs"
                            name="showOptions"
                            control={control}
                          />
                        </Box>
                      </Group>
                      <Text size={12} my="xs">
                        Manage variations including size & color, add-ons or
                        personalization
                      </Text>
                    </Stack>
                    {watch("showOptions") && (
                      <ProductOption
                        Field={Field}
                        formState={formState}
                        flattenErrors={flattenErrors}
                        control={control}
                        setValue={setValue}
                        watch={watch}
                      />
                    )}
                  </Wizard.Step>
                  <Wizard.Step name="Related">
                    <Stack spacing={4}>
                      <Title order={5}>Related Products</Title>
                      <Text size={12} my="xs">
                        Manage products offered as recommended up-sells and
                        cross-sells
                      </Text>
                    </Stack>
                    {showRelated && <></>}
                  </Wizard.Step>
                  <Wizard.Step name="Content">
                    <Stack spacing={4}>
                      <Title order={5}>Content</Title>
                      <Text size={12} my="xs">
                        Information to help customers find and understand your
                        product
                      </Text>

                      <Field name="description" type="text">
                        {({ Label, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Label size={14}>Description</Label>

                              <FormDescription
                                name="description"
                                control={control}
                                placeholder="optional"
                                maxLength={170}
                              />
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                      <Field name="tags">
                        {({ Label, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Label size={14}>Tags</Label>

                              <FormTagPicker name="tags" control={control} />
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                      <Field name="title" type="text">
                        {({ Label, SmartInput, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Group spacing={6}>
                                <Label size={14}>Page Title</Label>
                                <Text size={12}>
                                  ({titleLength} of 70 chars)
                                </Text>
                                <Text size={12}>
                                  <Box id="pageTitle-tooltip">
                                    <FontAwesomeIcon
                                      icon="circle-question"
                                      type="fas"
                                    />
                                  </Box>
                                </Text>
                                <Tooltip
                                  anchorSelect="#pageTitle-tooltip"
                                  content={`Search engines typically display the first 50-70 characters of your page title`}
                                  style={{
                                    backgroundColor: "#404040",
                                    color: "#C1C2C5",
                                    fontSize: "14px",
                                    width: "300px",
                                  }}
                                />
                              </Group>
                              <SmartInput
                                autoComplete="off"
                                placeholder="title"
                                maxLength={70}
                              />
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                      <Field name="metaDescription" type="text">
                        {({ Label, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Group spacing={6}>
                                <Label size={14}>Meta description</Label>
                                <Text size={12}>
                                  ({metaDescriptionLength} of 170 chars)
                                </Text>
                                <Text size={12}>
                                  <Box id="metaDescription-tooltip">
                                    <FontAwesomeIcon
                                      icon="circle-question"
                                      type="fas"
                                    />
                                  </Box>
                                </Text>
                                <Tooltip
                                  anchorSelect="#metaDescription-tooltip"
                                  content={`Search engines typically display the first 140-170 characters of your page description`}
                                  style={{
                                    backgroundColor: "#404040",
                                    color: "#C1C2C5",
                                    fontSize: "14px",
                                    width: "300px",
                                  }}
                                />
                              </Group>
                              <FormDescription
                                name="metaDescription"
                                control={control}
                                placeholder="optional"
                                maxLength={170}
                              />
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                      <Field name="slug" type="text">
                        {({ Label, SmartInput, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Group spacing={6}>
                                <Label size={14}>URL name</Label>
                                <Text size={12}>
                                  <Box id="slug-tooltip">
                                    <FontAwesomeIcon
                                      icon="circle-question"
                                      type="fas"
                                    />
                                  </Box>
                                </Text>
                                <Tooltip
                                  anchorSelect="#slug-tooltip"
                                  content={`Also known as a "slug", used to uniquely identify the category in a URL`}
                                  style={{
                                    backgroundColor: "#404040",
                                    color: "#C1C2C5",
                                    fontSize: "14px",
                                    width: "300px",
                                  }}
                                />
                              </Group>
                              <SmartInput name="slug" control={control} />
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                    </Stack>
                  </Wizard.Step>
                  <Wizard.Nav ml={8}>
                    <Wizard.Button action="prev" icon="arrow-left">
                      Prev
                    </Wizard.Button>
                    <Wizard.Button action="next" icon="arrow-right">
                      Next
                    </Wizard.Button>
                    <Wizard.Button action="finish" icon="save">
                      Submit
                    </Wizard.Button>
                  </Wizard.Nav>
                  <FormChange
                    watch={watch}
                    setTitleLength={setTitleLength}
                    setMetaDescriptionLength={setMetaDescriptionLength}
                  />
                  <FormStepChange
                    formRef={formRef}
                    trigger={trigger}
                    watch={watch}
                    setFocus={setFocus}
                  />
                </Wizard>
              </>
            )}
          </Form>
        </Card.Section>
      </Card>
    </Container>
  )
}
