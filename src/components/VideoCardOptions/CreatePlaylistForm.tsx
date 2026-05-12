"use client";

import { type Dispatch, type SetStateAction, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createPlaylistAction } from "@/actions/playlist";
import {
  type CreatePlaylistSchema,
  createPlaylistSchema,
} from "@/actions/playlist/schema";
import { Button } from "../ui/Button";
import { DialogClose } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Switch } from "../ui/Switch";

interface CreatePlaylistFormProps {
  readonly videoId?: string;
  readonly createPlaylistFormOpen?: boolean;
  readonly setCreatePlaylistFormOpen?: Dispatch<SetStateAction<boolean>>;
}

export function CreatePlaylistForm({
  videoId,
  createPlaylistFormOpen = true,
  setCreatePlaylistFormOpen,
}: CreatePlaylistFormProps) {
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const createPlaylist = useAction(createPlaylistAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Playlist criada com sucesso!");
      dialogCloseRef.current?.click();
      setCreatePlaylistFormOpen?.(false);
    },
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(createPlaylistSchema),
    values: { name: "", isPublic: false, videoId },
  });

  const watchedIsPublic = useWatch({
    control,
    name: "isPublic",
  });

  function onSubmit(data: CreatePlaylistSchema) {
    createPlaylist.execute(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-state={createPlaylistFormOpen ? "open" : "closed"}
      className={`
        duration-200 data-[state=closed]:hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0
        data-[state=closed]:slide-out-to-left-1/3 data-[state=open]:animate-in data-[state=open]:fade-in-0
        data-[state=open]:slide-in-from-left-1/3
      `}
      aria-hidden={!createPlaylistFormOpen}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          type="text"
          id="name"
          placeholder="Digite o nome da playlist..."
          {...register("name")}
        />

        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <Label
        className="mt-4 flex cursor-pointer flex-col gap-2 rounded-xl p-2 duration-200 hover:bg-input/80"
        htmlFor="isPublic"
      >
        <div className="flex w-full items-center justify-between">
          Pública
          <Switch
            id="isPublic"
            checked={watchedIsPublic || false}
            onCheckedChange={(value) => setValue("isPublic", value)}
          />
        </div>
        {errors.isPublic ? (
          <p className="text-sm text-destructive">{errors.isPublic.message}</p>
        ) : null}
      </Label>

      <div className="mt-4 flex items-center gap-2">
        {!setCreatePlaylistFormOpen ? (
          <DialogClose asChild ref={dialogCloseRef}>
            <Button variant="outline" className="w-full rounded-full">
              Voltar
            </Button>
          </DialogClose>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full"
            onClick={() => setCreatePlaylistFormOpen(false)}
          >
            Voltar
          </Button>
        )}
        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={createPlaylist.status === "executing"}
        >
          {createPlaylist.status === "executing" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Criar"
          )}
        </Button>
      </div>
    </form>
  );
}
