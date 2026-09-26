import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";

type TMDBSearchResponse = {
  page: number;
  results: Array<{
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    overview: string;
    genre_ids?: number[];
  }>;
  total_pages: number;
  total_results: number;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const query = searchParams
      .get("q")
      ?.trim();

    if (!query) {
      return NextResponse.json(
        {
          error:
            "Search query is required.",
        },
        { status: 400 }
      );
    }

    const data =
      await tmdbFetch<TMDBSearchResponse>(
        `/search/movie?query=${encodeURIComponent(
          query
        )}&language=en-US&page=1&include_adult=false`
      );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Movie search error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to search movies right now.",
      },
      { status: 500 }
    );
  }
}