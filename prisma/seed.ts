/* eslint-disable no-console */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/env";
import { Prisma, PrismaClient } from "@/lib/prisma";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface createUserParams {
  externalId: string;
  username: string;
  email: string;
  image?: string;
}
interface createVideoParams {
  title: string;
  thumb: string;
  duration: string;
  youtubeId: string;
  userId: string;
}
interface createPlaylistParams {
  name: string;
  isPublic?: boolean;
  userId: string;
  videosId?: { id: string }[];
}

async function createUser(params: createUserParams) {
  const { externalId, username, email, image } = params;
  return await prisma.user.create({
    data: {
      externalId,
      username,
      email,
      image: image || Prisma.skip,
    },
  });
}
async function createVideo(params: createVideoParams) {
  const { title, thumb, youtubeId, userId, duration } = params;
  return await prisma.video.create({
    data: {
      title,
      thumb,
      duration,
      youtubeId,
      userId,
    },
  });
}
async function createPlaylist(params: createPlaylistParams) {
  const { name, isPublic = true, userId, videosId = [] } = params;
  return await prisma.playlist.create({
    data: {
      name,
      isPublic,
      userId,
      videos: { connect: videosId },
    },
  });
}

async function main() {
  console.log("\n🌱Starting seeding...🌱\n");

  const user1 = await createUser({
    email: "test@email.com",
    externalId: "374rgfbyhwedb8yb342",
    username: "test",
  });
  console.log(`Created user with id: ${user1.id}`);

  const video1 = await createVideo({
    title: "MAGIC FLUIDS HDR // 4K MACRO COLORS // HDR VISUALS // FLUID ART //",
    thumb: "https://i.ytimg.com/vi/1MieluM0c6c/maxresdefault.jpg",
    duration: "02:39",
    youtubeId: "1MieluM0c6c",
    userId: user1.id,
  });
  console.log(`Created video with id: ${video1.id}`);

  const video2 = await createVideo({
    title: "Fluid Sim Hue Test",
    thumb: "https://i.ytimg.com/vi/qC0vDKVPCrw/maxresdefault.jpg",
    duration: "03:27",
    youtubeId: "qC0vDKVPCrw",
    userId: user1.id,
  });
  console.log(`Created video with id: ${video2.id}`);

  const video3 = await createVideo({
    title: "Fluid Sim Hue Test 2",
    thumb: "https://i.ytimg.com/vi/Gt6wKDnG0xA/sddefault.jpg",
    duration: "07:22",
    youtubeId: "Gt6wKDnG0xA",
    userId: user1.id,
  });
  console.log(`Created video with id: ${video3.id}`);

  const playlist1 = await createPlaylist({
    name: "Musics",
    userId: user1.id,
    videosId: [{ id: video1.id }, { id: video2.id }],
  });
  console.log(`Created playlist with id: ${playlist1.id}`);
}

main()
  .then(async () => {
    return await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
