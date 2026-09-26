"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
};

const genres = [
  { id: 0, name: "All" },
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

type Props = {
  movies: Movie[];
};

export default function MovieGenreFilter({
  movies,
}: Props) {
  const [selectedGenre, setSelectedGenre] =
    useState(0);

  const filteredMovies = useMemo(() => {
    if (selectedGenre === 0) {
      return movies;
    }

    return movies.filter((movie) =>
      movie.genre_ids?.includes(selectedGenre)
    );
  }, [movies, selectedGenre]);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {genres.map((genre) => (
          <button
            key={genre.id}
            type="button"
            onClick={() =>
              setSelectedGenre(genre.id)
            }
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedGenre === genre.id
                ? "bg-red-500 text-white"
                : "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-white"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {filteredMovies.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <p className="text-zinc-400">
              No movies found in this genre.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredMovies.map(
              (movie, index) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:-translate-y-1 hover:border-zinc-600"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-zinc-800">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        unoptimized
                        priority={index < 5}
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                        No poster
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="line-clamp-2 font-semibold">
                      {movie.title}
                    </h2>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-500">
                        {movie.release_date
                          ? movie.release_date.slice(
                              0,
                              4
                            )
                          : "N/A"}
                      </span>

                      <span className="text-yellow-400">
                        ★{" "}
                        {movie.vote_average.toFixed(
                          1
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}