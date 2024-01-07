"use client";

import { ReactNode, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Divider, Stack, Text } from "@raikou/server";
import { Icon } from "@golfcart/fontawesomeicon";
import { Form, MantineFormButton, MantineFormInput } from "@golfcart/form";
import { onSubmit } from "./actions";
import { Login } from "./validation";

interface loginProps {
  forgotPasswordLink: ReactNode;
  signUpLink: ReactNode;
}

function LoginForm({ forgotPasswordLink, signUpLink }: loginProps) {
  const router = useRouter();

  return (
    <Form
      inputComponent={MantineFormInput}
      buttonComponent={MantineFormButton as any}
      schema={Login}
      onSubmit={async (values) => {
        const result = await onSubmit(values);

        if (!result) {
          console.log("something went wrong");
          return;
        }

        router.push("/");
      }}
    >
      {/* @ts-ignore */}
      {({ Field, Errors, Button, formState }) => (
        <>
          <Stack gap={0} mb="sm">
            <Field name="email" type="text">
              {({ SmartInput, Errors }) => (
                <>
                  <SmartInput placeholder="Email Address" />
                  <Text color="red.6" size="xs">
                    <Errors />
                  </Text>
                </>
              )}
            </Field>
          </Stack>
          <Stack gap={0} mb="sm">
            <Field name="password" type="password">
              {({ SmartInput, Errors }) => (
                <>
                  <SmartInput placeholder="Password" />
                  <Text color="red.6" size="xs">
                    <Errors />
                  </Text>
                </>
              )}
            </Field>
          </Stack>
          {Errors !== "" && (
            <Text color="red.6" size="xs">
              <Errors />
            </Text>
          )}
          <Stack gap={0} mb="sm">
            {forgotPasswordLink}
          </Stack>
          <Stack gap={0} mb="sm">
            <Button
              fullWidth
              color="green"
              type="submit"
              leftSection={<Icon icon="save" type="far" />}
              loading={formState.isSubmitting}
            >
              Login
            </Button>
            <Divider />
          </Stack>
          <Stack gap={0}>{signUpLink}</Stack>
        </>
      )}
    </Form>
  );
}

export default LoginForm;
