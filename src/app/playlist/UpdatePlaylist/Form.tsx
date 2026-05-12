"use client";

import type { Playlist } from "@/lib/prisma";
import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { updatePlaylistAction } from "@/actions/playlist";
import {
  type UpdatePlaylistSchema,
  updatePlaylistSchema,
} from "@/actions/playlist/schema";
import { Button } from "@/components/ui/Button";
import { DialogClose } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";

export function UpdatePlaylistForm({
  playlist,
}: {
  readonly playlist: Playlist;
}) {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const updatePlaylist = useAction(updatePlaylistAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Playlist atualizada com sucesso!");
      dialogCloseRef.current?.click();
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(updatePlaylistSchema),
    defaultValues: playlist,
  });

  const watchedIsPublic = useWatch({ control, name: "isPublic" });

  function onSubmit(data: UpdatePlaylistSchema) {
    updatePlaylist.execute({ ...data, id: playlist.id });
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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

      <Button
        type="submit"
        className="mt-4 w-full rounded-full"
        disabled={updatePlaylist.status === "executing"}
      >
        {updatePlaylist.status === "executing" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Salvar"
        )}
      </Button>
      <DialogClose ref={dialogCloseRef} />
    </form>
  );
}
