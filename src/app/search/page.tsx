import type { Metadata } from "next";
import { Fragment } from "react";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardContent, CardRoot, CardTitle } from "@/components/Card";
import { Separator } from "@/components/ui/Separator";
import { VideoCardOptionsMenu } from "@/components/VideoCardOptions";
import { prisma } from "@/lib/prisma";

interface SearchPageProps {
  readonly searchParams: Promise<{ q: string | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = (await searchParams).q;

  return {
    title: query || "Nenhuma consulta de pesquisa",
  };
}

const getRelevanceScore = (label: string, query: string): number => {
  // Compute a relevance score based on the index of the query in the username.
  // If the query is not found, return 0; otherwise, return a score inversely proportional to the index.
  if (!label) return 0;
  const idx = label.toLowerCase().indexOf(query.toLowerCase());
  return idx === -1 ? 0 : 1 / (idx + 1);
};

const getCachedSearchResults = (query: string) =>
  unstable_cache(
    async () => {
      const dbChannels = await prisma.user.findMany({
        where: {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
      });
      const channels = dbChannels.map((channel) => ({
        id: channel.id,
        label: channel.username,
        image: channel.image,
        user: null,
        createdAt: channel.createdAt,
      }));

      const channelsWithRelevance = channels.map((channel) => ({
        ...channel,
        relevance: getRelevanceScore(channel.label, query),
      }));
      channelsWithRelevance.sort((a, b) => b.relevance - a.relevance);
      const sortedChannels = channelsWithRelevance.map(
        ({ relevance, ...rest }) => rest,
      );

      const dbVideos = await prisma.video.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: { user: true },
      });
      const videos = dbVideos.map((video) => ({
        id: video.id,
        label: video.title,
        image: video.thumb,
        user: video.user,
        createdAt: video.createdAt,
      }));
      const videosWithRelevance = videos.map((video) => ({
        ...video,
        relevance: getRelevanceScore(video.label, query),
      }));
      videosWithRelevance.sort((a, b) => b.relevance - a.relevance);
      const sortedVideos = videosWithRelevance.map(
        ({ relevance, ...rest }) => rest,
      );

      return [...sortedChannels, ...sortedVideos];
    },
    [query],
    { tags: ["search", `search:${query}`], revalidate: 60 * 60 },
  );

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (await searchParams).q;
  if (!query) return notFound();

  const searchResults = await getCachedSearchResults(query)();
  const createURL = (id: string, type: "channel" | "video") => {
    return type === "channel" ? `/channel/${id}` : `/watch?v=${id}`;
  };

  return (
    <div className="xs:my-10 xs:px-2 mx-auto mb-10 flex max-w-5xl flex-col gap-4">
      <div className="flex flex-col gap-4">
        {searchResults.map((result, i) => (
          <Fragment key={result.id}>
            {!result.user && i !== 0 && searchResults[i - 1]?.user ? (
              <Separator />
            ) : null}
            <CardRoot
              href={createURL(result.id, result.user ? "video" : "channel")}
              className={`gap-3 ${result.user ? "xs:flex-row xs:pb-0 pb-4" : "xs:px-0 flex-row px-4"}`}
            >
              <Link
                href={`/watch?v=${result.id}`}
                className={`
                  ring-ring xs:max-w-[360px] relative z-10 w-full outline-hidden duration-200 hover:opacity-90
                  focus-visible:ring-2
                  ${
                    result.user
                      ? `xs:max-h-[230px]`
                      : `xs:max-h-[136px] xs:w-full flex w-[136px] justify-center rounded-full`
                  } xs:rounded-xl`}
              >
                <Image
                  src={result.image}
                  alt={result.label}
                  width={result.user ? 360 : 136}
                  height={result.user ? 230 : 136}
                  className={`object-cover ${
                    result.user
                      ? "xs:rounded-xl aspect-video w-full"
                      : `aspect-square rounded-full`
                  }`}
                />
              </Link>
              <CardContent className="xs:mt-0.5 xs:px-0.5 mt-0 flex-col px-2.5 md:px-0.5">
                <Link
                  href={`/watch?v=${result.id}`}
                  title={result.label}
                  className={`
                    ring-ring z-10 size-fit rounded-md pr-14 duration-200 hover:opacity-90 focus:outline-hidden
                    focus-visible:ring-2
                  `}
                >
                  <CardTitle
                    className="xs:text-lg max-h-max overflow-auto text-base"
                    titleMaxChars={50}
                  >
                    {result.label}
                  </CardTitle>
                </Link>
                {result.user ? (
                  <>
                    <Link
                      className={`
                        group ring-ring z-10 flex size-fit items-center gap-2 rounded-md outline-hidden duration-200
                        focus:ring-2
                      `}
                      href={`/channel/${result.user.id}`}
                      title={result.user.username}
                    >
                      <Image
                        src={result.user.image}
                        alt={result.user.username}
                        width={28}
                        height={28}
                        className="aspect-square rounded-full object-cover"
                      />
                      <span className="text-sm opacity-60 duration-200 group-hover:opacity-100">
                        {result.user.username}
                      </span>
                    </Link>
                    <VideoCardOptionsMenu videoId={result.id} />
                  </>
                ) : null}
              </CardContent>
            </CardRoot>
            {!result.user ? (
              <Separator
                className={`${!searchResults[i + 1]?.user ? "xs:hidden flex" : ""}`}
              />
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
