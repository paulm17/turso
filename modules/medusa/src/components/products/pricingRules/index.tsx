import { useEffect } from "react"
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
  ActionIcon,
  Box,
  Button,
  Group,
  Stack,
  Table,
  Text,
} from "@mantine/core"
import { Control, useFieldArray, UseFormWatch } from "react-hook-form"
import { FontAwesomeIcon, FormInputNumber } from "@golfcart/ui"

interface pricingRuleItemProps {
  index: number
  id: string
  Field: any
  control: Control<any, any>
  formState: any
  flattenErrors: any
  onDelete: any
  setValue: any
  watch: UseFormWatch<any>
}

function PricingRuleItem({
  index,
  id,
  Field,
  control,
  formState,
  flattenErrors,
  onDelete,
  setValue,
}: pricingRuleItemProps) {
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

  const pricingErrors = flattenErrors(formState.errors, "standardPricing")

  return (
    <Box component="tr" ref={setNodeRef} style={style}>
      <td>
        <Stack spacing={4}>
          <FormInputNumber
            control={control}
            name={`standardPricing.priceRules.${index}.price`}
            placeholder="0.00"
            decimalScale={2}
          />
          <Text size="xs" color="red">
            <span>
              {pricingErrors[`standardPricing.priceRules.${index}.price`]}
              &nbsp;
            </span>
          </Text>
        </Stack>
      </td>
      <td>
        <Stack spacing={4}>
          <FormInputNumber
            control={control}
            name={`standardPricing.priceRules.${index}.minQty`}
            placeholder="1"
          />
          <Text size="xs" color="red">
            <span>
              {pricingErrors[`standardPricing.priceRules.${index}.minQty`]}
              &nbsp;
            </span>
          </Text>
        </Stack>
      </td>
      <td>
        <Stack spacing={4}>
          <FormInputNumber
            control={control}
            name={`standardPricing.priceRules.${index}.maxQty`}
            placeholder="1"
          />
          <Text size="xs" color="red">
            <span>
              {pricingErrors[`standardPricing.priceRules.${index}.maxQty`]}
              &nbsp;
            </span>
          </Text>
        </Stack>
      </td>
      <Box component="td">
        <Group mt={-23}>
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
    </Box>
  )
}

interface pricingRulesProps {
  Field: any
  control: Control<any, any>
  formState: any
  flattenErrors: any
  setValue: any
  watch: UseFormWatch<any>
}

export function PricingRules({
  Field,
  control,
  formState,
  flattenErrors,
  setValue,
  watch,
}: pricingRulesProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "standardPricing.priceRules",
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
    return () => {
      setValue("standardPricing.listPrice", "")
      setValue("standardPricing.salePrice", "")
      setValue("standardPricing.showSalePrice", false)
      setValue("standardPricing.priceRules", [])
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
          <Table>
            <thead>
              <tr>
                <th>Price</th>
                <th>Min. Qty</th>
                <th>Max. Qty</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={fields as any}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, index: number) => {
                  return (
                    <PricingRuleItem
                      key={field.id}
                      id={field.id}
                      index={index}
                      Field={Field}
                      control={control}
                      formState={formState}
                      flattenErrors={flattenErrors}
                      setValue={setValue}
                      watch={watch}
                      onDelete={() => remove(index)}
                    />
                  )
                })}
              </SortableContext>
            </tbody>
          </Table>
        </Stack>
      )}
      <Button
        my={10}
        onClick={() => {
          append({})
        }}
        compact
        color="gray"
        styles={{
          root: {
            width: "135px",
          },
        }}
      >
        Add price rule
      </Button>
    </DndContext>
  )
}
