import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import MyListsSection from "@/components/MyListsSection";
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

type FavoriteWithMovie = {
  id: string;
  movieId: number;
  position: number;
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

export default async function ProfilePage() {
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
      name: true,
      image: true,

      favorites: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          movieId: true,
          position: true,
        },
      },

      quizAttempts: {
        orderBy: {
          startedAt: "desc",
        },
        take: 3,
        select: {
          id: true,
          score: true,
          totalQuestions: true,
          startedAt: true,
          completedAt: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  const favoriteMovies = await Promise.all(
    user.favorites.map(
      async (
        favorite: FavoriteWithMovie
      ) => {
        const movie = await getMovie(
          favorite.movieId
        );

        return {
          ...favorite,
          movie,
        };
      }
    )
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0b0908] px-6 py-16 text-[#f3ead7]">
        <div className="mx-auto max-w-7xl">

          {/* ================================================== */}
          {/* PROFILE HEADER */}
          {/* ================================================== */}

          <section className="relative overflow-hidden border border-[#5a4328] bg-[#11100e]">

            {/* Background glow */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(113,35,35,0.20),transparent_45%)]" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_90%,rgba(184,145,72,0.08),transparent_40%)]" />

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0908]/30" />
            </div>

            <div className="relative p-8 sm:p-10">

              <div className="flex flex-col gap-8 sm:flex-row sm:items-center">

                {/* Profile image */}
                {user.image ? (
                  <div className="relative shrink-0">

                    <div className="absolute -inset-1 rounded-full border border-[#80633a]" />

                    <Image
                      src={user.image}
                      alt={
                        user.name ||
                        "Profile"
                      }
                      width={104}
                      height={104}
                      className="relative rounded-full border-2 border-[#5a4328] object-cover"
                      unoptimized
                    />

                  </div>
                ) : (
                  <div className="flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-full border-2 border-[#80633a] bg-[#17120f] font-serif text-4xl text-[#c5a15b]">
                    {(user.username ||
                      user.name ||
                      "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                {/* Profile information */}
                <div>

                  <div className="flex items-center gap-3">

                    <div className="h-px w-8 bg-[#c5a15b]" />

                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#c5a15b]">
                      FilmoraX Profile
                    </p>

                    <div className="h-px w-8 bg-[#c5a15b]" />

                  </div>

                  <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-[#f5ead3] sm:text-5xl">
                    {user.username ||
                      user.name ||
                      "FilmoraX User"}
                  </h1>

                  {user.name &&
                    user.username && (
                      <p className="mt-3 text-[#9f917d]">
                        {user.name}
                      </p>
                    )}

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[#756754]">
                    Your personal cinema archive.
                    Keep your favorite films,
                    private collections, and quiz
                    performances all in one place.
                  </p>

                </div>
              </div>
            </div>

            {/* Film strip */}
            <div className="flex h-8 items-center justify-around border-t border-[#3a2b20] bg-[#0b0908] opacity-70">
              {Array.from({
                length: 18,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-3 w-5 rounded-sm border border-[#80633a]/40"
                />
              ))}
            </div>
          </section>

          {/* ================================================== */}
          {/* FAVORITE MOVIES */}
          {/* ================================================== */}

          <section className="mt-16">

            <div className="border-b border-[#3a2b20] pb-7">

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b9934f]">
                Your Collection
              </p>

              <h2 className="mt-3 font-serif text-4xl font-semibold text-[#f3ead7]">
                My 5 Favorite Movies
              </h2>

              <p className="mt-3 text-[#756754]">
                Your personal top five movies.
              </p>

            </div>

            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

              {[1, 2, 3, 4, 5].map(
                (position) => {
                  const favorite =
                    favoriteMovies.find(
                      (item) =>
                        item.position ===
                        position
                    );

                  return (
                    <div
                      key={position}
                      className="group overflow-hidden border border-[#3a2b20] bg-[#15110e] transition duration-500 hover:-translate-y-2 hover:border-[#80633a]"
                    >

                      {/* Poster */}
                      <div className="relative aspect-[2/3] overflow-hidden bg-[#11100e]">

                        {favorite?.movie
                          ?.poster_path ? (
                          <Link
                            href={`/movies/${favorite.movie.id}`}
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/w500${favorite.movie.poster_path}`}
                              alt={
                                favorite.movie
                                  .title
                              }
                              fill
                              unoptimized
                              className="object-cover transition duration-700 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          </Link>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center px-4 text-center">

                            <span className="font-serif text-4xl text-[#80633a]">
                              #{position}
                            </span>

                            <span className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#625544]">
                              Empty Favorite
                            </span>

                          </div>
                        )}

                        {/* Position badge */}
                        <div className="absolute left-3 top-3 border border-[#c5a15b]/60 bg-[#0b0908]/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d0ae68] backdrop-blur-sm">
                          #{position}
                        </div>

                      </div>

                      {/* Movie details */}
                      <div className="p-4">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#806f59]">
                          Favorite #{position}
                        </p>

                        {favorite?.movie ? (
                          <>
                            <Link
                              href={`/movies/${favorite.movie.id}`}
                              className="mt-2 block line-clamp-2 font-serif text-lg font-semibold leading-tight text-[#eee1ca] transition hover:text-[#c5a15b]"
                            >
                              {
                                favorite.movie
                                  .title
                              }
                            </Link>

                            <div className="mt-3 flex items-center justify-between text-xs">

                              <span className="text-[#756754]">
                                {favorite.movie
                                  .release_date
                                  ? favorite.movie.release_date.slice(
                                      0,
                                      4
                                    )
                                  : "N/A"}
                              </span>

                              <span className="text-[#d0ae68]">
                                ★{" "}
                                {favorite.movie.vote_average.toFixed(
                                  1
                                )}
                              </span>

                            </div>
                          </>
                        ) : (
                          <p className="mt-2 text-sm text-[#625544]">
                            Choose a movie for
                            this slot.
                          </p>
                        )}

                      </div>
                    </div>
                  );
                }
              )}

            </div>
          </section>

          {/* ================================================== */}
          {/* PRIVATE LISTS */}
          {/* ================================================== */}

          <MyListsSection />

          {/* ================================================== */}
          {/* QUIZ HISTORY */}
          {/* ================================================== */}

          <section className="mt-16">

            <div className="border-b border-[#3a2b20] pb-7">

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b9934f]">
                Your Game Activity
              </p>

              <h2 className="mt-3 font-serif text-4xl font-semibold text-[#f3ead7]">
                Quiz History
              </h2>

              <p className="mt-3 text-[#756754]">
                Your 3 most recent FilmoraX quiz
                attempts.
              </p>

            </div>

            {/* No attempts */}
            {user.quizAttempts.length ===
            0 ? (
              <div className="mt-8 border border-dashed border-[#4a3928] bg-[#11100e] p-10 text-center">

                <div className="font-serif text-5xl text-[#80633a]">
                  ◆
                </div>

                <h3 className="mt-5 font-serif text-2xl font-semibold text-[#d9c7a8]">
                  No quiz attempts yet
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#756754]">
                  Complete a movie quiz and
                  your score will appear here.
                </p>

                <Link
                  href="/quiz"
                  className="mt-6 inline-flex border border-[#c5a15b] bg-[#b9934f] px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#100d09] transition hover:bg-[#d0ae68]"
                >
                  Play Quiz
                </Link>

              </div>
            ) : (
              <div className="mt-8 overflow-hidden border border-[#3a2b20] bg-[#11100e]">

                <div className="divide-y divide-[#2c231b]">

                  {user.quizAttempts.map(
                    (attempt) => {
                      const percentage =
                        Math.round(
                          (attempt.score /
                            attempt.totalQuestions) *
                            100
                        );

                      return (
                        <div
                          key={attempt.id}
                          className="flex flex-col gap-5 p-6 transition hover:bg-[#15110e] sm:flex-row sm:items-center sm:justify-between"
                        >

                          <div>

                            <div className="flex items-center gap-3">

                              <span className="text-[#c5a15b]">
                                ◆
                              </span>

                              <p className="font-serif text-lg font-semibold text-[#eee1ca]">
                                Quiz Attempt
                              </p>

                            </div>

                            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[#625544]">
                              {new Date(
                                attempt.startedAt
                              ).toLocaleDateString()}
                            </p>

                          </div>

                          <div className="flex items-center gap-8">

                            <div className="text-right">

                              <p className="font-serif text-2xl font-semibold text-[#c5a15b]">
                                {
                                  attempt.score
                                }
                                /
                                {
                                  attempt.totalQuestions
                                }
                              </p>

                              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#625544]">
                                {percentage}%
                              </p>

                            </div>

                            <div className="text-2xl">
                              {percentage >=
                              80
                                ? "🏆"
                                : percentage >=
                                    60
                                  ? "🎯"
                                  : "🎬"}
                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                {/* Quiz button */}
                <div className="border-t border-[#3a2b20] p-5 text-center">

                  <Link
                    href="/quiz"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b9934f] transition hover:text-[#e0bd70]"
                  >
                    Play Another Quiz →
                  </Link>

                </div>

              </div>
            )}

          </section>

          {/* ================================================== */}
          {/* BOTTOM CINEMA CTA */}
          {/* ================================================== */}

          <section className="mt-16">

            <div className="relative overflow-hidden border border-[#5a4328] bg-[#15110e] px-8 py-16 text-center sm:px-16">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,145,72,0.10),transparent_60%)]" />

              <div className="relative">

                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#b9934f]">
                  The Show Goes On
                </p>

                <h2 className="mt-4 font-serif text-4xl font-semibold text-[#f3ead7] sm:text-5xl">
                  Discover another story.
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-[#756754]">
                  There is always another film
                  waiting to become part of your
                  collection.
                </p>

                <Link
                  href="/movies"
                  className="mt-8 inline-flex border border-[#c5a15b] bg-[#b9934f] px-7 py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#100d09] transition hover:bg-[#d0ae68]"
                >
                  Browse Films
                </Link>

              </div>

            </div>

          </section>

        </div>
      </main>
    </>
  );
}