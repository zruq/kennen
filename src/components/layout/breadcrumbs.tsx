import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link, { type LinkProps } from "next/link";
import { Fragment } from "react/jsx-runtime";

type BreadcrumbsProps = {
  breadcrumbs: {
    id: string | number;
    label: string;
    href: LinkProps["href"];
  }[];
};
export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <Fragment key={item.id}>
            {index < breadcrumbs.length - 1 ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
