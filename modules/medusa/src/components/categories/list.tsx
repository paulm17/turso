import { useEffect, useRef, useState } from "react"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { FontAwesomeIcon, SortableTree, TreeItem } from "@golfcart/ui"
import {
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import getCategories from "../../queries/getCategories"
import updateCategory from "../../mutations/updateCategory"
import { flatten, nestedCategories } from "./utils"

function CategoriesList() {
  const isMounted = useRef(false)
  const router = useRouter()
  const [oldTreeData, setOldTreeData] = useState<TreeItem[]>([])
  const [treeData, setTreeData] = useState<TreeItem[]>([])
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [data] = useQuery(
    getCategories,
    { storeId: "01GZKFVZZ1HNEVN70YNV7M7D16" },
    {
      suspense: false,
      staleTime: Infinity,
    },
  )
  const [updateMutation] = useMutation(updateCategory)

  const revertTree = () => {
    setTreeData(oldTreeData)
    setDirty(false)
  }

  const saveTreeChanges = async () => {
    setSaving(true)

    const saved = flatten(treeData)
    const dataOnlyIds =
      data &&
      data.map(item => {
        return {
          id: item.id,
          parentId: item.parentId,
        }
      })

    const diff = [] as { id: string; parentId: string }[]

    saved.forEach(newItem => {
      const prevItemIndex = dataOnlyIds!.findIndex(
        prevItem => prevItem.id === newItem.id,
      )

      if (
        prevItemIndex === -1 ||
        (dataOnlyIds &&
          dataOnlyIds[prevItemIndex]?.parentId !== newItem.parentId)
      ) {
        diff.push(newItem)
      }
    })

    const updateData = {
      data: diff,
      storeId: "01GZKFVZZ1HNEVN70YNV7M7D16",
    }

    await updateMutation(updateData)

    setSaving(false)
    setDirty(false)
    setOldTreeData(treeData)
  }

  useEffect(() => {
    if (data !== undefined) {
      const tree = nestedCategories(data)

      setTreeData(tree)
      setOldTreeData(tree)
    }
  }, [data])

  useEffect(() => {
    isMounted.current = true
  }, [])

  return (
    <Container>
      <Card
        shadow="sm"
        mt={40}
        p="lg"
        w={{ base: "800px" }}
        radius="md"
        withBorder
      >
        <Card.Section>
          <Group position="apart" mt="xs" ml="md" mr="md">
            <Title order={3}>Categories</Title>
            {data !== undefined && (
              <Group>
                <Button
                  size="xs"
                  disabled={dirty}
                  onClick={() => router.push("categories/new")}
                >
                  New Category
                </Button>
                {dirty && (
                  <>
                    <Button
                      disabled={saving}
                      size="xs"
                      color="blue"
                      onClick={revertTree}
                    >
                      Revert
                    </Button>
                    <Button
                      loading={saving}
                      size="xs"
                      color="green"
                      onClick={saveTreeChanges}
                    >
                      Save
                    </Button>
                  </>
                )}
              </Group>
            )}
          </Group>
          <Divider my="sm" />
        </Card.Section>
        <Card.Section p="md" pt={0}>
          {data === undefined ||
            (data !== undefined && data.length === 0 && (
              <Stack>
                <Center>
                  <Text size={70}>
                    <FontAwesomeIcon icon="sitemap" type="far" />
                  </Text>
                </Center>
                <Center>
                  <Title order={4}>Add Categories</Title>
                </Center>
                <Center>
                  <Text size={12}>
                    Get started by adding your first categories
                  </Text>
                </Center>
                <Center>
                  <Button onClick={() => router.push("categories/new")}>
                    Create Category
                  </Button>
                </Center>
              </Stack>
            ))}
          {data !== undefined && (
            <SortableTree
              items={treeData}
              onChange={setTreeData}
              setDirty={setDirty}
            />
          )}
        </Card.Section>
      </Card>
    </Container>
  )
}

export default CategoriesList
