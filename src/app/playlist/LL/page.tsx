import type { Metadata } from "next";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { getLikedVideos } from "@/utils/data";
import { PlaylistPageComp } from "../PlaylistPage";

export const metadata: Metadata = {
  title: "Vídeos curtidos",
};

export default async function LikedVideosPage() {
  const user = await currentUser();
  if (!user) return RedirectToSignIn({});

  const cachedLikedVideos = unstable_cache(
    async () => getLikedVideos(user.id),
    [user.id],
    { tags: ["likedVideos", `likedVideos:${user.id}`], revalidate: 60 },
  );

  const likedVideos = await cachedLikedVideos();
  if (!likedVideos) notFound();

  return <PlaylistPageComp playlist={likedVideos} />;
}
