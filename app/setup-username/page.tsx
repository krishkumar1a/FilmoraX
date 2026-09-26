import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import UsernameForm from "@/components/UsernameForm";

export default async function SetupUsernamePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      name: true,
      username: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  if (user.username) {
    redirect("/");
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Welcome to FilmoraX
          </p>

          <h1 className="text-3xl font-bold text-white">
            Choose your username
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {user.name
              ? `Hi ${user.name}! Choose a unique username for your FilmoraX profile.`
              : "Choose a unique username for your FilmoraX profile."}
          </p>
        </div>

        <UsernameForm />
      </div>
    </main>
  );
}