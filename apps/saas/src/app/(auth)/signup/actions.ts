"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@golfcart/auth";
import { Signup } from "./validation";

type Inputs = z.infer<typeof Signup>;

export async function onSubmit(values: Inputs) {
  try {
    const user = await auth.createUser({
      key: {
        providerId: "email", // auth method
        providerUserId: values.email.toLowerCase(), // unique id when using "username" auth method
        password: values.password, // hashed by Lucia
      },
      attributes: {
        emailAddress: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        companyName: values.companyName,
      },
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest({
      request: null,
      cookies,
    });

    authRequest.setSession(session);

    return session;
  } catch (error: any) {
    console.log("error", error);
    // if (error instanceof AuthenticationError) {
    //   return { [FORM_ERROR]: "Sorry, those credentials are invalid" };
    // } else {
    //   return {
    //     [FORM_ERROR]:
    //       "Sorry, we had an unexpected error. Please try again. - " +
    //       error.toString(),
    //   };
    // }
    return false;
  }
}
