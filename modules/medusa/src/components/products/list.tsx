import { useMemo, useState } from "react"
import { useQuery, useMutation, invalidateQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Group,
  Divider,
  Text,
  Title,
} from "@mantine/core"
import { useDidUpdate, useDisclosure } from "@mantine/hooks"
import { DateTime } from "luxon"
import { toast } from "react-toastify"
import { DataTable } from "mantine-datatable"
import { Dialog, FontAwesomeIcon } from "@golfcart/ui"
import { ucWords } from "@golfcart/common"
import getProducts from "../../queries/getProducts"

const PAGE_SIZES = [10, 25, 50, 100]

interface deleteModalProps {
  opened: boolean
  selectedRecords: any[]
  onClose: () => void
}

// function DeleteModal({ opened, selectedRecords, onClose }: deleteModalProps) {
//   // const [deleteMutation] = useMutation(deleteList)

//   // const dialogText = useMemo(() => {
//   //   let text = selectedRecords.length === 1 ? "record" : "records"

//   //   return `Deleting ${selectedRecords.length} ${text}, do you wish to proceed...?`
//   // }, [selectedRecords.length])

//   // const myPromise = async () => {
//   //   try {
//   //     const selectedItems = selectedRecords.map((item) => item.id)

//   //     await deleteMutation({
//   //       ids: selectedItems,
//   //     })

//   //     await invalidateQuery(getList)

//   //     onClose()
//   //   } catch (error) {
//   //     throw error
//   //   }
//   // }

//   // const onDelete = () => {
//   //   toast.promise(myPromise(), {
//   //     pending: {
//   //       render() {
//   //         return `Deleting ${selectedRecords.length === 1 ? "Record" : "Records"}, please wait`
//   //       },
//   //       icon: () => <FontAwesomeIcon icon="clock" />,
//   //     },
//   //     success: {
//   //       render() {
//   //         return `${selectedRecords.length} ${
//   //           selectedRecords.length === 1 ? "Record" : "Records"
//   //         } deleted!`
//   //       },
//   //       icon: () => <FontAwesomeIcon icon="check" />,
//   //     },
//   //     error: {
//   //       render({ data }) {
//   //         return <>{data.message}</>
//   //       },
//   //     },
//   //   })
//   // }

//   // return (
//   //   <Dialog
//   //     opened={opened}
//   //     icon="trash-alt"
//   //     title="Delete"
//   //     subTitle={dialogText}
//   //     actionButton={
//   //       <Button
//   //         onClick={onDelete}
//   //         color="red"
//   //         leftIcon={<FontAwesomeIcon icon="trash-alt" />}
//   //         sx={{
//   //           width: "50%",
//   //           borderRadius: 0,
//   //         }}
//   //       >
//   //         Delete
//   //       </Button>
//   //     }
//   //     onClose={onClose}
//   //   />
//   // )
// }

function GiftCardsList() {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]!)
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  const [selectedButtonRecords, setSelectedButtonRecords] = useState<any[]>([])
  const [opened, handlers] = useDisclosure(false)
  const [query, { isFetching }] = useQuery(
    getProducts,
    {
      skip: (page - 1) * pageSize,
      take: pageSize,
      storeId: "01GZKFVZZ1HNEVN70YNV7M7D16",
    },
    {
      enabled: true,
      suspense: false,
      staleTime: Infinity,
    },
  )

  const deleteList = (list: any) => {
    setSelectedButtonRecords(prev => [...prev, list])
    handlers.open()
  }

  const filteredRecords = [
    ...new Set(
      [...selectedRecords, ...selectedButtonRecords].map(item => item),
    ),
  ]

  console.log(query)

  return (
    <Container mt={20}>
      <Card shadow="sm" p="lg" w={{ base: "1000px" }} radius="md" withBorder>
        <Card.Section>
          <Group position="apart" mt="xs" ml="md" mr="md">
            <Title order={3}>Products</Title>
            <Button size="xs" onClick={() => router.push("products/new")}>
              New Product
            </Button>
          </Group>
          <Divider my="sm" />
        </Card.Section>
        <Card.Section p="md" pt="xs">
          <DataTable
            withBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
            minHeight={500}
            fetching={isFetching}
            totalRecords={query?.count}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={p => router.push({ query: { page: p } })}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            records={query?.result}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            noRecordsText="No products found"
            columns={[
              { accessor: "name" },
              {
                accessor: "createdAt",
                title: "Created At",
                width: 140,
                render: row => (
                  <>
                    {DateTime.fromJSDate(row.createdAt).toFormat(
                      "LLL dd, yyyy",
                    )}
                  </>
                ),
              },
              {
                accessor: "actions",
                title: "",
                width: 110,
                render: list => (
                  <Group spacing={8} position="right" noWrap>
                    <ActionIcon
                      color="blue"
                      // onClick={() => edit(list)}
                      variant="filled"
                    >
                      <FontAwesomeIcon icon="pencil" type="fas" />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      // onClick={() => deleteList(list)}
                      variant="filled"
                    >
                      <FontAwesomeIcon icon="trash-alt" type="fas" />
                    </ActionIcon>
                  </Group>
                ),
              },
            ]}
            idAccessor="id"
            loadingText="Loading..."
            paginationText={({ from, to, totalRecords }) => (
              <Group>
                <Box>
                  {from} - {to} of {totalRecords}
                </Box>
                {selectedRecords.length > 0 && (
                  <Group>
                    <Text>|</Text>
                    <Button compact color="red" onClick={() => handlers.open()}>
                      <Text size={11}>
                        {`Delete ${selectedRecords.length} ${
                          selectedRecords.length === 1 ? " record" : " records"
                        }`}
                      </Text>
                    </Button>
                  </Group>
                )}
              </Group>
            )}
          />
          {/* <DeleteModal
            opened={opened}
            selectedRecords={filteredRecords}
            onClose={handlers.close}
          /> */}
        </Card.Section>
      </Card>
    </Container>
  )
}

export default GiftCardsList
