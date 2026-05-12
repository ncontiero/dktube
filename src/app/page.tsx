import { unstable_cache } from "next/cache";
import {
  VideoCardChannel,
  VideoCardChannelImage,
  VideoCardChannelName,
  VideoCardInfo,
  VideoCardRoot,
  VideoCardThumb,
  VideoCardTitle,
} from "@/components/VideoCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const cachedVideos = unstable_cache(
    async () =>
      await prisma.video.findMany({
        include: { user: true },
      }),
    ["videos"],
    { tags: ["videos"], revalidate: 60 * 60 },
  );
  const videos = await cachedVideos();

  return (
    <div className="my-4 flex w-full justify-center gap-4 xs:mt-6 xs:max-w-(--breakpoint-2xl) md:mx-auto xl:mt-12">
      <div className="flex w-full grid-cols-2 flex-col gap-4 xs:grid xs:px-4 mdl:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCardRoot key={video.id} video={video}>
            <VideoCardThumb />
            <VideoCardInfo className="relative mt-2">
              <VideoCardChannel className="size-9 rounded-full md:mt-1">
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
