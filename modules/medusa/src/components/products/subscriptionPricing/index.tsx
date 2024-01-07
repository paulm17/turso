import { Fragment, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Affix,
  Box,
  ActionIcon,
  Button,
  Divider,
  Group,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core"
import { Control, useFieldArray, UseFormWatch } from "react-hook-form"
import {
  FontAwesomeIcon,
  FormInput,
  FormInputNumber,
  FormSelect,
  FormSwitch,
} from "@golfcart/ui"

interface subscriptionPricingItemProps {
  index: number
  id: string
  Field: any
  formState: any
  flattenErrors: any
  control: Control<any, any>
  onDelete: any
  setValue: any
  watch: UseFormWatch<any>
}

function SubscriptionPricingItem({
  index,
  id,
  Field,
  formState,
  flattenErrors,
  control,
  watch,
  onDelete,
  setValue,
}: subscriptionPricingItemProps) {
  const intervalDateMonths = [
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
    { value: "week", label: "Week" },
    { value: "day", label: "Day" },
  ]
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
      transition: null,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    //opacity: activeId === id ? "50%" : "100%",
    transition,
  }

  const subscriptionPricingErrors = flattenErrors(
    formState.errors,
    "subscriptionPricing",
  )

  return (
    <Stack ref={setNodeRef} style={style} spacing={4}>
      <Table>
        <thead>
          <tr>
            <th>
              {!watch(`subscriptionPricing.${index}.fulfillSeparately`)
                ? "Interval"
                : "Billing Interval"}
            </th>
            <th>Price</th>
            <th>Trial days</th>
            <th>Description</th>
            <th>
              <Group>
                <Text>Limit</Text>
                <Tooltip
                  label="Optionally limit the number of times this subscription will invoice the customer"
                  withArrow
                  withinPortal
                  arrowSize={7}
                  offset={7}
                  position="top"
                  openDelay={400}
                  multiline
                  width={300}
                  styles={{
                    tooltip: {
                      fontSize: "13px",
                    },
                  }}
                >
                  <Text size={13}>
                    <FontAwesomeIcon icon="question-circle" type="fas" />
                  </Text>
                </Tooltip>
              </Group>
            </th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Box
              component="td"
              sx={{
                width: "270px",
              }}
            >
              <Group spacing={8}>
                <Text size={13}>Every</Text>
                <Box
                  sx={{
                    width: "60px",
                    position: "relative",
                  }}
                >
                  <Stack spacing={4} mt={-4}>
                    <FormInputNumber
                      control={control}
                      name={`subscriptionPricing.${index}.billing.intervalQty`}
                      placeholder="1"
                    />
                    <Text
                      size="xs"
                      color="red"
                      sx={{
                        position: "absolute",
                        width: "200px",
                        top: 45,
                      }}
                    >
                      {
                        subscriptionPricingErrors[
                          `subscriptionPricing.${index}.billing.intervalQty`
                        ]
                      }
                    </Text>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    width: "120px",
                  }}
                >
                  <Stack spacing={4}>
                    <FormSelect
                      control={control}
                      name={`subscriptionPricing.${index}.billing.intervalDate`}
                      data={intervalDateMonths}
                    />
                    <Text size="xs" color="red">
                      {
                        subscriptionPricingErrors[
                          `subscriptionPricing.${index}.billing.intervalDate`
                        ]
                      }
                    </Text>
                  </Stack>
                </Box>
              </Group>
            </Box>
            <td>
              <Box
                sx={{
                  width: "90px",
                  position: "relative",
                }}
              >
                <Stack spacing={4} mt={-4}>
                  <FormInputNumber
                    control={control}
                    name={`subscriptionPricing.${index}.billing.price`}
                    placeholder="0.00"
                  />
                  <Text
                    size="xs"
                    color="red"
                    sx={{
                      position: "absolute",
                      width: "100px",
                      top: 45,
                    }}
                  >
                    {
                      subscriptionPricingErrors[
                        `subscriptionPricing.${index}.billing.price`
                      ]
                    }
                  </Text>
                </Stack>
              </Box>
            </td>
            <td>
              <Box
                sx={{
                  width: "90px",
                  position: "relative",
                }}
              >
                <Stack spacing={4} mt={-4}>
                  <FormInputNumber
                    control={control}
                    name={`subscriptionPricing.${index}.billing.trialDays`}
                    placeholder="0"
                  />
                  <Text
                    size="xs"
                    color="red"
                    sx={{
                      position: "absolute",
                      width: "125px",
                      top: 45,
                    }}
                  >
                    {
                      subscriptionPricingErrors[
                        `subscriptionPricing.${index}.billing.trialDays`
                      ]
                    }
                  </Text>
                </Stack>
              </Box>
            </td>
            <td>
              <Stack spacing={4}>
                <FormInput
                  control={control}
                  name={`subscriptionPricing.${index}.billing.description`}
                />
                <Text size="xs" color="red">
                  {
                    subscriptionPricingErrors[
                      `subscriptionPricing.${index}.billing.description`
                    ]
                  }
                </Text>
              </Stack>
            </td>
            <td>
              <Box
                sx={{
                  width: "100px",
                }}
              >
                <Stack spacing={4}>
                  <FormInputNumber
                    control={control}
                    name={`subscriptionPricing.${index}.billing.limit`}
                    placeholder="No limit"
                  />
                  <Text size="xs" color="red">
                    {
                      subscriptionPricingErrors[
                        `subscriptionPricing.${index}.billing.limit`
                      ]
                    }
                  </Text>
                </Stack>
              </Box>
            </td>
            <Box
              component="td"
              sx={{
                width: "120px",
              }}
            >
              <Group mt={-4}>
                <ActionIcon
                  {...attributes}
                  {...listeners}
                  sx={{
                    cursor: "grab",
                    "&:hover": {
                      background: "transparent",
                    },
                  }}
                >
                  <Text component="span" size={12}>
                    <FontAwesomeIcon icon="grip-dots-vertical" type="fas" />
                  </Text>
                </ActionIcon>
                <ActionIcon variant="filled" color="red.9" onClick={onDelete}>
                  <Text size={12}>
                    <FontAwesomeIcon icon="trash-alt" type="fas" />
                  </Text>
                </ActionIcon>
              </Group>
            </Box>
          </tr>
        </tbody>
      </Table>
      <Group
        mt={Object.keys(subscriptionPricingErrors).length > 0 ? 32 : 0}
        mb={4}
      >
        <FormSwitch
          name={`subscriptionPricing.${index}.fulfillSeparately`}
          control={control}
          size="xs"
        />
        <Text size={14}>Fulfill separately</Text>
      </Group>
      {watch(`subscriptionPricing.${index}.fulfillSeparately`) && (
        <Table>
          <thead>
            <tr>
              <th>Order Interval</th>
              <th>
                <Group>
                  <Text>Limit</Text>
                  <Tooltip
                    label="Optionally limit the number of orders created by this subscription plan"
                    withArrow
                    withinPortal
                    arrowSize={7}
                    offset={7}
                    position="top"
                    multiline
                    width={300}
                    openDelay={400}
                    styles={{
                      tooltip: {
                        fontSize: "13px",
                      },
                    }}
                  >
                    <Text size={13}>
                      <FontAwesomeIcon icon="question-circle" type="fas" />
                    </Text>
                  </Tooltip>
                </Group>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Box
                component="td"
                sx={{
                  width: "270px",
                }}
              >
                <Group spacing={8}>
                  <Text size={13}>Every</Text>
                  <Box
                    sx={{
                      width: "60px",
                      position: "relative",
                    }}
                  >
                    <Field
                      name={`subscriptionPricing.${index}.order.intervalQty`}
                      type="text"
                    >
                      {({ Errors }) => (
                        <>
                          <Stack spacing={4} mt={-4}>
                            <FormInputNumber
                              control={control}
                              name={`subscriptionPricing.${index}.order.intervalQty`}
                              placeholder="1"
                            />
                            <Text
                              size="xs"
                              color="red"
                              sx={{
                                position: "absolute",
                                width: "400px",
                                top: 45,
                              }}
                            >
                              {/* <Errors /> */}
                              {
                                subscriptionPricingErrors[
                                  `subscriptionPricing.${index}.order.intervalQty`
                                ]
                              }
                            </Text>
                          </Stack>
                        </>
                      )}
                    </Field>
                  </Box>
                  <Box
                    sx={{
                      width: "120px",
                    }}
                  >
                    <Field
                      name={`subscriptionPricing.${index}.order.intervalDate`}
                      type="text"
                    >
                      {({ Errors }) => (
                        <>
                          <Stack spacing={4}>
                            <FormSelect
                              control={control}
                              name={`subscriptionPricing.${index}.order.intervalDate`}
                              data={intervalDateMonths}
                            />
                            <Text size="xs" color="red">
                              {/* <Errors /> */}
                              {
                                subscriptionPricingErrors[
                                  `subscriptionPricing.${index}.order.intervalDate`
                                ]
                              }
                            </Text>
                          </Stack>
                        </>
                      )}
                    </Field>
                  </Box>
                </Group>
              </Box>
              <td>
                <Box
                  sx={{
                    width: "90px",
                  }}
                >
                  <Field
                    name={`subscriptionPricing.${index}.order.limit`}
                    type="text"
                  >
                    {({ Errors }) => (
                      <>
                        <Stack spacing={4}>
                          <FormInputNumber
                            control={control}
                            name={`subscriptionPricing.${index}.order.limit`}
                            placeholder="No limit"
                          />
                          <Text size="xs" color="red">
                            {/* <Errors /> */}
                            {
                              subscriptionPricingErrors[
                                `subscriptionPricing.${index}.order.limit`
                              ]
                            }
                          </Text>
                        </Stack>
                      </>
                    )}
                  </Field>
                </Box>
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </Stack>
  )
}

interface subscriptionPricingsProps {
  control: Control<any, any>
  formState: any
  flattenErrors: any
  Field: any
  setValue: any
  watch: UseFormWatch<any>
}

export function SubscriptionPricing({
  control,
  formState,
  flattenErrors,
  Field,
  setValue,
  watch,
}: subscriptionPricingsProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "subscriptionPricing",
  })
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: { y: 10 },
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = event => {
    const { active, over } = event
    const oldIndex = fields.findIndex(item => item.id === active.id)
    const newIndex = fields.findIndex(item => item.id === over.id)

    move(oldIndex, newIndex)
  }

  useEffect(() => {
    if (fields.length === 0) {
      append({
        billing: {
          intervalQty: "1",
          intervalDate: "month",
          price: "",
          trialDays: "0",
          description: "",
          limit: "",
        },
        fulfillSeparately: false,
        order: {
          intervalQty: "1",
          intervalDate: "month",
          limit: "",
        },
      })
    }

    return () => {
      setValue("subscriptionPricing", [])
    }
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[
        restrictToFirstScrollableAncestor,
        restrictToWindowEdges,
        restrictToVerticalAxis,
      ]}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragEnd={handleDragEnd}
    >
      {fields.length > 0 && (
        <Stack
          p={5}
          sx={{
            background: "#212529",
          }}
        >
          <SortableContext
            items={fields as any}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index: number) => {
              return (
                <Fragment key={field.id}>
                  <SubscriptionPricingItem
                    id={field.id}
                    index={index}
                    Field={Field}
                    formState={formState}
                    flattenErrors={flattenErrors}
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    onDelete={() => remove(index)}
                  />
                  {fields.length > 0 && index !== fields.length - 1 && (
                    <Divider my="xs" />
                  )}
                </Fragment>
              )
            })}
          </SortableContext>
        </Stack>
      )}
      <Button
        my={fields.length > 0 ? 20 : 10}
        onClick={() => {
          append({
            billing: {
              intervalQty: "1",
              intervalDate: "month",
              price: "",
              trialDays: "0",
              description: "",
              limit: "",
            },
            fulfillSeparately: false,
            order: {
              intervalQty: "1",
              intervalDate: "month",
              limit: "",
            },
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
        Add plan
      </Button>
    </DndContext>
  )
}
