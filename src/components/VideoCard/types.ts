import type { ComponentProps } from "react";
import type { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = Omit<ComponentProps<"a">, keyof NextLinkProps> &
  Partial<NextLinkProps>;
