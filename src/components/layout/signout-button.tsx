"use client";

import React from "react";
import { onSignout } from "./action";

function SignoutButton() {
  return (
    <button
      className="relative flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent"
      onClick={onSignout}
    >
      Logout
    </button>
  );
}

export default SignoutButton;
