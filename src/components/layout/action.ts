"use server";

import { signOut } from "@/server/auth";

export async function onSignout() {
  await signOut();
}
