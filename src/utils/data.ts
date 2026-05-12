import type { PlaylistProps, VideoProps } from "./types";
import { type Prisma, type User, prisma } from "@/lib/prisma";

interface PlaylistInput {
  id: string;
  name: string;
  user: User;
  videos?: VideoProps[];
}

const createPlaylistObj = ({
  id,
  name,
  user,
  videos = [],
}: PlaylistInput): PlaylistProps => ({
  id,
  name,
  isPublic: false,
  user,
  videos,
  createdAt: new Date(),
  userId: user.id,
});

export const watchLaterObj = (
  user: User,
  videos: VideoProps[] = [],
): PlaylistProps =>
  createPlaylistObj({
    id: "WL",
    name: "Assistir mais tarde",
    user,
    videos,
  });

export const likedVideosObj = (
  user: User,
  videos: VideoProps[] = [],
): PlaylistProps =>
  createPlaylistObj({
    id: "LL",
    name: "Vídeos curtidos",
    user,
    videos,
  });

type UserPayload<T extends Prisma.UserInclude> = Prisma.UserGetPayload<{
  include: T;
}>;

export const getUser = async <T extends Prisma.UserInclude>(
  userExternalId: string,
  include: T,
): Promise<UserPayload<T> | null> => {
  if (!userExternalId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { externalId: userExternalId },
    include,
  });
};

export const getWatchLater = async (
  userExternalId: string,
): Promise<PlaylistProps | null> => {
  const user = await getUser(userExternalId, {
    watchLater: { include: { user: true } },
  });
  if (!user) return null;
  return watchLaterObj(user, user.watchLater ?? []);
};

export const getLikedVideos = async (
  userExternalId: string,
): Promise<PlaylistProps | null> => {
  const user = await getUser(userExternalId, {
    likedVideos: { include: { user: true } },
  });
  if (!user) return null;
  return likedVideosObj(user, user.likedVideos ?? []);
};
