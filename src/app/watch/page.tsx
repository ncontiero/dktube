import type { Metadata, ResolvingMetadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Bookmark } from "lucide-react";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { DialogTrigger } from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { Video } from "@/components/Video";
import {
  VideoCardChannel,
  VideoCardChannelImage,
  VideoCardChannelName,
  VideoCardInfo,
  VideoCardRoot,
  VideoCardThumb,
  VideoCardTitle,
} from "@/components/VideoCard";
import { SaveVideoPlaylistDialog } from "@/components/VideoCardOptions/SaveVideoToPlaylist";
import { prisma, prismaSkip } from "@/lib/prisma";
import { LikeVideoBtn } from "./LikeVideoBtn";

interface WatchPageProps {
  readonly searchParams: Promise<{ v: string; t: string }>;
}

const getCachedVideos = unstable_cache(
  async (excludeId?: string) => {
    return await prisma.video.findMany({
      include: { user: true, likedVideosUsers: { select: { id: true } } },
      where: excludeId ? { id: { not: excludeId } } : {},
    });
  },
  ["videos"],
  { tags: ["videos"], revalidate: 60 * 60 },
);
const getCachedVideo = (videoId: string) =>
  unstable_cache(
    async () => {
      return (await getCachedVideos()).find((video) => video.id === videoId);
    },
    [`video:${videoId}`],
    { tags: [`video:${videoId}`], revalidate: 60 * 60 * 24 },
  );

export async function generateMetadata(
  { searchParams }: WatchPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const videoId = (await searchParams).v;
  if (!videoId) return notFound();

  const video = await getCachedVideo(videoId)();
  if (!video) return notFound();

  const videoUrl = `${(await parent).metadataBase}watch?v=${video.id}`;

  return {
    title: video.title,
    alternates: {
      canonical: videoUrl,
    },
    openGraph: {
      title: video.title,
      url: videoUrl,
      images: { url: video.thumb, alt: video.title },
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      images: { url: video.thumb, alt: video.title },
    },
  };
}

export default async function WatchPage({ searchParams }: WatchPageProps) {
  const videoId = (await searchParams).v;
  if (!videoId) return notFound();

  const videos = await getCachedVideos(videoId);
  const video = await getCachedVideo(videoId)();
  if (!video) return notFound();

  const startTime = z
    .string()
    .transform((v) => Number.parseInt(v, 10))
    .pipe(z.number().int().min(0))
    .safeParse((await searchParams).t).data;

  const { userId } = await auth();

  const isLikedCached = unstable_cache(
    async () => {
      const user = await prisma.user.findFirst({
        where: { externalId: userId || prismaSkip },
        select: { id: true, likedVideos: { select: { id: true } } },
      });
      return user?.likedVideos.some((v) => v.id === video.id) || false;
    },
    [`isLiked:${userId}:${video.id}`],
    { tags: [`isLiked:${userId}:${video.id}`], revalidate: 60 * 60 },
  );
  const isLiked = await isLikedCached();

  return (
    <div className="my-6 grid grid-cols-1 px-0 md:px-20 xl:grid-cols-4 xl:px-24">
      <div className="col-span-3 flex w-full flex-col items-center justify-center xl:pr-6 xl:pb-0">
        <div className="-mt-7 size-full md:-mt-1">
          <div className="inset-x-0 w-full">
            <Video
              videoId={video.youtubeId}
              startTime={startTime}
              hasUser={!!userId}
            />
          </div>
        </div>
        <div className="mt-3 mb-4 flex w-full flex-col justify-start px-4 mdl:px-0">
          <h1 className="z-10 text-base font-semibold md:text-lg mdl:text-xl">
            {video.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="mt-4 flex gap-2 mdl:mt-3 mdl:gap-3">
              <Link
                href={`/channel/${video.user.id}`}
                className="rounded-full ring-ring outline-hidden duration-200 hover:opacity-90 focus:ring-2"
              >
                <Image
                  src={video.user.image}
                  alt={video.user.username}
                  width={40}
                  height={40}
                  className="aspect-square rounded-full object-cover"
                />
              </Link>
              <Link
                href={`/channel/${video.user.id}`}
                className={`
                  size-fit self-center truncate rounded-md px-0.5 ring-ring outline-hidden duration-200 hover:opacity-90
                  focus:ring-2 mdl:self-auto mdl:font-semibold
                `}
              >
                {video.user.username}
              </Link>
            </div>
            {userId ? (
              <div className="flex items-center gap-2">
                <LikeVideoBtn
                  videoId={video.id}
                  likes={video.likedVideosUsers.length}
                  liked={isLiked}
                />
                <SaveVideoPlaylistDialog videoId={video.id}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="transparent"
                      className="gap-1 rounded-full"
                    >
                      <Bookmark size={20} />
                      <span className="text-sm">Salvar</span>
                    </Button>
                  </DialogTrigger>
                </SaveVideoPlaylistDialog>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex size-full flex-col gap-6 xs:gap-2.5 xs:px-4 md:px-0">
        <Separator className="mt-3 xl:hidden" />
        {videos
          .filter((v) => v.id !== video.id)
          .map((v) => (
            <VideoCardRoot
              key={v.id}
              video={v}
              className="mt-3 gap-1 xs:mt-0 xs:flex-row"
            >
              <VideoCardThumb linkClassName="xs:max-h-[94px] xs:max-w-[168px]" />
              <VideoCardInfo className="gap-0 xs:mt-0.5">
                <VideoCardChannel className="size-9 rounded-full xs:hidden md:mt-1">
                  <VideoCardChannelImage />
                </VideoCardChannel>
                <div className="flex flex-col">
                  <VideoCardTitle />
                  <VideoCardChannel className="mt-1 size-fit rounded-md px-0.5 md:mt-0.5">
                    <VideoCardChannelName className="md:text-sm" />
                  </VideoCardChannel>
                </div>
              </VideoCardInfo>
            </VideoCardRoot>
          ))}
      </div>
    </div>
  );
}
