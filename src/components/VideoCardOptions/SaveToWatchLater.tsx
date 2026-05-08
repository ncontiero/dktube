import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Clock, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import {
  getWatchLaterAction,
  handleVideoFromPlaylistAction,
} from "@/actions/playlist";
import { DropdownMenuItem } from "../ui/DropwDownMenu";
import { Skeleton } from "../ui/Skeleton";

interface SaveToWatchLaterProps {
  readonly videoId: string;
}

export function SaveToWatchLater({ videoId }: SaveToWatchLaterProps) {
  const [hasVideoInWatchLater, setHasVideoInWatchLater] = useState(false);

  const getWatchLater = useAction(getWatchLaterAction, {
    onSuccess: ({ data }) => {
      if (data) {
        setHasVideoInWatchLater(
          data.videos.some((video) => video.id === videoId),
        );
      }
    },
  });

  useEffect(() => {
    getWatchLater.execute();
    // eslint-disable-next-line react/exhaustive-deps
  }, []);

  const handleSaveVideo = useAction(handleVideoFromPlaylistAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: ({ data }) => {
      setHasVideoInWatchLater(data?.hasAdded || false);
      toast.success(
        `Vídeo ${data?.hasAdded ? "salvo" : "removido"} com sucesso!`,
      );
    },
  });

  return (
    <DropdownMenuItem
      className="w-full cursor-pointer p-2"
      onSelect={(e) => e.preventDefault()}
    >
      {getWatchLater.status === "executing" ? (
        <div className="flex w-full items-center gap-2">
          <div>
            <Skeleton className="size-6" />
          </div>
          <Skeleton className="h-6 w-full" />
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center gap-2"
          disabled={handleSaveVideo.status === "executing"}
          onClick={() => handleSaveVideo.execute({ videoId, playlistId: "WL" })}
        >
          {handleSaveVideo.status === "executing" ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Clock />
          )}
          <span>
            {hasVideoInWatchLater ? "Remover do " : "Salvar em "}
            &apos;Assistir mais tarde&apos;
          </span>
        </button>
      )}
    </DropdownMenuItem>
  );
}
