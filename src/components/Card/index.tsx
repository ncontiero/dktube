import type { ComponentProps } from "react";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CardRootProps extends ComponentProps<"div"> {
  readonly href?: string;
}

/**
 * Card component for displaying content in a card format.
 *
 * @example
 * <CardRoot>
 *  <CardImage src="/img.png" alt="Card Image" width={300} height={200} />
 *  <CardContent>
 *    <CardTitle>Title</CardTitle>
 *  </CardContent>
 * </CardRoot>
 */
export function CardRoot({
  className,
  children,
  href,
  ...props
}: CardRootProps) {
  return (
    <div
      className={cn("group/card relative flex w-full flex-col", className)}
      {...props}
    >
      {href ? (
        <>
          <Link
            href={href}
            className={`
              absolute inset-0 z-5 -my-1 rounded-xl outline-hidden duration-200 group-active/card:bg-secondary
              focus-visible:bg-secondary xs:-m-1
            `}
          />
          <div className="absolute inset-0 z-4 -my-1 rounded-xl duration-300 group-hover/card:bg-primary/20 xs:-m-1" />
        </>
      ) : null}
      {children}
    </div>
  );
}

export interface CardImageProps extends ImageProps {}

export function CardImage({ className, ...props }: CardImageProps) {
  return (
    <Image
      className={cn(
        "aspect-video w-full object-cover xs:rounded-xl",
        className,
      )}
      {...props}
    />
  );
}

export interface CardContentProps extends ComponentProps<"div"> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      className={cn("relative mt-3 flex w-full gap-2 px-2 md:px-0", className)}
      {...props}
    />
  );
}

export interface CardTitleProps extends ComponentProps<"h1"> {
  readonly titleMaxChars?: number;
}

export function CardTitle({
  className,
  children,
  titleMaxChars = 40,
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={cn(
        "max-h-12 overflow-hidden px-0.5 text-sm font-semibold xs:text-base",
        className,
      )}
      {...props}
    >
      {typeof children === "string" && children.length > titleMaxChars
        ? `${children.slice(0, titleMaxChars)}...`
        : children}
    </h3>
  );
}
