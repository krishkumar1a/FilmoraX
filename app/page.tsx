import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MovieSearch from "@/components/MovieSearch";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

type MoviesResponse = {
  results: Movie[];
};

async function getMovies(): Promise<Movie[]> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/movies`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data: MoviesResponse = await response.json();

  return data.results;
}

export default async function Home() {
  const movies = await getMovies();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0b0908] text-[#f3ead7]">

        {/* HERO */}
        <section className="relative min-h-[760px] overflow-hidden border-b border-[#3a2b20]">

          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(113,35,35,0.22),transparent_45%)]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(184,145,72,0.12),transparent_40%)]" />

            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0908]/40 via-[#0b0908]/80 to-[#0b0908]" />
          </div>

          {/* Side cinema lines */}
          <div className="absolute left-0 top-0 h-full w-px bg-[#80633a]/30" />
          <div className="absolute right-0 top-0 h-full w-px bg-[#80633a]/30" />

          {/* Hero Content */}
          <div className="relative mx-auto flex min-h-[760px] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">

            {/* Label */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-10 bg-[#c5a15b]" />

              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#c5a15b]">
                A FilmoraX Picture
              </p>

              <div className="h-px w-10 bg-[#c5a15b]" />
            </div>

            {/* Heading */}
            <h1 className="mt-8 max-w-5xl font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-[#f5ead3] sm:text-7xl lg:text-8xl">
              Every movie
              <span className="block italic text-[#b9934f]">
                tells a story.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#b9aa93] sm:text-xl">
              Step into a world of cinema.
              Discover unforgettable films,
              explore hidden classics, share your
              thoughts, and build collections of
              your own.
            </p>

            {/* SEARCH */}
            <div className="mt-12 w-full max-w-3xl">

              <div className="mb-3 text-center">
                <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#806f59]">
                  Search the Film Archive
                </span>
              </div>

              <div className="relative rounded-2xl border border-[#80633a] bg-[#11100e]/90 p-2 shadow-[0_0_50px_rgba(184,145,72,0.10)] backdrop-blur-md transition duration-500 hover:border-[#c5a15b] hover:shadow-[0_0_60px_rgba(184,145,72,0.18)]">

                {/* Gold glow */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-transparent via-[#b9934f]/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative">
                  <MovieSearch />
                </div>

              </div>

              <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-[#625544]">
                Search thousands of films • Discover your next story
              </p>
            </div>

            {/* Features */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs uppercase tracking-[0.25em] text-[#806f59]">
              <span>Discover</span>

              <span className="text-[#b9934f]">
                ◆
              </span>

              <span>Review</span>

              <span className="text-[#b9934f]">
                ◆
              </span>

              <span>Collect</span>

              <span className="text-[#b9934f]">
                ◆
              </span>

              <span>Play</span>
            </div>
          </div>

          {/* Film strip */}
          <div className="absolute bottom-0 left-0 right-0 flex h-8 items-center justify-around border-y border-[#3a2b20] bg-[#11100e] opacity-70">
            {Array.from({ length: 18 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-3 w-5 rounded-sm border border-[#80633a]/40"
                />
              )
            )}
          </div>
        </section>

        {/* NOW SHOWING */}
        <section className="mx-auto max-w-7xl px-6 py-20">

          <div className="flex flex-col gap-4 border-b border-[#3a2b20] pb-8 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.35em] text-[#b9934f]">
                  The Silver Screen
                </span>
              </div>

              <h2 className="mt-3 font-serif text-4xl font-semibold text-[#f3ead7] sm:text-5xl">
                Now Showing
              </h2>

              <p className="mt-3 text-[#887963]">
                Popular films currently making
                their way through the cinema.
              </p>
            </div>

            <Link
              href="/movies"
              className="inline-flex w-fit items-center border border-[#80633a] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a15b] transition hover:bg-[#b9934f] hover:text-[#100d09]"
            >
              View All Films
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.slice(0, 10).map(
              (movie, index) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] overflow-hidden border border-[#3a2b20] bg-[#171310] shadow-2xl transition duration-500 group-hover:-translate-y-2 group-hover:border-[#80633a]">

                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        unoptimized
                        priority={index < 5}
                        className="object-cover grayscale-[15%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#806f59]">
                        No poster
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-80" />

                    <div className="absolute bottom-3 left-3 flex items-center gap-1 border border-[#c5a15b]/60 bg-[#0b0908]/80 px-2.5 py-1 text-xs font-semibold text-[#e0bd70] backdrop-blur-sm">
                      ★{" "}
                      {movie.vote_average.toFixed(
                        1
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="line-clamp-2 font-serif text-lg font-semibold leading-tight text-[#eee1ca] transition group-hover:text-[#c5a15b]">
                      {movie.title}
                    </h3>

                    <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-wider text-[#756754]">
                      <span>
                        {movie.release_date
                          ? movie.release_date.slice(
                              0,
                              4
                            )
                          : "N/A"}
                      </span>

                      <span>
                        Feature Film
                      </span>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </section>

        {/* QUOTE */}
        <section className="border-y border-[#3a2b20] bg-[#100d0b]">
          <div className="mx-auto max-w-5xl px-6 py-24 text-center">

            <div className="mx-auto mb-8 h-px w-20 bg-[#b9934f]" />

            <p className="font-serif text-3xl italic leading-relaxed text-[#d9c7a8] sm:text-4xl">
              “The cinema is a mirror by which
              we often see ourselves.”
            </p>

            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#806f59]">
              FilmoraX — Your Cinema, Your Stories
            </p>

            <div className="mx-auto mt-8 h-px w-20 bg-[#b9934f]" />
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-20">

          <div className="relative overflow-hidden border border-[#5a4328] bg-[#15110e] px-8 py-16 text-center sm:px-16">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,145,72,0.10),transparent_60%)]" />

            <div className="relative">

              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#b9934f]">
                Your Cinema Awaits
              </p>

              <h2 className="mt-4 font-serif text-4xl font-semibold text-[#f3ead7] sm:text-5xl">
                Find your next great film.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-[#887963]">
                Browse the collection, discover
                something extraordinary, and make
                it part of your story.
              </p>

              <Link
                href="/movies"
                className="mt-8 inline-flex border border-[#c5a15b] bg-[#b9934f] px-7 py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#100d09] transition hover:bg-[#d0ae68]"
              >
                Enter the Cinema
              </Link>

            </div>
          </div>
        </section>

      </main>
    </>
  );
}