import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/react";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TRPCReactProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </TRPCReactProvider>
  );
}
