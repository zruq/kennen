import type { ComponentProps, ReactNode } from "react";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";
import UserDropdown from "./user-dropdown";
import Breadcrumbs from "./breadcrumbs";
import Search from "./search";

type LayoutProps = {
  children: ReactNode;
  breadcrumbsProps: ComponentProps<typeof Breadcrumbs>;
};

export default function Layout({ children, breadcrumbsProps }: LayoutProps) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-slate-100/40 dark:bg-slate-800/40">
      <DesktopNav />
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 dark:bg-slate-950 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <MobileNav />
          <Breadcrumbs {...breadcrumbsProps} />
          <Search />
          <UserDropdown />
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
      </div>
    </div>
  );
}
