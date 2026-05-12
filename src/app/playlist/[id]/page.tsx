import type { Metadata, ResolvingMetadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlaylistPageComp } from "../PlaylistPage";

type PlaylistPageProps = PageProps<"/playlist/[id]">;

const getCachedPlaylist = (id: string) =>
  unstable_cache(
    async () => {
      return prisma.playlist.findUnique({
        where: { id },
        include: {
          user: true,
          videos: { include: { user: true } },
        },
      });
    },
    [id],
    { tags: [`playlist:${id}`], revalidate: 60 },
  );

export async function generateMetadata(
  { params }: PlaylistPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const playlistId = (await params).id;
  if (!playlistId) return notFound();

  const playlist = await getCachedPlaylist(playlistId)();
  if (!playlist) return notFound();

  const playlistUrl = `${(await parent).metadataBase}playlist/${playlist.id}`;
  const plImage = playlist.videos[0]?.thumb || "/playlist-img.jpg";

  return {
    title: playlist.name,
    alternates: {
      canonical: playlistUrl,
    },
    openGraph: {
      title: playlist.name,
      url: playlistUrl,
      images: { url: plImage, alt: playlist.name },
    },
    twitter: {
      card: "summary_large_image",
      title: playlist.name,
      images: { url: plImage, alt: playlist.name },
    },
  };
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const playlistId = (await params).id;
  if (!playlistId) return notFound();

  const playlist = await getCachedPlaylist(playlistId)();
  if (!playlist) return notFound();

  const user = await currentUser();
  if (!playlist.isPublic && user?.id !== playlist.user.externalId) {
    return notFound();
  }

  return <PlaylistPageComp playlist={playlist} userId={user?.id} />;
}
