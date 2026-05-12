import { auth } from "@clerk/nextjs/server";
import {
  ChevronRight,
  CircleUser,
  Clock,
  History,
  Home,
  ListVideo,
  LogIn,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { env } from "@/env";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "./ui/Sidebar";

// Menu items.
const items = [
  {
    label: "Você",
    icon: CircleUser,
    href: "/feed/you",
  },
  {
    label: "Histórico",
    icon: History,
    href: "/feed/history",
  },
];
const authItems = [
  { ...items[1]! },
  {
    label: "Playlists",
    icon: ListVideo,
    href: "/feed/playlists",
  },
  {
    label: "Assistir mais tarde",
    icon: Clock,
    href: "/playlist/WL",
  },
  {
    label: "Vídeos curtidos",
    icon: ThumbsUp,
    href: "/playlist/LL",
  },
];

const currentYear = new Date().getFullYear();

export async function AppSidebar() {
  const { userId } = await auth();

  return (
    <Sidebar collapsible="icon" className="z-99999">
      <SidebarHeader>
        <SidebarRail />
        <SidebarMenu className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="group-data-[collapsible=icon]:mt-2.5"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <div className="mt-1 group-data-[collapsible=icon]:size-full group-data-[collapsible=icon]:pl-1.5">
                  <SidebarTrigger />
                </div>
                <div className="grid flex-1 truncate text-left text-sm/tight">
                  <span className="rounded-md p-2 ring-ring duration-200 focus:ring-2 focus:outline-hidden">
                    <Logo />
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Início" className="gap-4">
                  <Link href="/" className="flex items-center">
                    <Home />
                    <span className="mt-0.5">Início</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        {userId ? (
          <SidebarGroup>
            <SidebarGroupLabel
              className={`
                h-9 duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2
                active:bg-sidebar-accent active:text-sidebar-accent-foreground
              `}
              asChild
            >
              <Link
                href="/feed/you"
                className="group-data-[collapsible=icon]:hidden"
              >
                <span>Você</span>
                <ChevronRight />
              </Link>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {authItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      className="gap-4"
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        className="gap-4"
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  <SidebarMenuItem className="px-2 group-data-[collapsible=icon]:hidden">
                    Faça login para curtir vídeos, comentar e se inscrever.
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mt-1">
                    <SidebarMenuButton
                      asChild
                      tooltip="Fazer login"
                      className="gap-4"
                    >
                      <Link href="/sign-in">
                        <LogIn />
                        <span>Fazer login</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="gap-4">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Github do projeto"
              className="gap-4"
            >
              <a
                href="https://github.com/ncontiero/dktube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Github do projeto
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="px-3.5 text-sm text-foreground/70 group-data-[collapsible=icon]:hidden">
            <span className="text-sm text-foreground/70">
              © {currentYear} {env.SITE_NAME}
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
