import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LineChart, PanelLeft } from "lucide-react";
import { NAV_DATA } from "./nav-data";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <VisuallyHidden.Root>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden.Root>

        <nav className="grid gap-6 text-lg font-medium">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 text-lg font-semibold text-slate-50 dark:bg-slate-50 dark:text-slate-900 md:text-base"
              >
                <NAV_DATA.appLogo className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">{NAV_DATA.appLabel}</span>
              </Link>
            </TooltipTrigger>

            <TooltipContent side="right">{NAV_DATA.appLabel}</TooltipContent>
          </Tooltip>
          {NAV_DATA.navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-4 px-2.5 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          <Link
            href={"/settings"}
            className="flex items-center gap-4 px-2.5 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
