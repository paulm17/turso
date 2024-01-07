import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Box,
  Center,
  Container,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@raikou/server";
import { getPageSession } from "@golfcart/auth";
import SignupForm from "./form";

function SignupLink() {
  return (
    <Center>
      <Link href="/login">
        <Text color="gray.7" size="sm" className="cursor-pointer">
          or login
        </Text>
      </Link>
    </Center>
  );
}

async function Signup() {
  const session = await getPageSession();

  if (session) {
    redirect("/");
  }

  return (
    <Center style={{ width: "100%", height: "100vh" }}>
      <Container>
        <Group grow>
          <Image
            src="https://images.unsplash.com/photo-1602610411365-76e8c2a88e18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=forNamemat&fit=crop&w=333&q=80"
            alt="Login"
            fit="cover"
          />
          <Box>
            <Stack gap={10} mb="sm">
              <Title order={2}>[Project]</Title>
              <Divider />
            </Stack>
            <Stack gap={0} mb="sm">
              <Text>Start Your Amazing Journey Today!</Text>
            </Stack>
            <Stack gap={0} mb="sm">
              <SignupForm signupLink={<SignupLink />} />
            </Stack>
          </Box>
        </Group>
      </Container>
    </Center>
  );
}

export default Signup;
