import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import {
  PlaylistCardImage,
  PlaylistCardInfo,
  PlaylistCardRoot,
  PlaylistCardTitle,
} from "@/components/PlaylistCard";
import { prisma } from "@/lib/prisma";
import { likedVideosObj, watchLaterObj } from "@/utils/data";

export const metadata: Metadata = {
  title: "Playlists",
};

export default async function PlaylistsPage() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const cachedUserPlaylists = unstable_cache(
    async () => {
      return prisma.user.findUnique({
        where: { externalId: userId },
        include: {
          watchLater: { include: { user: true } },
          likedVideos: { include: { user: true } },
          playlists: {
            include: {
              videos: {
                include: { user: true },
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
      });
    },
    [`feed:playlists:${userId}`],
    { tags: [`feed:playlists:${userId}`], revalidate: 60 },
  );

  const user = await cachedUserPlaylists();
  if (!user?.playlists) {
    return null;
  }
  const playlists = [
    watchLaterObj(user, user.watchLater),
    likedVideosObj(user, user.likedVideos),
    ...user.playlists,
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto mt-6 flex size-full max-w-(--breakpoint-2xl) flex-col gap-4 px-4">
        <h1 className="text-4xl font-bold">Playlists</h1>
        <div className="mt-2 flex flex-row flex-wrap items-center gap-4">
          {playlists.map((playlist) => (
            <PlaylistCardRoot key={playlist.id} playlist={playlist}>
              <PlaylistCardImage />
              <PlaylistCardInfo linkClassName="mt-1">
                <PlaylistCardTitle />
              </PlaylistCardInfo>
            </PlaylistCardRoot>
          ))}
        </div>
      </div>
    </div>
  );
}
