import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import DeleteListButton from "@/components/DeleteListButton";
import RemoveMovieButton from "@/components/RemoveMovieButton";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { tmdbFetch } from "@/lib/tmdb";

type MovieDetails = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

async function getMovie(
  movieId: number
): Promise<MovieDetails | null> {
  try {
    return await tmdbFetch<MovieDetails>(
      `/movie/${movieId}?language=en-US`
    );
  } catch {
    return null;
  }
}

export default async function MovieListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const { id } = await params;

  const list = await prisma.movieList.findFirst({
    where: {
      id,
      user: {
        email: session.user.email,
      },
    },
    include: {
      items: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!list) {
    notFound();
  }

  const movies = await Promise.all(
    list.items.map(async (item) => {
      const movie = await getMovie(item.movieId);

      return {
        ...item,
        movie,
      };
    })
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">

          {/* Back */}
          <Link
            href="/lists"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to My Lists
          </Link>

          {/* Header */}
          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                  Private Collection
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                  {list.name}
                </h1>

                <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
                  {list.description ||
                    "No description added for this collection."}
                </p>

                <div className="mt-5 text-sm text-zinc-500">
                  {list.items.length}{" "}
                  {list.items.length === 1
                    ? "movie"
                    : "movies"}
                </div>
              </div>

              {/* Delete List */}
              <DeleteListButton listId={list.id} />

            </div>
          </section>

          {/* Movies */}
          {movies.length === 0 ? (
            <section className="mt-10 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-12 text-center">
              <div className="text-5xl">
                🎬
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                This list is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-zinc-500">
                Add movies to this private collection
                from their movie pages.
              </p>
            </section>
          ) : (
            <section className="mt-10">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                {movies.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
                  >
                    <Link
                      href={`/movies/${item.movieId}`}
                    >
                      <div className="relative aspect-[2/3] bg-zinc-800">
                        {item.movie?.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${item.movie.poster_path}`}
                            alt={item.movie.title}
                            fill
                            unoptimized
                            className="object-cover transition duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                            No poster
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4">
                      {item.movie ? (
                        <>
                          <Link
                            href={`/movies/${item.movieId}`}
                            className="font-semibold transition hover:text-red-400"
                          >
                            {item.movie.title}
                          </Link>

                          <div className="mt-2 flex justify-between text-sm">
                            <span className="text-zinc-500">
                              {item.movie.release_date
                                ? item.movie.release_date.slice(
                                    0,
                                    4
                                  )
                                : "N/A"}
                            </span>

                            <span className="text-yellow-400">
                              ★{" "}
                              {item.movie.vote_average.toFixed(
                                1
                              )}
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-zinc-500">
                          Movie unavailable
                        </p>
                      )}

                      {/* Remove Movie */}
                      <RemoveMovieButton
                        listId={list.id}
                        movieId={item.movieId}
                      />
                    </div>
                  </div>
                ))}

              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}