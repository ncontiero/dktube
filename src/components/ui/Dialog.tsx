"use client";

import type { ComponentProps } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        `
          fixed inset-0 z-99999 bg-black/80 backdrop-blur-xs data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0
        `,
        className,
      )}
      {...props}
    />
  );
}

const dialogContentVariants = cva(
  `
    fixed z-99999 grid w-full gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in
    data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:rounded-lg
  `,
  {
    variants: {
      variant: {
        default: `
          top-[50%] left-[50%] translate-[-50%] data-[state=closed]:slide-out-to-left-1/2
          data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2
          data-[state=open]:slide-in-from-top-[48%]
        `,
        custom: "top-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface DialogContentProps
  extends
    ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {}

function DialogContent({ className, variant, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Content
      className={cn(dialogContentVariants({ variant, className }))}
      {...props}
    />
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-lg leading-none font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
