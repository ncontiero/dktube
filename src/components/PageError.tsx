import Link from "next/link";

interface PageErrorProps {
  readonly title: string;
  readonly description: string;
}

export function PageError({ title, description }: PageErrorProps) {
  return (
    <main className="mt-20 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-wide">{title}</h1>
      <p className="mt-4 text-lg">{description}</p>
      <p className="mt-2 text-base">
        Por favor, volte para a{" "}
        <Link
          href="/"
          className={`
            rounded-md text-primary underline-offset-2 ring-ring duration-200 hover:text-primary/80 hover:underline
            focus:ring-2 focus:outline-hidden active:opacity-70
          `}
        >
          página inicial
        </Link>
        .
      </p>
    </main>
  );
}
