import { Show } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, FilePlus, Search } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Logo } from "../Logo";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import { SidebarTrigger } from "../ui/Sidebar";
import { SearchForm } from "./SearchForm";
import { ThemeToggle } from "./ThemeToggle";
import { UserButton } from "./UserButton";

const getChannel = unstable_cache(
  async (externalId: string) => {
    return prisma.user.findUnique({
      where: { externalId },
    });
  },
  ["my-channel"],
  { tags: ["my-channel"], revalidate: 60 * 60 },
);

export async function Header() {
  const user = await currentUser();
  const channel = user?.id ? await getChannel(user.id) : null;

  return (
    <header
      className={`
        fixed top-0 z-9999 flex h-14 w-full items-center border-b bg-secondary/60 pr-3 pl-2 backdrop-blur-md sm:h-16
        sm:pr-6 sm:pl-4
      `}
    >
      <div className="flex size-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="mt-1 sm:mt-0" />
          <Link
            href="/"
            title="Ir para o inicio"
            className="rounded-md py-2 pl-1 ring-ring duration-200 focus:ring-2 focus:outline-hidden sm:px-3 sm:py-4"
          >
            <Logo />
          </Link>
        </div>
        <SearchForm />
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full lg:hidden"
                size="icon"
              >
                <Search />
              </Button>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent
                variant="custom"
                className="flex h-14 w-full p-0 sm:h-16 sm:rounded-none"
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>Pesquisar</DialogTitle>
                  <DialogDescription>
                    Encontre vídeos, músicas e mais.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex size-full items-center gap-4 bg-secondary pr-4 pl-2 xs:pr-8">
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      title="Voltar"
                      aria-label="Voltar"
                    >
                      <ArrowLeft />
                    </Button>
                  </DialogClose>
                  <SearchForm size="sm" />
                </div>
              </DialogContent>
            </DialogPortal>
          </Dialog>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className={`
                flex size-full items-center justify-center gap-2 rounded-full p-2 font-bold uppercase ring-ring
                duration-200 hover:text-primary focus:text-primary focus:ring-2 focus:outline-hidden active:opacity-70
                sm:w-auto sm:rounded-3xl sm:px-4 sm:py-2
              `}
            >
              Login
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/create-video"
              title="Criar vídeo"
              className={`
                rounded-full p-2 ring-ring outline-hidden duration-200 hover:bg-foreground/20 focus-visible:ring-2
                active:bg-foreground/30
              `}
            >
              <FilePlus />
            </Link>
            <UserButton channelId={channel?.id || null} />
          </Show>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
