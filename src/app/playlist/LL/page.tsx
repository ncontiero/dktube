import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { getLikedVideos } from "@/utils/data";
import { PlaylistPageComp } from "../PlaylistPage";

export const metadata: Metadata = {
  title: "Vídeos curtidos",
};

export default async function LikedVideosPage() {
  const { userId } = await auth.protect();

  const cachedLikedVideos = unstable_cache(
    async () => getLikedVideos(userId),
    [userId],
    { tags: ["likedVideos", `likedVideos:${userId}`], revalidate: 60 },
  );

  const likedVideos = await cachedLikedVideos();
  if (!likedVideos) notFound();

  return <PlaylistPageComp playlist={likedVideos} />;
}
