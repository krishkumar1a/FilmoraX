"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
};

type Props = {
  movies: Movie[];
  initialPage: number;
  initialTotalPages: number;
};

const genres = [
  { id: 0, name: "All Films" },
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

export default function MovieDiscovery({
  movies: initialMovies,
  initialPage,
  initialTotalPages,
}: Props) {
  const [movies, setMovies] =
    useState<Movie[]>(initialMovies);

  const [search, setSearch] =
    useState("");

  const [searchResults, setSearchResults] =
    useState<Movie[]>([]);

  const [searching, setSearching] =
    useState(false);

  const [selectedGenre, setSelectedGenre] =
    useState(0);

  const [page, setPage] =
    useState(initialPage);

  const [totalPages, setTotalPages] =
    useState(initialTotalPages);

  const [loadingMore, setLoadingMore] =
    useState(false);

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const response = await fetch(
          `/api/movies/search?q=${encodeURIComponent(
            query
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

        setSearchResults(
          Array.isArray(data.results)
            ? data.results
            : []
        );
      } catch (error) {
        console.error(
          "Movie search error:",
          error
        );

        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  async function loadMoreMovies() {
    if (
      loadingMore ||
      page >= totalPages ||
      search.trim()
    ) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      const response = await fetch(
        `/api/movies?page=${nextPage}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load more movies."
        );
      }

      const newMovies: Movie[] =
        Array.isArray(data.results)
          ? data.results
          : [];

      setMovies((currentMovies) => {
        const existingIds = new Set(
          currentMovies.map(
            (movie) => movie.id
          )
        );

        const uniqueMovies =
          newMovies.filter(
            (movie) =>
              !existingIds.has(movie.id)
          );

        return [
          ...currentMovies,
          ...uniqueMovies,
        ];
      });

      setPage(nextPage);

      setTotalPages(
        Number(data.total_pages) || 1
      );
    } catch (error) {
      console.error(
        "Load more movies error:",
        error
      );
    } finally {
      setLoadingMore(false);
    }
  }

  const moviesToDisplay =
    search.trim() === ""
      ? movies
      : searchResults;

  const filteredMovies = useMemo(() => {
    if (selectedGenre === 0) {
      return moviesToDisplay;
    }

    return moviesToDisplay.filter((movie) =>
      movie.genre_ids?.includes(
        selectedGenre
      )
    );
  }, [
    moviesToDisplay,
    selectedGenre,
  ]);

  const isSearching =
    search.trim() !== "";

  return (
    <div>
      {/* Search */}
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#806f59]">
            Search the Film Archive
          </span>
        </div>

        <div className="relative flex items-center overflow-hidden rounded-xl border border-[#80633a] bg-[#11100e] shadow-[0_0_35px_rgba(184,145,72,0.08)] transition duration-500 focus-within:border-[#c5a15b] focus-within:shadow-[0_0_45px_rgba(184,145,72,0.14)]">

          <div className="flex h-16 w-14 shrink-0 items-center justify-center border-r border-[#3a2b20]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-[#b9934f]"
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

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search for a film..."
            className="h-16 min-w-0 flex-1 bg-transparent px-5 font-serif text-lg text-[#f3ead7] outline-none placeholder:text-[#756754]"
          />

          {searching && (
            <div className="mr-5 h-5 w-5 animate-spin rounded-full border-2 border-[#80633a] border-t-[#d0ae68]" />
          )}

          {search && !searching && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchResults([]);
              }}
              className="mr-4 text-xl text-[#806f59] transition hover:text-[#d0ae68]"
            >
              ×
            </button>
          )}

          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#b9934f] to-transparent opacity-50" />
        </div>
      </div>

      {/* Genres */}
      <div className="mt-10 flex gap-3 overflow-x-auto pb-3">
        {genres.map((genre) => (
          <button
            key={genre.id}
            type="button"
            onClick={() =>
              setSelectedGenre(genre.id)
            }
            className={`shrink-0 border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition ${
              selectedGenre === genre.id
                ? "border-[#c5a15b] bg-[#b9934f] text-[#100d09]"
                : "border-[#4a3928] bg-[#15110e] text-[#9b8b75] hover:border-[#80633a] hover:text-[#d0ae68]"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Count */}
      {!searching && (
        <div className="mt-8 flex items-center gap-4 border-b border-[#3a2b20] pb-5">
          <span className="text-xs uppercase tracking-[0.3em] text-[#b9934f]">
            The Collection
          </span>

          <span className="text-xs text-[#625544]">
            {filteredMovies.length}{" "}
            {filteredMovies.length === 1
              ? "film"
              : "films"}
          </span>
        </div>
      )}

      {/* Empty */}
      {filteredMovies.length === 0 &&
      !searching ? (
        <div className="mt-10 border border-dashed border-[#4a3928] bg-[#11100e] p-12 text-center">
          <div className="font-serif text-4xl text-[#80633a]">
            ◇
          </div>

          <p className="mt-4 font-serif text-2xl text-[#d9c7a8]">
            No films found
          </p>

          <p className="mt-2 text-sm text-[#756754]">
            Try another search or genre.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSearchResults([]);
              setSelectedGenre(0);
            }}
            className="mt-6 border border-[#80633a] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a15b] transition hover:bg-[#b9934f] hover:text-[#100d09]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredMovies.map(
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
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      unoptimized
                      priority={index < 5}
                      className="object-cover grayscale-[15%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#756754]">
                      No poster
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-80" />

                  <div className="absolute bottom-3 left-3 border border-[#c5a15b]/60 bg-[#0b0908]/85 px-2.5 py-1 text-xs font-semibold text-[#e0bd70] backdrop-blur-sm">
                    ★{" "}
                    {movie.vote_average.toFixed(
                      1
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <h2 className="line-clamp-2 font-serif text-lg font-semibold leading-tight text-[#eee1ca] transition group-hover:text-[#c5a15b]">
                    {movie.title}
                  </h2>

                  <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-[#756754]">
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
      )}

      {/* Load More */}
      {!isSearching &&
        page < totalPages && (
          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={loadMoreMovies}
              disabled={loadingMore}
              className="border border-[#80633a] bg-[#15110e] px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#c5a15b] transition hover:border-[#c5a15b] hover:bg-[#b9934f] hover:text-[#100d09] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingMore
                ? "Loading Archive..."
                : "Load More Films"}
            </button>
          </div>
        )}
    </div>
  );
}