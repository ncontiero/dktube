"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";
import { UserIcon } from "lucide-react";

interface UserButtonProps {
  readonly channelId: string | null;
}

export function UserButton({ channelId }: UserButtonProps) {
  return (
    <ClerkUserButton userProfileMode="modal">
      {channelId ? (
        <ClerkUserButton.MenuItems>
          <ClerkUserButton.Link
            labelIcon={<UserIcon size={18} />}
            label="Canal"
            href={`/channel/${channelId}`}
          >
            Canal
          </ClerkUserButton.Link>
        </ClerkUserButton.MenuItems>
      ) : null}
    </ClerkUserButton>
  );
}
