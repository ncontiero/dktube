import type { LinkProps as NextLinkProps } from "next/link";
import type { ComponentProps } from "react";

export type LinkProps = Omit<ComponentProps<"a">, keyof NextLinkProps> &
  Partial<NextLinkProps>;
