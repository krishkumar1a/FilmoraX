import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import MovieReviews from "@/components/MovieReviews";
import FavoriteButton from "@/components/FavoriteButton";
import AddToListButton from "@/components/AddToListButton";
import { tmdbFetch } from "@/lib/tmdb";

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  genres: {
    id: number;
    name: string;
  }[];
};

type MovieCredits = {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];

  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
  }[];
};

async function getMovie(
  id: string
): Promise<MovieDetails> {
  const movieId = Number(id);

  if (!Number.isInteger(movieId)) {
    notFound();
  }

  try {
    return await tmdbFetch<MovieDetails>(
      `/movie/${movieId}?language=en-US`
    );
  } catch {
    notFound();
  }
}

async function getMovieCredits(
  id: string
): Promise<MovieCredits> {
  const movieId = Number(id);

  if (!Number.isInteger(movieId)) {
    notFound();
  }

  try {
    return await tmdbFetch<MovieCredits>(
      `/movie/${movieId}/credits?language=en-US`
    );
  } catch {
    return {
      cast: [],
      crew: [],
    };
  }
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [movie, credits] =
    await Promise.all([
      getMovie(id),
      getMovieCredits(id),
    ]);

  const directors = credits.crew.filter(
    (person) => person.job === "Director"
  );

  const writers = credits.crew.filter(
    (person) =>
      person.job === "Writer" ||
      person.job === "Screenplay" ||
      person.job === "Story"
  );

  const cast = credits.cast.slice(0, 12);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-zinc-950 text-white">
        {/* Movie Hero */}
        <section className="relative overflow-hidden">
          {movie.backdrop_path && (
            <div className="absolute inset-0">
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt=""
                fill
                unoptimized
                className="object-cover opacity-20"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950" />
            </div>
          )}

          <div className="relative mx-auto max-w-7xl px-6 py-16">
            {/* Back */}
            <Link
              href="/movies"
              className="inline-flex text-sm text-zinc-400 transition hover:text-white"
            >
              ← Back to Movies
            </Link>

            <div className="mt-10 grid gap-10 md:grid-cols-[280px_1fr]">
              {/* Poster */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-500">
                    No poster
                  </div>
                )}
              </div>

              {/* Movie Information */}
              <div className="self-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {movie.title}
                </h1>

                {/* Metadata */}
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                  <span>
                    {movie.release_date
                      ? movie.release_date.slice(
                          0,
                          4
                        )
                      : "N/A"}
                  </span>

                  {movie.runtime && (
                    <span>
                      {movie.runtime} min
                    </span>
                  )}

                  <span className="text-yellow-400">
                    ★{" "}
                    {movie.vote_average.toFixed(
                      1
                    )}
                  </span>

                  <span>
                    {movie.vote_count.toLocaleString()}{" "}
                    votes
                  </span>
                </div>

                {/* Genres */}
                {movie.genres.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {movie.genres.map(
                      (genre) => (
                        <span
                          key={genre.id}
                          className="rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300"
                        >
                          {genre.name}
                        </span>
                      )
                    )}
                  </div>
                )}

                {/* Overview */}
                <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-300">
                  {movie.overview ||
                    "No overview available."}
                </p>

                {/* Favorite */}
                <FavoriteButton
                  movieId={movie.id}
                />

                {/* Add to Private List */}
                <AddToListButton
                  movieId={movie.id}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Cast / Crew */}
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            {/* Cast */}
            <div>
              <h2 className="text-2xl font-bold">
                Cast
              </h2>

              {cast.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                  {cast.map((person) => (
                    <div
                      key={person.id}
                      className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
                    >
                      <div className="relative aspect-[2/3] bg-zinc-800">
                        {person.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                            alt={person.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-zinc-500">
                            No photo
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <h3 className="line-clamp-2 font-semibold text-white">
                          {person.name}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                          {person.character ||
                            "Unknown role"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-zinc-500">
                  Cast information is not
                  available.
                </p>
              )}
            </div>

            {/* Crew */}
            <div className="space-y-8">
              {/* Director */}
              <div>
                <h2 className="text-2xl font-bold">
                  Director
                </h2>

                {directors.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {directors.map(
                      (person) => (
                        <div
                          key={`${person.id}-${person.job}`}
                          className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                        >
                          <p className="font-semibold text-white">
                            {person.name}
                          </p>

                          <p className="mt-1 text-sm text-zinc-500">
                            {person.job}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-zinc-500">
                    Director information is
                    not available.
                  </p>
                )}
              </div>

              {/* Writer */}
              <div>
                <h2 className="text-2xl font-bold">
                  Writer
                </h2>

                {writers.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {writers.map(
                      (person) => (
                        <div
                          key={`${person.id}-${person.job}`}
                          className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                        >
                          <p className="font-semibold text-white">
                            {person.name}
                          </p>

                          <p className="mt-1 text-sm text-zinc-500">
                            {person.job}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-zinc-500">
                    Writer information is
                    not available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <MovieReviews
            movieId={movie.id}
          />
        </section>
      </main>
    </>
  );
}