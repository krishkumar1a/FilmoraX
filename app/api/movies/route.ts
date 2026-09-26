import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";

type TMDBMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids?: number[];
};

type TMDBPopularResponse = {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const pageParam =
      searchParams.get("page") || "1";

    const page = Number(pageParam);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      page > 500
    ) {
      return NextResponse.json(
        {
          error:
            "Page must be between 1 and 500.",
        },
        { status: 400 }
      );
    }

    const data =
      await tmdbFetch<TMDBPopularResponse>(
        `/movie/popular?language=en-US&page=${page}`
      );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Popular movies error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load movies right now.",
      },
      { status: 500 }
    );
  }
}