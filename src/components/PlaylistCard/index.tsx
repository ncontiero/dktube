"use client";

import type { ImageProps } from "next/image";
import type { Playlist, Video } from "@/lib/prisma";
import type { CNonNullable } from "@/utils/types";
import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  use,
  useMemo,
} from "react";
import { Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type CardTitleProps, CardImage, CardRoot, CardTitle } from "../Card";

export interface PlaylistCardContextProps {
  readonly playlist: (Playlist & { videos: Video[] }) | null;
  userId?: string | null;
  href?: string | null;
}

const PlaylistCardContext = createContext<PlaylistCardContextProps>({
  playlist: null,
});
const usePlaylistCardContext = () => use(PlaylistCardContext);

interface PlaylistCardRootProps
  extends ComponentProps<"div">, CNonNullable<PlaylistCardContextProps> {}

export function PlaylistCardRoot({
  playlist,
  userId,
  className,
  ...props
}: PlaylistCardRootProps) {
  const href = playlist.videos[0]
    ? `/watch?v=${playlist.videos[0].id}`
    : `/playlist/${playlist.id}`;

  const contextValues = useMemo(
    () => ({
      userId: userId || null,
      playlist: playlist ?? null,
      href,
    }),
    [href, playlist, userId],
  );

  return (
    <PlaylistCardContext value={contextValues}>
      <CardRoot
        href={href}
        className={cn(
          "flex-row gap-0.5 xs:max-w-75 xs:flex-col xs:gap-1.5 xs:pb-4",
          className,
        )}
        {...props}
      />
    </PlaylistCardContext>
  );
}

interface PlaylistCardImageProps extends Partial<ImageProps> {
  readonly linkClassName?: string;
}

export function PlaylistCardImage({
  className,
  linkClassName,
  width = 300,
  height = 180,
  ...props
}: PlaylistCardImageProps) {
  const { playlist, href } = usePlaylistCardContext();
  if (!playlist || !href) return null;

  return (
    <Link
      href={href}
      style={
        { "--width": `${width}px`, "--height": `${height}px` } as CSSProperties
      }
      className={cn(
        `
          relative z-10 rounded-xl ring-ring outline-hidden duration-200 focus-visible:ring-2 xs:max-h-(--height)
          xs:max-w-(--width)
        `,
        linkClassName,
      )}
    >
      <div
        className={`
          absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/80 text-sm font-semibold uppercase
          opacity-0 duration-300 group-hover/card:opacity-100 xs:text-base
        `}
      >
        Reproduzir tudo
      </div>
      <CardImage
        src={
          playlist.videos[0] ? playlist.videos[0].thumb : "/playlist-img.jpg"
        }
        quality={100}
        alt={`Reproduzir ${playlist.name}`}
        width={width}
        height={height}
        className={cn("size-full rounded-xl", className)}
        {...props}
      />
    </Link>
  );
}

interface PlaylistCardInfoProps extends ComponentProps<"div"> {
  readonly linkClassName?: string;
}

export function PlaylistCardInfo({
  className,
  linkClassName,
  children,
  ...props
}: PlaylistCardInfoProps) {
  const { playlist } = usePlaylistCardContext();
  if (!playlist) return null;

  return (
    <div className={cn("flex w-full flex-col px-1", className)} {...props}>
      {children}
      <Link
        href={`/playlist/${playlist.id}`}
        className={cn(
          `
            z-10 mt-2 flex w-fit items-center gap-1 rounded-md text-xs text-foreground/60 ring-primary duration-200
            hover:text-foreground focus:outline-hidden focus-visible:text-foreground focus-visible:ring-2 xs:text-sm
          `,
          linkClassName,
        )}
      >
        Ver playlist completa
        {!playlist.isPublic && (
          <span title="Privada">
            <Lock className="size-4 text-yellow-500" />
          </span>
        )}
      </Link>
    </div>
  );
}

export interface PlaylistCardTitleProps extends CardTitleProps {}

export function PlaylistCardTitle({
  className,
  children,
  ...props
}: PlaylistCardTitleProps) {
  const { playlist, href } = usePlaylistCardContext();
  if (!playlist || !href) return null;

  return (
    <Link
      href={href}
      title={playlist.name}
      className={`z-10 size-fit rounded-md ring-ring duration-200 hover:opacity-90 focus:outline-hidden focus-visible:ring-2`}
    >
      <CardTitle className={cn("text-base", className)} {...props}>
        {playlist.name}
      </CardTitle>
    </Link>
  );
}
