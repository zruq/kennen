import {
  DicesIcon,
  DraftingCompassIcon,
  Home,
  LibraryIcon,
} from "lucide-react";
import type { LinkProps } from "next/link";

type NavItem = {
  id: number;
  label: string;
  icon: typeof Home;
  href: LinkProps["href"];
};
const NAV_ITEMS: NavItem[] = [
  {
    id: 1,
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    id: 2,
    label: "Games",
    icon: DicesIcon,
    href: "/games",
  },
  {
    id: 3,
    label: "Question Collections",
    icon: LibraryIcon,
    href: "/collections",
  },
];

export const NAV_DATA = {
  appLabel: "kennen",
  appLogo: DraftingCompassIcon,
  navItems: NAV_ITEMS,
};
