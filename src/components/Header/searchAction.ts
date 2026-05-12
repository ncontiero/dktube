"use server";

import { redirect } from "next/navigation";
import { searchVideosSchema } from "@/actions/schema";
import { actionClient } from "@/lib/safe-action";

export const searchVideosAction = actionClient
  .inputSchema(searchVideosSchema)
  .action(({ clientInput: { search } }) => {
    redirect(`/search?q=${search}`);
  });
