"use client";

import type { PlaylistProps } from "@/utils/types";
import { type PropsWithChildren, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { getMyPlaylistsAction } from "@/actions/playlist";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../ui/Dialog";
import { Skeleton } from "../ui/Skeleton";
import { CreatePlaylistForm } from "./CreatePlaylistForm";
import { PlaylistCheckbox } from "./PlaylistCheckbox";

export interface SaveVideoPlaylistDialogProps extends PropsWithChildren {
  readonly videoId: string;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

const noopFunc = () => {};
export function SaveVideoPlaylistDialog({
  children,
  videoId,
  open = false,
  onOpenChange = noopFunc,
}: SaveVideoPlaylistDialogProps) {
  const [playlists, setPlaylists] = useState<PlaylistProps[]>([]);
  const [createPlaylistFormOpen, setCreatePlaylistFormOpen] = useState(false);

  const getPlaylists = useAction(getMyPlaylistsAction, {
    onSuccess: ({ data }) => {
      setPlaylists(data ?? []);
    },
  });

  useEffect(() => {
    getPlaylists.execute();
    // eslint-disable-next-line react/exhaustive-deps
  }, [createPlaylistFormOpen]);

  return (
    <Dialog defaultOpen={open} onOpenChange={onOpenChange}>
      {children}
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-xs">
          <div className="flex w-full items-center justify-between">
            <DialogHeader>
              <DialogTitle>
                {createPlaylistFormOpen
                  ? "Criar playlist"
                  : "Salvar vídeo em..."}
              </DialogTitle>
            </DialogHeader>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                title="Fechar"
                aria-label="Fechar"
              >
                <X />
              </Button>
            </DialogClose>
          </div>
          <div
            className={`
              flex flex-col gap-4 duration-200 data-[state=closed]:hidden data-[state=closed]:animate-out
              data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-1/3 data-[state=open]:animate-in
              data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-1/3
            `}
            data-state={createPlaylistFormOpen ? "closed" : "open"}
            aria-hidden={createPlaylistFormOpen}
          >
            <div className="flex flex-col space-y-2">
              {getPlaylists.status === "executing" ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="size-6 rounded-md" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                ))
              ) : playlists == null || playlists.length === 0 ? (
                <div className="my-2">Você não tem playlists!</div>
              ) : (
                playlists.map((playlist) => (
                  <PlaylistCheckbox
                    key={playlist.id}
                    playlist={{
                      ...playlist,
                      hasVideo: playlist.videos.some((v) => v.id === videoId),
                    }}
                    videoId={videoId}
                  />
                ))
              )}
            </div>
            <Button
              className="w-full gap-1 rounded-full"
              variant="secondary"
              onClick={() => setCreatePlaylistFormOpen(true)}
              type="button"
            >
              <Plus />
              Nova playlist
            </Button>
          </div>
          <CreatePlaylistForm
            videoId={videoId}
            createPlaylistFormOpen={createPlaylistFormOpen}
            setCreatePlaylistFormOpen={setCreatePlaylistFormOpen}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
