"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createVideoAction } from "@/actions/video";
import {
  type CreateVideoSchema,
  createVideoSchema,
} from "@/actions/video/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function CreateVideoForm() {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm({ resolver: zodResolver(createVideoSchema) });

  const createVideo = useAction(createVideoAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Vídeo criado com sucesso!");
      reset();
    },
  });

  function onSubmit(data: CreateVideoSchema) {
    createVideo.execute(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-xl flex-col gap-4 rounded-md border px-6 py-8"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          type="text"
          id="title"
          placeholder="Digite o título do vídeo..."
          {...register("title")}
        />

        {errors.title ? (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtubeId">Youtube ID</Label>
        <Input
          type="text"
          id="youtubeId"
          placeholder="Digite o id do vídeo do Youtube..."
          {...register("youtubeId")}
        />

        {errors.youtubeId ? (
          <p className="text-sm text-destructive">{errors.youtubeId.message}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="mt-2"
        disabled={createVideo.status === "executing"}
      >
        {createVideo.status === "executing" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Criar"
        )}
      </Button>
    </form>
  );
}
