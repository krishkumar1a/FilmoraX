import Navbar from "@/components/Navbar";
import MovieDiscovery from "@/components/MovieDiscovery";
import { tmdbFetch } from "@/lib/tmdb";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
};

type MoviesResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

async function getMovies(): Promise<MoviesResponse> {
  const data = await tmdbFetch<MoviesResponse>(
    "/movie/popular?language=en-US&page=1"
  );

  return data;
}

export default async function MoviesPage() {
  const data = await getMovies();

  return (
    <main className="min-h-screen bg-[#0b0908] text-[#f3ead7]">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-[#3a2b20]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(113,35,35,0.18),transparent_45%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(184,145,72,0.08),transparent_40%)]" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0908] via-[#0b0908]/95 to-[#0b0908]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-center gap-4">
            <div className="h-px w-10 bg-[#c5a15b]" />

            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#c5a15b]">
              The Film Archive
            </p>

            <div className="h-px w-10 bg-[#c5a15b]" />
          </div>

          <h1 className="mt-7 font-serif text-5xl font-semibold text-[#f5ead3] sm:text-7xl">
            The Movies
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#9f917d]">
            Explore the silver screen. Search
            thousands of films, discover new
            stories, and find something worth
            watching.
          </p>
        </div>
      </section>

      {/* Movie discovery */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <MovieDiscovery
          movies={data.results}
          initialPage={data.page}
          initialTotalPages={data.total_pages}
        />
      </section>

      {/* Bottom cinematic strip */}
      <div className="flex h-8 items-center justify-around border-y border-[#3a2b20] bg-[#11100e] opacity-70">
        {Array.from({ length: 18 }).map((_, index) => (
          <div
            key={index}
            className="h-3 w-5 rounded-sm border border-[#80633a]/40"
          />
        ))}
      </div>
    </main>
  );
}