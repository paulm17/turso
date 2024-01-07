"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@golfcart/auth";
import { Login } from "./validation";

type Inputs = z.infer<typeof Login>;

export async function onSubmit(values: Inputs) {
  try {
    const key = await auth.useKey(
      "email",
      values.email.toLowerCase(),
      values.password,
    );
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest({
      request: null,
      cookies,
    });
    authRequest.setSession(session);

    return session;
  } catch (error: any) {
    console.log(error);
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
