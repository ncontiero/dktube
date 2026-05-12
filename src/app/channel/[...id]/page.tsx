import type { Metadata, ResolvingMetadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  PlaylistCardImage,
  PlaylistCardInfo,
  PlaylistCardRoot,
  PlaylistCardTitle,
} from "@/components/PlaylistCard";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  VideoCardChannel,
  VideoCardChannelName,
  VideoCardInfo,
  VideoCardRoot,
  VideoCardThumb,
  VideoCardTitle,
} from "@/components/VideoCard";
import { prisma } from "@/lib/prisma";

type ChannelPageProps = PageProps<"/channel/[...id]">;

const getCachedChannel = (id: string) =>
  unstable_cache(
    async () => {
      return await prisma.user.findUnique({
        where: { id },
        include: { videos: true, playlists: { include: { videos: true } } },
      });
    },
    [`channel:${id}`],
    { tags: [`channel:${id}`], revalidate: 60 },
  );

export async function generateMetadata(
  { params }: ChannelPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const channelId = (await params).id[0];
  if (!channelId) return notFound();

  const channel = await getCachedChannel(channelId)();
  if (!channel) return notFound();

  const channelUrl = `${(await parent).metadataBase}channel/${channel.id}`;

  return {
    title: channel.username,
    alternates: {
      canonical: channelUrl,
    },
    openGraph: {
      title: channel.username,
      url: channelUrl,
      type: "profile",
      images: { url: channel.image, alt: channel.username },
    },
    twitter: {
      card: "summary_large_image",
      title: channel.username,
      images: { url: channel.image, alt: channel.username },
    },
  };
}

export default async function ChannelPage(props: ChannelPageProps) {
  const params = await props.params;

  const channelId = params.id[0];
  if (!channelId) return notFound();

  const channel = await getCachedChannel(channelId)();
  if (!channel) return notFound();

  const user = await currentUser();

  const tabs = [
    { value: "home", label: "Início" },
    { value: "videos", label: "Vídeos" },
    { value: "playlists", label: "Playlists" },
  ];
  const mainVideo = channel.videos[0];
  const videos = channel.videos.slice(1);
  const initialTab = (tabs.find((tab) => tab.value === params.id[1]) ??
    tabs[0])!.value;

  const channelHasVideos = channel.videos.length > 0 && !!mainVideo;
  const channelHasPlaylists = channel.playlists.length > 0;
  const channelHasContent = channelHasVideos || channelHasPlaylists;

  if (initialTab === "playlists" && !channelHasPlaylists)
    redirect(`/channel/${channel.id}/videos`);
  if (initialTab === "videos" && !channelHasVideos)
    redirect(`/channel/${channel.id}/home`);

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto mt-4 flex w-full max-w-7xl flex-col items-center px-4 pt-4 xs:flex-row xs:items-start">
        <div className="size-14 max-w-max xs:mr-6 xs:mb-3 xs:size-auto">
          <Image
            src={channel.image}
            alt={channel.username}
            width={128}
            height={128}
            className="aspect-square rounded-full object-cover"
          />
        </div>
        <div className="mt-2 flex flex-col items-center xs:mt-4 xs:items-start">
          <div>
            <h1 className="text-2xl font-semibold">{channel.username}</h1>
          </div>
          <span className="text-sm opacity-90">
            {channel.videos.length} vídeos
          </span>
        </div>
      </div>
      {!channelHasContent ? (
        <div className="mt-10 mb-6 flex justify-center text-center">
          <p>Este canal não tem nenhum conteúdo</p>
        </div>
      ) : (
        <Tabs defaultValue={initialTab}>
          <TabsList className="h-auto w-full rounded-none border-b border-secondary bg-transparent p-0">
            <ScrollArea className="w-full">
              <div className="relative mx-auto flex w-full max-w-7xl pt-4 xs:px-2">
                {tabs
                  .filter(
                    (tab) =>
                      channelHasVideos ||
                      (tab.value !== "videos" && tab.value !== "home"),
                  )
                  .filter(
                    (tab) => channelHasPlaylists || tab.value !== "playlists",
                  )
                  .map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`
                        rounded-none rounded-t-lg border-b border-transparent px-6 py-4 text-sm font-medium
                        text-foreground/80 uppercase duration-200 hover:bg-secondary hover:text-foreground
                        data-[state=active]:border-foreground hover:data-[state=active]:bg-secondary
                      `}
                      asChild
                    >
                      <Link href={`/channel/${channel.id}/${tab.value}`}>
                        {tab.label}
                      </Link>
                    </TabsTrigger>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </TabsList>
          <TabsContent
            value="home"
            className="mx-auto flex size-full max-w-7xl flex-col xs:px-2"
          >
            {mainVideo ? (
              <>
                <div className="mt-2 w-full xs:max-w-3xl">
                  <VideoCardRoot
                    video={{ ...mainVideo, user: channel }}
                    className="gap-3 pb-4 xs:flex-row xs:pb-0"
                  >
                    <VideoCardThumb linkClassName="xs:max-h-[150px] xs:max-w-[250px]" />
                    <VideoCardInfo className="mt-0 px-0">
                      <div className="flex w-full px-2 xs:mt-0.5 xs:flex-col xs:px-0.5">
                        <VideoCardTitle
                          titleMaxChars={90}
                          className="max-h-none overflow-auto text-base md:text-lg"
                        />
                        <VideoCardChannel className="mt-1 hidden size-fit rounded-md px-0.5 xs:flex md:mt-0.5">
                          <VideoCardChannelName className="md:text-sm" />
                        </VideoCardChannel>
                      </div>
                    </VideoCardInfo>
                  </VideoCardRoot>
                </div>
                <Separator className="mt-2 mb-4 xs:mt-6 xs:mb-4" />
              </>
            ) : null}
            <div className="px-3">
              <Link
                className={`
                  text-lg font-bold ring-ring outline-hidden duration-200 hover:opacity-80 focus-visible:ring-2
                `}
                href={`/channel/${channel.id}/videos`}
              >
                Vídeos
              </Link>
              <ScrollArea className="mt-4">
                <div className="flex flex-col gap-3 p-1 xs:flex-row xs:gap-2">
                  {videos.slice(0, 5).map((video) => (
                    <VideoCardRoot
                      key={video.id}
                      video={{ ...video, user: channel }}
                      className="flex-row xs:w-[210px] xs:flex-col xs:pb-4"
                    >
                      <VideoCardThumb
                        className="rounded-xl"
                        linkClassName="rounded-xl xs:max-h-[118px] xs:max-w-[210px]"
                        width={210}
                        height={118}
                      />
                      <VideoCardInfo className="mt-1 md:px-0.5">
                        <VideoCardTitle
                          titleMaxChars={32}
                          className="text-base"
                        />
                      </VideoCardInfo>
                    </VideoCardRoot>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </TabsContent>
          {channelHasVideos ? (
            <TabsContent
              value="videos"
              className="mx-auto my-2 flex size-full max-w-7xl flex-col flex-wrap gap-4 px-2 xs:flex-row"
            >
              {[mainVideo!, ...videos].map((video) => (
                <VideoCardRoot
                  key={video.id}
                  video={{ ...video, user: channel }}
                  className="flex-row xs:max-w-[300px] xs:flex-col xs:pb-2"
                >
                  <VideoCardThumb
                    linkClassName="rounded-xl xs:max-h-[180px] xs:max-w-[300px]"
                    className="rounded-xl"
                    width={300}
                    height={180}
                  />
                  <VideoCardInfo className="mt-0 xs:mt-2">
                    <div className="flex flex-col">
                      <VideoCardTitle className="text-base" />
                    </div>
                  </VideoCardInfo>
                </VideoCardRoot>
              ))}
            </TabsContent>
          ) : null}
          <TabsContent
            value="playlists"
            className="mx-auto mt-0 flex size-full max-w-7xl flex-col px-2"
          >
            <h3 className="mb-4">Playlist criadas</h3>
            <div className="flex flex-wrap gap-4">
              {channel.playlists.map((playlist) => {
                if (user?.id !== channel.externalId && !playlist.isPublic) {
                  return null;
                }
                return (
                  <PlaylistCardRoot key={playlist.id} playlist={playlist}>
                    <PlaylistCardImage />
                    <PlaylistCardInfo linkClassName="mt-0">
                      <PlaylistCardTitle />
                    </PlaylistCardInfo>
                  </PlaylistCardRoot>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
