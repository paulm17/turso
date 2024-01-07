"use client";

import { redirect, usePathname } from "next/navigation";

interface providerProps {
  session: any;
  children: React.ReactNode;
}

function Provider({ session, children }: providerProps) {
  const pathName = usePathname();
  const path = pathName.split("/")[1]!;

  if (session && ["login", "signup"].includes(path)) {
    redirect("/");
  } else if (!session && !["login", "signup", "logout"].includes(path)) {
    redirect("/login");
  }

  return <>{children}</>;
}

export default Provider;
