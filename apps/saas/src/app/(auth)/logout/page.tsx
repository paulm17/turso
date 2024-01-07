import { redirect } from "next/navigation";
import { getPageSession } from "@golfcart/auth";
import { clearSession } from "./actions";

async function Logout() {
  const session = await getPageSession();

  if (session) {
    clearSession();
  } else {
    redirect("/login");
  }

  return <>Signed out, click here to redirect...</>;
}

export default Logout;
