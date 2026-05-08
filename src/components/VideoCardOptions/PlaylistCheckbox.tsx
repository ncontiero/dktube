import type { Playlist } from "@/lib/prisma";
import { useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Lock } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { handleVideoFromPlaylistAction } from "@/actions/playlist";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";

export interface PlaylistCheckboxProps {
  readonly playlist: Playlist & { hasVideo: boolean };
  readonly videoId: string;
}

export function PlaylistCheckbox({ playlist, videoId }: PlaylistCheckboxProps) {
  const [checked, setChecked] = useState(playlist.hasVideo);

  const handleSaveVideo = useAction(handleVideoFromPlaylistAction, {
    onSuccess: () => {
      setChecked(!checked);
      toast.success(
        `Vídeo ${playlist.hasVideo ? "removido" : "salvo"} com sucesso na playlist '${
          playlist.name
        }'`,
      );
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
  });

  return (
    <Label
      htmlFor={`save-${playlist.id}`}
      className="flex cursor-pointer items-center gap-2 text-base"
      title={`Clique para salvar o vídeo na playlist '${playlist.name}'${playlist.isPublic ? "" : " (privada)"}`}
    >
      {handleSaveVideo.status === "executing" ? (
        <div className="size-6 rounded-md" title="Carregando...">
          <Loader2 className="size-full animate-spin" />
          <span className="sr-only">Carregando...</span>
        </div>
      ) : (
        <Checkbox
          id={`save-${playlist.id}`}
          className="size-6"
          checked={checked}
          onCheckedChange={() =>
            handleSaveVideo.execute({ playlistId: playlist.id, videoId })
          }
        />
      )}
      {playlist.name}
      {!playlist.isPublic && (
        <span title="Privada">
          <Lock className="size-4 text-yellow-500" />
        </span>
      )}
    </Label>
  );
}
