"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/movies/search?q=${encodeURIComponent(
            trimmedQuery
          )}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to search movies."
          );
        }

        setMovies(
          Array.isArray(data.results)
            ? data.results.slice(0, 6)
            : []
        );
      } catch (error) {
        console.error(
          "Homepage movie search error:",
          error
        );

        setMovies([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full">
      {/* Search box */}
      <div
        className={`group relative flex items-center overflow-hidden rounded-xl border bg-[#0b0908]/95 transition-all duration-500 ${
          query
            ? "border-[#c5a15b] shadow-[0_0_35px_rgba(184,145,72,0.16)]"
            : "border-[#80633a] shadow-[0_0_25px_rgba(184,145,72,0.08)] hover:border-[#b9934f]"
        }`}
      >
        {/* Search icon */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border-r border-[#3a2b20]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 text-[#b9934f] transition duration-300 group-focus-within:scale-110"
          >
            <circle
              cx="11"
              cy="11"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M16 16L21 21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search for a film..."
          className="h-16 min-w-0 flex-1 bg-transparent px-5 font-serif text-lg text-[#f3ead7] outline-none placeholder:text-[#756754]"
        />

        {/* Loading / clear */}
        {loading ? (
          <div className="mr-5 h-5 w-5 animate-spin rounded-full border-2 border-[#80633a] border-t-[#d0ae68]" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setMovies([]);
            }}
            className="mr-4 flex h-8 w-8 items-center justify-center rounded-full text-[#806f59] transition hover:bg-[#2a2119] hover:text-[#d0ae68]"
            aria-label="Clear search"
          >
            ×
          </button>
        ) : null}

        {/* Decorative gold line */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#b9934f] to-transparent opacity-40" />
      </div>

      {/* Search results */}
      {query.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-xl border border-[#5a4328] bg-[#11100e]/98 shadow-2xl backdrop-blur-xl">

          {loading ? (
            <div className="px-6 py-8 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-[#806f59]">
                Searching the archive...
              </p>
            </div>
          ) : movies.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="text-2xl text-[#80633a]">
                ◇
              </div>

              <p className="mt-3 font-serif text-lg text-[#d9c7a8]">
                No films found
              </p>

              <p className="mt-1 text-xs text-[#756754]">
                Try another title.
              </p>
            </div>
          ) : (
            <div>
              <div className="border-b border-[#3a2b20] px-5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#806f59]">
                  Film Archive
                </p>
              </div>

              <div className="divide-y divide-[#2c231b]">
                {movies.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    onClick={() => {
                      setQuery("");
                      setMovies([]);
                    }}
                    className="flex gap-4 px-5 py-4 transition hover:bg-[#1b1510]"
                  >
                    <div className="relative h-16 w-11 shrink-0 overflow-hidden border border-[#3a2b20] bg-[#171310]">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[8px] text-[#756754]">
                          N/A
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 self-center">
                      <h3 className="truncate font-serif text-base font-semibold text-[#eee1ca] transition group-hover:text-[#d0ae68]">
                        {movie.title}
                      </h3>

                      <div className="mt-1 flex items-center gap-3 text-xs text-[#756754]">
                        <span>
                          {movie.release_date
                            ? movie.release_date.slice(
                                0,
                                4
                              )
                            : "N/A"}
                        </span>

                        <span className="text-[#c5a15b]">
                          ★{" "}
                          {movie.vote_average.toFixed(
                            1
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="self-center text-[#80633a]">
                      →
                    </div>
                  </Link>
                ))}
              </div>

              <div className="border-t border-[#3a2b20] px-5 py-3 text-center">
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#625544]">
                  Select a film to enter its story
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}