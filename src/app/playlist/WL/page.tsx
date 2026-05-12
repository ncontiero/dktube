import type { Metadata } from "next";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { getWatchLater } from "@/utils/data";
import { PlaylistPageComp } from "../PlaylistPage";

export const metadata: Metadata = {
  title: "Assistir mais tarde",
};

export default async function WatchLaterPage() {
  const user = await currentUser();
  if (!user) return RedirectToSignIn({});

  const cachedWatchLater = unstable_cache(
    async () => getWatchLater(user.id),
    [user.id],
    { tags: ["watchLater", `watchLater:${user.id}`], revalidate: 60 },
  );

  const watchLater = await cachedWatchLater();
  if (!watchLater) notFound();

  return <PlaylistPageComp userId={user.id} playlist={watchLater} />;
}
