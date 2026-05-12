"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Search } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { type SearchVideosSchema, searchVideosSchema } from "@/actions/schema";
import { cn } from "@/lib/utils";
import { searchVideosAction } from "./searchAction";

export function SearchForm({ size = "md" }: { readonly size?: "sm" | "md" }) {
  const searchQuery = useSearchParams().get("q");
  const form = useForm({
    resolver: zodResolver(searchVideosSchema),
    defaultValues: { search: searchQuery || "" },
  });

  const searchVideos = useAction(searchVideosAction, {
    onError: () => {
      toast.error("Erro ao buscar vídeos");
    },
  });

  function onSubmit(data: SearchVideosSchema) {
    searchVideos.execute(data);
  }

  return (
    <form
      className={cn(
        "hidden size-full max-w-lg items-center lg:flex lg:flex-1",
        size === "sm" && "flex max-w-none",
      )}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex w-full rounded-3xl">
        <input
          type="text"
          placeholder="Buscar videos..."
          className={`
            w-full rounded-l-3xl border border-foreground/20 bg-transparent px-3 py-2 outline-hidden duration-200
            focus:border-ring
          `}
          {...form.register("search")}
        />
        <button
          type="submit"
          className={`
            rounded-r-3xl border-y border-r border-foreground/20 bg-foreground/10 px-2 outline-ring duration-200
            disabled:cursor-not-allowed disabled:opacity-70 sm:px-4 sm:py-2 [&:not(:disabled):hover]:bg-foreground/20
          `}
          title="Buscar"
          aria-label="Buscar"
        >
          {searchVideos.status === "executing" ? (
            <Loader className="mr-1 animate-spin" />
          ) : (
            <Search className="mr-1" />
          )}
        </button>
      </div>
    </form>
  );
}
