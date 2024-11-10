import { Settings } from "lucide-react";
import { NAV_DATA } from "./nav-data";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-white dark:bg-slate-950 sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 text-lg font-semibold text-slate-50 dark:bg-slate-50 dark:text-slate-900 md:h-8 md:w-8 md:text-base"
            >
              <NAV_DATA.appLogo className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">{NAV_DATA.appLabel}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{NAV_DATA.appLabel}</TooltipContent>
        </Tooltip>
        {NAV_DATA.navItems.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50 md:h-8 md:w-8"
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={"/settings"}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50 md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
