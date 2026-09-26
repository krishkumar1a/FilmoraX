import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ListsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      username: true,
      movieLists: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                Private Collections
              </p>

              <h1 className="mt-2 text-4xl font-bold">
                My Movie Lists
              </h1>

              <p className="mt-3 text-zinc-400">
                Create private collections of movies for yourself.
              </p>
            </div>

            <Link
              href="/lists/new"
              className="inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 font-semibold transition hover:bg-red-600"
            >
              + Create List
            </Link>
          </div>

          {/* Lists */}
          {user.movieLists.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-12 text-center">
              <div className="text-5xl">🎬</div>

              <h2 className="mt-5 text-2xl font-bold">
                No lists yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-zinc-500">
                Create your first private movie collection and
                start organizing your favorite films.
              </p>

              <Link
                href="/lists/new"
                className="mt-6 inline-flex rounded-xl bg-red-500 px-6 py-3 font-semibold transition hover:bg-red-600"
              >
                Create Your First List
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {user.movieLists.map((list) => (
                <Link
                  key={list.id}
                  href={`/lists/${list.id}`}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold transition group-hover:text-red-400">
                        {list.name}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {list.description ||
                          "No description added."}
                      </p>
                    </div>

                    <span className="text-2xl">🎬</span>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4 text-sm">
                    <span className="text-zinc-500">
                      {list._count.items}{" "}
                      {list._count.items === 1
                        ? "movie"
                        : "movies"}
                    </span>

                    <span className="text-red-400">
                      Open →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Privacy Notice */}
          <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-sm text-zinc-500">
            🔒 Your movie lists are private. Only you can view
            and manage them.
          </div>
        </div>
      </main>
    </>
  );
}