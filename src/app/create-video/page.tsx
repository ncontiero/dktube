import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { CreateVideoForm } from "./CreateVideoForm";

export const metadata: Metadata = {
  title: "Criar vídeo",
};

export default async function CreateVideoPage() {
  await auth.protect();

  return (
    <div className="mt-20 flex justify-center">
      <CreateVideoForm />
    </div>
  );
}
