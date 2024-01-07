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
import LoginForm from "./form";

function ForgotPasswordLink() {
  return (
    <Center>
      <Link href="/forgotPassword">
        <Text color="gray.7" size="sm" className="cursor-pointer">
          Forgot your password?
        </Text>
      </Link>
    </Center>
  );
}

function SignUpLink() {
  return (
    <Center>
      <Link href="/signup">
        <Text color="gray.7" size="sm" className="cursor-pointer">
          or sign up
        </Text>
      </Link>
    </Center>
  );
}

async function Login() {
  const session = await getPageSession();

  if (session) {
    redirect("/");
  }

  return (
    <Center style={{ width: "100%", height: "100vh" }}>
      <Container>
        <Group grow>
          <Box className="h-[300px] w-[350px]">
            <Image
              src="https://images.unsplash.com/photo-1602610411365-76e8c2a88e18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=forNamemat&fit=crop&w=333&q=80"
              alt="Login"
              width={350}
              height={400}
            />
          </Box>
          <Stack>
            <Stack gap={10} mb="sm">
              <Title order={2}>[Project]</Title>
              <Divider />
            </Stack>
            <Stack gap={0} mb="sm">
              <Text>Welcome back!</Text>
            </Stack>
            <Stack gap={0} mb="sm">
              <LoginForm
                forgotPasswordLink={<ForgotPasswordLink />}
                signUpLink={<SignUpLink />}
              />
            </Stack>
          </Stack>
        </Group>
      </Container>
    </Center>
  );
}

export default Login;
