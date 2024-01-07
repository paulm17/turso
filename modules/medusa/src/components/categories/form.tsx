import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import {
  Autocomplete,
  Box,
  Card,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { Control, Controller, UseFormWatch } from "react-hook-form"
import {
  Form,
  FormDescription,
  MantineFormInput,
  MantineFormButton,
  FormProps2,
  FormSwitch,
  FontAwesomeIcon,
  RegularIcons,
  DropZone,
} from "@golfcart/ui"
import getCategories from "../../queries/getCategories"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"
import { z } from "zod"

function ParentCategory({ control }: controlProps) {
  return (
    <Controller
      control={control}
      name="parentCategoryId"
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          value={value}
          onChange={onChange}
          nothingFound={"No category found"}
          data={[]}
        />
      )}
      defaultValue=""
    />
  )
}

interface controlProps {
  control: Control<any, any>
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

export function CategoriesForm<S extends z.ZodType<any, any>>(
  props: FormProps2<S>,
) {
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

  const onDrop = (files: any) => {
    console.log(files)
  }

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
            {({ Field, Errors, Button, formState, control, watch }) => (
              <>
                <Stack p="md">
                  <Stack>
                    <Field name="name" type="text">
                      {({ Label, SmartInput, Errors }) => (
                        <>
                          <Stack spacing={4}>
                            <Box>
                              <Label>Name</Label>
                            </Box>
                            <SmartInput autoComplete="off" placeholder="Name" />
                            <Text size="xs" color="red">
                              <Errors />
                            </Text>
                          </Stack>
                        </>
                      )}
                    </Field>
                    <Field name="enabled" type="text">
                      {({ Errors }) => (
                        <>
                          <Stack spacing={4}>
                            <Group>
                              <FormSwitch name="enabled" control={control} />
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
                                content={`An active category is visible to customers`}
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
                    <Field name="parentId" type="text">
                      {({ Label, Errors }) => (
                        <>
                          <Stack spacing={4}>
                            <Box>
                              <Label>Parent Category</Label>
                            </Box>
                            <ParentCategory control={control} />
                            <Text size="xs" color="red">
                              <Errors />
                            </Text>
                          </Stack>
                        </>
                      )}
                    </Field>
                    <Field name="imageId" type="text">
                      {({ Label, Errors }) => (
                        <>
                          <Stack spacing={4}>
                            <Box>
                              <Label>Image</Label>
                            </Box>
                            <DropZone onDrop={onDrop} title="Add images" />
                            <Text size="xs" color="red">
                              <Errors />
                            </Text>
                          </Stack>
                        </>
                      )}
                    </Field>
                    <Field name="description" type="text">
                      {({ Label, Errors }) => (
                        <>
                          <Stack spacing={4}>
                            <Box>
                              <Label>Description</Label>
                            </Box>
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
                    <Field name="title" type="text">
                      {({ Label, SmartInput, Errors }) => (
                        <>
                          <Stack spacing={4}>
                            <Group spacing={6}>
                              <Label>Page Title</Label>
                              <Text size={12}>({titleLength} of 70 chars)</Text>
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
                              <Label>Meta description</Label>
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
                              <Label>URL name</Label>
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
                    <Errors />
                  </Stack>
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
                  setTitleLength={setTitleLength}
                  setMetaDescriptionLength={setMetaDescriptionLength}
                />
              </>
            )}
          </Form>
        </Card.Section>
      </Card>
    </Container>
  )
}
