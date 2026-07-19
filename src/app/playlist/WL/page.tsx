import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { getWatchLater } from "@/utils/data";
import { PlaylistPageComp } from "../PlaylistPage";

export const metadata: Metadata = {
  title: "Assistir mais tarde",
};

export default async function WatchLaterPage() {
  const { userId } = await auth.protect();

  const cachedWatchLater = unstable_cache(
    async () => getWatchLater(userId),
    [userId],
    { tags: ["watchLater", `watchLater:${userId}`], revalidate: 60 },
  );

  const watchLater = await cachedWatchLater();
  if (!watchLater) notFound();

  return <PlaylistPageComp userId={userId} playlist={watchLater} />;
}
