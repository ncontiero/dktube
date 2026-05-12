"use server";

import type { PlaylistProps } from "@/utils/types";
import { unstable_cache, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, prismaSkip } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { getLikedVideos, getWatchLater } from "@/utils/data";
import {
  createPlaylistSchema,
  deletePlaylistSchema,
  handleVideoFromPlaylistSchema,
  updatePlaylistSchema,
} from "./schema";

export const createPlaylistAction = authActionClient
  .inputSchema(createPlaylistSchema)
  .action(
    async ({
      clientInput: { name, isPublic = false, videoId },
      ctx: { user },
    }) => {
      try {
        await prisma.playlist.create({
          data: {
            name,
            user: { connect: { externalId: user.id } },
            videos: videoId ? { connect: { id: videoId } } : prismaSkip,
            isPublic,
          },
        });
      } catch {
        throw new Error("Houve um erro ao criar a playlist!");
      }

      updateTag(`feed:${user.id}`);
      updateTag(`feed:playlists:${user.id}`);
      updateTag(`playlists:${user.id}`);
      updateTag(`playlists`);
    },
  );

export const updatePlaylistAction = authActionClient
  .inputSchema(updatePlaylistSchema)
  .action(
    async ({ clientInput: { id, name, isPublic = false }, ctx: { user } }) => {
      const playlist = await prisma.playlist.findUnique({
        where: { id, user: { externalId: user.id } },
      });

      if (!playlist) {
        throw new Error("Playlist não encontrada!");
      }

      try {
        await prisma.playlist.update({
          where: { id },
          data: {
            name,
            isPublic,
          },
        });
      } catch {
        throw new Error("Houve um erro ao editar a playlist!");
      }

      updateTag(`playlist:${id}`);
      updateTag(`feed:${user.id}`);
      updateTag(`feed:playlists:${user.id}`);
      updateTag(`playlists:${user.id}`);
    },
  );

export const deletePlaylistAction = authActionClient
  .inputSchema(deletePlaylistSchema)
  .action(async ({ clientInput: { id }, ctx: { user } }) => {
    try {
      const playlist = await prisma.playlist.findUnique({
        where: { id },
        include: { user: { select: { externalId: true } } },
      });

      if (!playlist) {
        throw new Error("Playlist não encontrada!");
      }
      if (playlist.user.externalId !== user.id) {
        throw new Error("Você não tem permissão para excluir esta playlist!");
      }

      await prisma.playlist.delete({
        where: { id },
      });
    } catch {
      throw new Error("Houve um erro ao excluir a playlist!");
    }

    updateTag(`playlist:${id}`);
    updateTag(`feed:${user.id}`);
    updateTag(`feed:playlists:${user.id}`);
    updateTag(`playlists:${user.id}`);

    redirect("/feed/playlists");
  });

export const handleVideoFromPlaylistAction = authActionClient
  .inputSchema(handleVideoFromPlaylistSchema)
  .action(async ({ clientInput: { videoId, playlistId }, ctx: { user } }) => {
    const playlist =
      playlistId === "LL"
        ? await getLikedVideos(user.id)
        : playlistId === "WL"
          ? await getWatchLater(user.id)
          : await prisma.playlist.findUnique({
              where: { id: playlistId },
              include: { videos: true, user: { select: { externalId: true } } },
            });

    if (!playlist) {
      throw new Error("Playlist não encontrada!");
    }

    if (playlist.user.externalId !== user.id) {
      throw new Error("Você não tem permissão para editar esta playlist!");
    }

    const connected = playlist.videos.some((v) => v.id === videoId);

    const revalidateTags = () => {
      updateTag(`playlist:${playlistId}`);
      updateTag(`feed:${user.id}`);
      updateTag(`feed:playlists:${user.id}`);
      updateTag(`playlists:${user.id}`);
      updateTag(`watchLater:${user.id}`);
    };

    if (playlistId === "LL") {
      await prisma.user.update({
        where: { externalId: user.id },
        data: {
          likedVideos: {
            [connected ? "disconnect" : "connect"]: {
              id: videoId,
            },
          },
        },
      });

      revalidateTags();
      return { hasAdded: !connected };
    }

    if (playlistId === "WL") {
      await prisma.user.update({
        where: { externalId: user.id },
        data: {
          watchLater: {
            [connected ? "disconnect" : "connect"]: {
              id: videoId,
            },
          },
        },
      });

      revalidateTags();
      return { hasAdded: !connected };
    }

    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        videos: {
          [connected ? "disconnect" : "connect"]: {
            id: videoId,
          },
        },
      },
    });

    revalidateTags();
    return { hasAdded: !connected };
  });

export const getWatchLaterAction = authActionClient.action(
  async ({ ctx: { user } }) => {
    const cachedWatchLater = unstable_cache(
      async () => getWatchLater(user.id),
      [`watchLater:${user.id}`],
      { tags: ["watchLater", `watchLater:${user.id}`], revalidate: 60 },
    );

    return cachedWatchLater();
  },
);

export const getMyPlaylistsAction = authActionClient.action(
  async ({ ctx: { user } }) => {
    const cachedPlaylists = unstable_cache(
      async () =>
        (await prisma.playlist.findMany({
          where: { user: { externalId: user.id } },
          include: { videos: { include: { user: true } }, user: true },
        })) as PlaylistProps[],
      [`playlists:${user.id}`],
      { tags: ["playlists", `playlists:${user.id}`], revalidate: 60 },
    );

    const playlists = await cachedPlaylists();
    const watchLater = (await getWatchLaterAction())?.data || null;

    if (!watchLater) {
      return playlists;
    }

    return [watchLater, ...playlists];
  },
);
