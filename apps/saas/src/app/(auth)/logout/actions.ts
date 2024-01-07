"use server";

import { deleteSession } from "@golfcart/auth";

export async function clearSession() {
  await deleteSession();
}
