import { useEffect } from "react"
import { useRouter } from "next/router"
import {
  AppShell,
  Box,
  Divider,
  Group,
  Image,
  Navbar,
  NavLink,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core"
import { useToggle } from "@mantine/hooks"
//import LoadingScreen from "./components/loadingScreen"
import { FontAwesomeIcon, RegularIcons } from "@golfcart/ui"
// import { useStore } from "../visualBuilder/src/store"

interface navGroupProps {
  item: Link
}

function NavGroup({ item }: navGroupProps) {
  const router = useRouter()
  const [open, toggle] = useToggle([false, true])
  const url = router.pathname.substring(1).split("/")[1] || "home"

  const onToggle = (e: React.MouseEvent) => {
    e.stopPropagation()

    toggle()
  }

  useEffect(() => {
    if (url === item.href) {
      toggle(true)
    }
  }, [url])

  return (
    <>
      <NavLink
        label={item.label}
        active={url === item.href}
        icon={item.icon && <FontAwesomeIcon icon={item.icon} />}
        onClick={() => router.push(`/medusa/${item.href}`)}
        rightSection={
          <UnstyledButton component="div" onClick={e => onToggle(e)}>
            <Text size={14}>
              <FontAwesomeIcon icon={!open ? "chevron-up" : "chevron-down"} />
            </Text>
          </UnstyledButton>
        }
        styles={{
          root: {
            "&[data-active]": {
              background: "#36393f",
              color: "#C1C2C5",
              "&:hover": {
                background: "#36393f",
                color: "#C1C2C5",
              },
            },
          },
          icon: {
            width: "25px",
          },
        }}
      />
      {open && (
        <Stack spacing={0}>
          {item.items &&
            item.items.map(item => {
              return <NavItem key={item.id} isChild={true} item={item} />
            })}
        </Stack>
      )}
    </>
  )
}

interface navItemProps {
  item: Link
  isChild?: boolean
}

function NavItem({ item, isChild }: navItemProps) {
  const router = useRouter()
  const url = router.pathname.substring(1).split("/")[1] || "home"

  return (
    <>
      {item.items === undefined && (
        <NavLink
          active={url === item.href}
          label={item.label}
          onClick={() => router.push(`/medusa/${item.href}`)}
          icon={item.icon && <FontAwesomeIcon icon={item.icon} />}
          styles={{
            root: {
              paddingLeft: isChild ? "52px" : undefined,
            },
            icon: {
              width: "25px",
            },
          }}
        />
      )}
      {item.items !== undefined && <NavGroup item={item} />}
    </>
  )
}

type Link = {
  id: string
  href?: string
  label: string
  icon?: RegularIcons
  items?: Link[]
}

function Sidebar({ children }) {
  // const store = useSnapshot(useStore)
  const theme = useMantineTheme()

  const links: Link[] = [
    { id: "home", href: "home", label: "Home", icon: "home" },
    { id: "orders", href: "orders", label: "Orders", icon: "cart-shopping" },
    {
      id: "products-group",
      href: "products",
      label: "Products",
      icon: "tag",
      items: [
        {
          id: "products",
          href: "products",
          label: "All Products",
        },
        {
          id: "categories",
          href: "categories",
          label: "Categories",
        },
        {
          id: "attributes",
          href: "attributes",
          label: "Attributes",
        },
      ],
    },
    {
      id: "customers",
      href: "customers",
      label: "Customers",
      icon: "user-vneck-hair-long",
    },
    {
      id: "discounts-group",
      href: "coupons",
      label: "Discounts",
      icon: "badge-percent",
      items: [
        {
          id: "coupons",
          href: "coupons",
          label: "Coupons",
        },
        {
          id: "promotions",
          href: "promotions",
          label: "Promotions",
        },
      ],
    },
    { id: "giftcards", href: "giftcards", label: "Gift Cards", icon: "gift" },
    {
      id: "pricing",
      href: "pricing",
      label: "Pricing",
      icon: "circle-dollar",
    },
    { id: "settings", href: "settings", label: "Settings", icon: "cogs" },
  ]

  // useEffect(() => {
  //   let checker = (arr, target) => target.every(v => arr.includes(v))

  //   subscribeKey(useStore.ux.loadedState, "milestones", v => {
  //     if (checker(v, ["initChatData", "firstChannelMessages"])) {
  //       setDataLoaded(true)
  //     }
  //   })
  // }, [])

  /*useEffect(() => {
    if (dataLoaded) {
    }
  }, [dataLoaded, store])*/

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === "dark" ? "#36393f" : "#36393f",
          paddingTop: "calc(var(--mantine-header-height, 0px) + 0px)",
          paddingBottom: "calc(var(--mantine-footer-height, 0px) + 0px)",
          paddingLeft: "calc(var(--mantine-navbar-width, 0px) + 0px)",
          paddingRight: "calc(var(--mantine-aside-width, 0px) + 0px)",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "auto",
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          hiddenBreakpoint="sm"
          width={{ base: 200 }}
          withBorder={false}
          zIndex={99}
          sx={{
            background: "#404040",
            border: "1px solid #333333",
            borderTop: 0,
            borderLeft: 0,
            borderBottom: 0,
            userSelect: "none",
          }}
        >
          <Navbar.Section mt="xs" mx="xs">
            <Group>
              <Box style={{ width: "35px" }}>
                <Image
                  radius="md"
                  src="/images/app/common/logo/ecomzilla_sm_logo.png"
                  alt="Ecomzilla logo"
                />
              </Box>
              <Title order={5}>Medusa</Title>
            </Group>
          </Navbar.Section>
          <Navbar.Section grow>
            <Divider color="#333333" mt="xs" mb={2} />
            <>
              {links.map(item => {
                return <NavItem key={item.id} item={item} />
              })}
            </>
          </Navbar.Section>
        </Navbar>
      }
    >
      {children}
    </AppShell>
  )
}

export { Sidebar }
