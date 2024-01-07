"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Stack, Text } from "@raikou/server";
import { Icon } from "@golfcart/fontawesomeicon";
import { Form, MantineFormButton, MantineFormInput } from "@golfcart/form";
import { onSubmit } from "./actions";
import { Signup } from "./validation";

interface signupProps {
  signupLink: ReactNode;
}

function SignupForm({ signupLink }: signupProps) {
  const router = useRouter();

  return (
    <Form
      inputComponent={MantineFormInput}
      buttonComponent={MantineFormButton as any}
      // errorComponent={MantineErrorInput}
      schema={Signup}
      onSubmit={async (values) => {
        try {
          const result = await onSubmit(values);

          if (!result) {
            console.log("something went wrong");
            return;
          }

          router.push("/");
        } catch (error: any) {
          // if (error.code === "P2002" && error.meta?.target?.includes("email")) {
          //   // This error comes from Prisma
          //   return { email: "This email is already being used" }
          // } else {
          //   return { [FORM_ERROR]: error.toString() }
          // }
        }
      }}
    >
      {({ Field, Errors, Button, formState }) => (
        <>
          <Stack spacing={0} mb="sm">
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
          <Stack spacing={0} mb="sm">
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
          <Stack spacing={0} mb="sm">
            <Field name="firstName" type="text">
              {({ SmartInput, Errors }) => (
                <>
                  <SmartInput placeholder="First Name" />
                  <Text color="red.6" size="xs">
                    <Errors />
                  </Text>
                </>
              )}
            </Field>
          </Stack>
          <Stack spacing={0} mb="sm">
            <Field name="lastName" type="text">
              {({ SmartInput, Errors }) => (
                <>
                  <SmartInput placeholder="Last Name" />
                  <Text color="red.6" size="xs">
                    <Errors />
                  </Text>
                </>
              )}
            </Field>
          </Stack>
          <Stack spacing={0} mb="sm">
            <Field name="companyName" type="text">
              {({ SmartInput, Errors }) => (
                <>
                  <SmartInput placeholder="Company Name" />
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
          <Stack spacing={10} mb="xs">
            <Button
              fullWidth
              color="green"
              type="submit"
              leftSection={<Icon icon="save" type="far" />}
              loading={formState.isSubmitting}
            >
              Create Account
            </Button>
          </Stack>
          <Stack spacing={0}>{signupLink}</Stack>
        </>
      )}
    </Form>
  );
}
export default SignupForm;
