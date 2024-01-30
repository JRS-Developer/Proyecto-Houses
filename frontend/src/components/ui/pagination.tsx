"use client";
import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

function usePagination(
  props: {
    boundaryCount?: number;
    count?: number;
    defaultPage?: number;
    disabled?: boolean;
    page: number;
    siblingCount?: number;
    hideNextButton?: boolean;
    hidePrevButton?: boolean;
    showFirstButton?: boolean;
    showLastButton?: boolean;
  } = {
    page: 1,
  },
) {
  // keep default values in sync with @default tags in Pagination.propTypes
  const {
    boundaryCount = 1,
    count = 1,
    defaultPage = 1,
    disabled = false,
    hideNextButton = false,
    hidePrevButton = false,
    // onChange: handleChange,
    page: pageProp,
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1,
    page,
    ...other
  } = props;

  // https://dev.to/namirsab/comment/2050
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  );

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1,
    ),
    // Greater than startPages
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2,
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  // Basic list of items to render
  // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
  const itemList: (
    | "first"
    | "previous"
    | "start-ellipsis"
    | "end-ellipsis"
    | "end"
    | "last"
    | "next"
    | number
  )[] = [
    ...(showFirstButton ? ["first" as const] : []),
    ...(hidePrevButton ? [] : ["previous" as const]),
    ...startPages,

    // Start ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsStart > boundaryCount + 2
      ? ["start-ellipsis" as const]
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsEnd < count - boundaryCount - 1
      ? ["end-ellipsis" as const]
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),

    ...endPages,
    ...(hideNextButton ? [] : ["next" as const]),
    ...(showLastButton ? ["last" as const] : []),
  ];

  // Map the button type to its page number
  const buttonPage = (type: (typeof itemList)[number]) => {
    switch (type) {
      case "first":
        return 1;
      case "previous":
        return page - 1;
      case "next":
        return page + 1;
      case "last":
        return count;
      default:
        return null;
    }
  };

  // Convert the basic item list to PaginationItem props objects
  const items = itemList.map((item) => {
    return typeof item === "number"
      ? {
          type: "page" as const,
          page: item,
          selected: item === page,
          disabled,
          "aria-current": item === page ? ("true" as const) : undefined,
        }
      : {
          type: item,
          page: buttonPage(item),
          selected: false,
          disabled:
            disabled ||
            (item.indexOf("ellipsis") === -1 &&
              (item === "next" || item === "last" ? page >= count : page <= 1)),
        };
  });

  return {
    items,
    ...other,
  };
}

const PaginationNav = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
PaginationNav.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & Pick<ButtonProps, "size"> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  href,
  ...props
}: PaginationLinkProps) => {
  const Component = (href ? Link : "button") as typeof Link;
  return (
    <Component
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      href={href!}
      {...props}
    />
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const Pagination = ({
  page,
  count,
  getItemHref,
}: {
  page: number;
  count: number;
  getItemHref: (page: number) => string;
}) => {
  const { items } = usePagination({
    page,
    count,
  });

  return (
    <PaginationNav>
      <PaginationContent>
        {items.map(({ type, page: iPage, ...item }) => {
          if (type === "start-ellipsis") {
            return (
              <PaginationItem key={type}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          if (type === "end-ellipsis") {
            return (
              <PaginationItem key={type}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          if (type === "previous") {
            return (
              <PaginationPrevious
                key={type}
                href={
                  item.disabled
                    ? undefined
                    : getItemHref(page === 1 ? 1 : page - 1)
                }
                {...item}
              />
            );
          }

          if (type === "next") {
            return (
              <PaginationNext
                key={type}
                href={
                  item.disabled
                    ? undefined
                    : getItemHref(page === count ? count : page + 1)
                }
                {...item}
              />
            );
          }

          if (type === "page") {
            return (
              <PaginationItem key={iPage}>
                <PaginationLink
                  isActive={item.selected}
                  href={getItemHref(iPage)}
                >
                  {iPage}
                </PaginationLink>
              </PaginationItem>
            );
          }
        })}
      </PaginationContent>
    </PaginationNav>
  );
};

export { Pagination };
