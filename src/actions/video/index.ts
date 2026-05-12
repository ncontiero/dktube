"use server";

import { updateTag } from "next/cache";
import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { formatDuration, getMostQualityThumb } from "@/utils/youtube";
import {
  createVideoSchema,
  likeVideoSchema,
  removeVideoSchema,
} from "./schema";

interface YoutubeAPIResponse {
  items: {
    contentDetails: {
      duration: string;
    };
  }[];
}

export const createVideoAction = authActionClient
  .inputSchema(createVideoSchema)
  .action(async ({ clientInput: { title, youtubeId }, ctx: { user } }) => {
    const thumb = await getMostQualityThumb(youtubeId);
    if (!thumb) {
      throw new Error("Houve um erro ao obter a thumbnail do vídeo!");
    }

    const request = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${env.GC_API_KEY}&part=contentDetails`,
    );
    if (!request.ok) {
      throw new Error("Houve um erro ao obter os detalhes do vídeo!");
    }

    const details = (await request.json()) as YoutubeAPIResponse;
    const detailsItems = details?.items;
    if (detailsItems == null || detailsItems.length === 0) {
      throw new Error("Vídeo não encontrado no YouTube!");
    }

    const video = detailsItems[0];
    if (!video) {
      throw new Error("Vídeo não encontrado no YouTube!");
    }

    const ytDuration = video.contentDetails.duration;
    const duration = formatDuration(ytDuration);

    try {
      await prisma.video.create({
        data: {
          title,
          youtubeId,
          thumb,
          duration,
          user: { connect: { externalId: user.id } },
        },
      });
    } catch {
      throw new Error("Houve um erro ao criar o vídeo!");
    }

    updateTag("videos");
  });

export const likeVideoAction = authActionClient
  .inputSchema(likeVideoSchema)
  .action(async ({ clientInput: { videoId }, ctx: { user } }) => {
    const video = await prisma.video.findFirst({
      where: { id: videoId },
      select: { id: true, likedVideosUsers: { select: { externalId: true } } },
    });

    if (!video) {
      throw new Error("Vídeo não encontrado!");
    }

    const connected = video.likedVideosUsers.some(
      (v) => v.externalId === user.id,
    );
    try {
      await prisma.user.update({
        where: { externalId: user.id },
        data: {
          likedVideos: {
            [connected ? "disconnect" : "connect"]: {
              id: video.id,
            },
          },
        },
      });
    } catch {
      throw new Error("Houve um erro ao curtir o vídeo!");
    }

    updateTag(`video:${videoId}`);
    updateTag(`isLiked:${user.id}:${videoId}`);
    updateTag(`feed:${user.id}`);
    updateTag(`likedVideos:${user.id}`);

    return { hasAdded: !connected };
  });

export const removeVideoAction = authActionClient
  .inputSchema(removeVideoSchema)
  .action(async ({ clientInput: { videoId }, ctx: { user } }) => {
    const video = await prisma.video.findFirst({
      where: { id: videoId, user: { externalId: user.id } },
    });

    if (!video) {
      throw new Error("Vídeo não encontrado!");
    }

    try {
      await prisma.video.delete({
        where: { id: video.id },
      });
    } catch {
      throw new Error("Houve um erro ao remover o vídeo!");
    }

    updateTag("videos");
    updateTag(`video:${video.id}`);
    updateTag(`feed:${user.id}`);
  });
