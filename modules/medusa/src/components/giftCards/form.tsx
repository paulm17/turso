import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import {
  ActionIcon,
  Box,
  Button as MantineButton,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { useToggle } from "@mantine/hooks"
import { DatePickerInput, TimeInput } from "@mantine/dates"
import { Control, Controller, UseFormWatch } from "react-hook-form"
import { NumericFormat } from "react-number-format"
import {
  Form,
  MantineFormInput,
  MantineFormButton,
  FormProps2,
  FontAwesomeIcon,
  RegularIcons,
} from "@golfcart/ui"
import "react-tooltip/dist/react-tooltip.css"
import { z } from "zod"
import { genEndDate } from "./utils"
import { DateTime } from "luxon"

interface decimalInputProps {
  control: Control<any, any>
}

function DecimalInput({ control }: decimalInputProps) {
  return (
    <Controller
      control={control}
      name="balance"
      render={({ field: { onChange, value } }) => (
        <Box
          sx={{
            position: "relative",
          }}
        >
          <NumericFormat
            value={value}
            onValueChange={values => {
              const { floatValue } = values
              onChange(`${floatValue}`)
            }}
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator={true}
            allowNegative={false}
            // allowLeadingZeros={false}
            style={{
              height: "2.25rem",
              lineHeight: "calc(2.25rem - 0.125rem)",
              appearance: "none",
              resize: "none",
              boxSizing: "border-box",
              fontSize: "0.875rem",
              width: "100%",
              color: "#C1C2C5",
              display: "block",
              textAlign: "left",
              border: "0.0625rem solid #373A40",
              backgroundColor: "#25262b",
              transition: "border-color 100ms ease",
              minHeight: "2.25rem",
              paddingLeft: "calc(2.25rem / 3)",
              paddingRight: "calc(2.25rem / 3)",
              borderRadius: "0.25rem",
            }}
          />
        </Box>
      )}
      defaultValue=""
    />
  )
}

interface dateTimePickerProps {
  value: Date
  onChange: (value: Date) => void
  toggleExpiryDate: (value?: SetStateAction<boolean> | undefined) => void
  resetField: any
}

function DateTimePicker({
  value,
  onChange,
  toggleExpiryDate,
  resetField,
}: dateTimePickerProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string>("00:00")

  const splitTime = time => {
    const [hour, minute] = time.split(":")

    return [parseInt(hour), parseInt(minute)]
  }

  useEffect(() => {
    if (
      date === null &&
      DateTime.fromJSDate(value).invalidReason === "invalid input"
    ) {
      setDate(genEndDate())
    }
  }, [value, date])

  useEffect(() => {
    if (date !== null) {
      const pickerDate = DateTime.fromJSDate(date)
      const [hour, minute] = splitTime(time)

      const newDate = DateTime.fromObject({
        day: pickerDate.day,
        month: pickerDate.month,
        year: pickerDate.year,
        hour: hour,
        minute: minute,
        second: 0,
        millisecond: 0,
      })

      onChange(newDate.toJSDate())
    }
  }, [date, time])

  return (
    <Flex gap="xs">
      <Box sx={{ width: "calc(100% - 140px)" }}>
        <DatePickerInput
          value={date}
          onChange={setDate}
          styles={{
            icon: {
              cursor: "pointer",
              pointerEvents: "all",
            },
          }}
          icon={
            <ActionIcon
              variant="filled"
              color="gray.7"
              onClick={() => {
                toggleExpiryDate(false)
                resetField("expiresAt")
              }}
            >
              <Text size={14}>
                <FontAwesomeIcon icon="times" type="fas" />
              </Text>
            </ActionIcon>
          }
        />
      </Box>
      <Box sx={{ width: "140px" }}>
        <TimeInput
          ref={ref}
          value={time}
          onChange={e => setTime(e.currentTarget.value)}
          icon={
            <ActionIcon onClick={() => ref.current?.showPicker()}>
              <FontAwesomeIcon icon="clock" type="fas" />
            </ActionIcon>
          }
          styles={{
            icon: {
              cursor: "pointer",
              pointerEvents: "all",
            },
          }}
          mx="auto"
        />
      </Box>
    </Flex>
  )
}

interface expiryDateProps {
  control: Control<any, any>
  toggleExpiryDate: (value?: SetStateAction<boolean> | undefined) => void
  resetField: any
}

function ExpiryDate({
  control,
  toggleExpiryDate,
  resetField,
}: expiryDateProps) {
  return (
    <Controller
      control={control}
      name="expiresAt"
      render={({ field: { onChange, value } }) => (
        <DateTimePicker
          value={value}
          onChange={onChange}
          toggleExpiryDate={toggleExpiryDate}
          resetField={resetField}
        />
      )}
      defaultValue=""
    />
  )
}

interface formChangeProps {
  watch: UseFormWatch<any>
  disableFixes: (value?: SetStateAction<boolean> | undefined) => void
  toggleLabel: (value?: SetStateAction<boolean> | undefined) => void
}

function FormChange({ watch, disableFixes, toggleLabel }: formChangeProps) {
  const code = watch("code")

  useEffect(() => {
    if (code && code.length > 0) {
      disableFixes(true)
      toggleLabel(false)
    } else {
      disableFixes(false)
      toggleLabel(true)
    }
  }, [code])

  return <></>
}

export function GiftCardsForm<S extends z.ZodType<any, any>>(
  props: FormProps2<S>,
) {
  const [prefix, togglePrefix] = useToggle([false, true])
  const [postfix, togglePostfix] = useToggle([false, true])
  const [disable, disableFixes] = useToggle([false, true])
  const [label, toggleLabel] = useToggle([false, true])
  const [expiryDate, toggleExpiryDate] = useToggle([false, true])

  return (
    <Container mt={20}>
      <Card shadow="sm" p="lg" w={{ base: "800px" }} radius="md" withBorder>
        <Card.Section>
          <Group position="apart" mt="xs" ml="md" mr="md">
            <Title order={3}>{props.title}</Title>
          </Group>
          <Divider my="sm" />
        </Card.Section>
        <Card.Section p="md" pt={0}>
          <Form
            inputComponent={MantineFormInput}
            buttonComponent={MantineFormButton}
            schema={props.schema as any}
            values={props.initialValues}
            onSubmit={props.onSubmit}
          >
            {({
              Field,
              Errors,
              Button,
              formState,
              control,
              watch,
              setValue,
              resetField,
            }) => (
              <>
                <Stack p="md">
                  <Stack>
                    <Field name="code" type="text">
                      {({ Label, SmartInput, Errors }) => (
                        <>
                          <Stack spacing={4}>
                            <Box>
                              <Label>Code</Label>
                            </Box>
                            <SmartInput
                              autoComplete="off"
                              placeholder="BlackFriday-10 or XXXX-XXXX-XXXX-XXXX"
                            />
                            {label && (
                              <Text size={12}>
                                Leave blank to generate a unique gift card code
                              </Text>
                            )}
                            <Text size="xs" color="red">
                              <Errors />
                            </Text>
                          </Stack>
                        </>
                      )}
                    </Field>
                    <Errors />
                  </Stack>
                  <Stack>
                    <Field name="balance" type="text">
                      {({ Label, SmartInput, Errors }) => (
                        <>
                          <Stack spacing={4}>
                            <Box>
                              <Label>Balance</Label>
                            </Box>
                            <DecimalInput control={control} />
                            <Text size={12}>Must be £1 or more</Text>
                            <Text size="xs" color="red">
                              <Errors />
                            </Text>
                          </Stack>
                        </>
                      )}
                    </Field>
                    <Errors />
                  </Stack>
                  {!prefix && (
                    <MantineButton
                      onClick={() => {
                        togglePrefix()
                        setValue("prefixShown", true)
                      }}
                      disabled={disable}
                      compact
                      styles={{
                        root: {
                          fontSize: "14px",
                          width: "100px",
                          paddingLeft: 0,
                          paddingRight: 0,
                        },
                      }}
                    >
                      Add Prefix
                    </MantineButton>
                  )}
                  {prefix && (
                    <Stack>
                      <Field name="prefix" type="text">
                        {({ Label, SmartInput, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Box>
                                <Label>Prefix</Label>
                              </Box>
                              <SmartInput
                                autoComplete="off"
                                placeholder="Enter text"
                                styles={{
                                  icon: {
                                    cursor: "pointer",
                                    pointerEvents: "all",
                                  },
                                }}
                                icon={
                                  <ActionIcon
                                    variant="filled"
                                    color="gray.7"
                                    onClick={() => {
                                      togglePrefix(false)
                                      resetField("prefix")
                                      setValue("prefixShown", false)
                                    }}
                                  >
                                    <Text size={14}>
                                      <FontAwesomeIcon
                                        icon="times"
                                        type="fas"
                                      />
                                    </Text>
                                  </ActionIcon>
                                }
                              />
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                      <Errors />
                    </Stack>
                  )}
                  {!postfix && (
                    <MantineButton
                      onClick={() => {
                        togglePostfix()
                        setValue("postfixShown", true)
                      }}
                      disabled={disable}
                      compact
                      styles={{
                        root: {
                          fontSize: "14px",
                          width: "100px",
                          paddingLeft: 0,
                          paddingRight: 0,
                        },
                      }}
                    >
                      Add Postfix
                    </MantineButton>
                  )}
                  {postfix && (
                    <Stack>
                      <Field name="postfix" type="text">
                        {({ Label, SmartInput, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Box>
                                <Label>Postfix</Label>
                              </Box>
                              <SmartInput
                                autoComplete="off"
                                placeholder="Enter text"
                                styles={{
                                  icon: {
                                    cursor: "pointer",
                                    pointerEvents: "all",
                                  },
                                }}
                                icon={
                                  <ActionIcon
                                    variant="filled"
                                    color="gray.7"
                                    onClick={() => {
                                      togglePostfix(false)
                                      resetField("postfix")
                                      setValue("postfixShown", false)
                                    }}
                                  >
                                    <Text size={14}>
                                      <FontAwesomeIcon
                                        icon="times"
                                        type="fas"
                                      />
                                    </Text>
                                  </ActionIcon>
                                }
                              />
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                      <Errors />
                    </Stack>
                  )}
                  {!expiryDate && (
                    <MantineButton
                      onClick={() => toggleExpiryDate()}
                      compact
                      styles={{
                        root: {
                          fontSize: "14px",
                          width: "120px",
                          paddingLeft: 0,
                          paddingRight: 0,
                        },
                      }}
                    >
                      Set Expiry Date
                    </MantineButton>
                  )}
                  {expiryDate && (
                    <Stack>
                      <Field name="expiresAt" type="text">
                        {({ Label, Errors }) => (
                          <>
                            <Stack spacing={4}>
                              <Box>
                                <Label>Expiry Date</Label>
                              </Box>
                              <ExpiryDate
                                control={control}
                                toggleExpiryDate={toggleExpiryDate}
                                resetField={resetField}
                              />
                              <Text size="xs" color="red">
                                <Errors />
                              </Text>
                            </Stack>
                          </>
                        )}
                      </Field>
                      <Errors />
                    </Stack>
                  )}
                  <Group position="right">
                    <Button
                      color="gray"
                      type="button"
                      leftIcon={<FontAwesomeIcon icon="times" type="far" />}
                      disabled={formState.isSubmitting}
                      onClick={props.onCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="green"
                      type="submit"
                      leftIcon={
                        <FontAwesomeIcon
                          icon={props.submitIcon as RegularIcons}
                          type="far"
                        />
                      }
                      disabled={formState.isSubmitting}
                      loading={formState.isSubmitting}
                    >
                      {props.submitText}
                    </Button>
                  </Group>
                </Stack>
                <FormChange
                  watch={watch}
                  disableFixes={disableFixes}
                  toggleLabel={toggleLabel}
                />
              </>
            )}
          </Form>
        </Card.Section>
      </Card>
    </Container>
  )
}
