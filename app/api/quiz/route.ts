import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";

type TMDBMovie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
};

type TMDBResponse = {
  results: TMDBMovie[];
};

export async function GET() {
  try {
    const data = await tmdbFetch<TMDBResponse>(
      "/movie/popular?language=en-US&page=1"
    );

    const movies = data.results
      .filter((movie) => movie.overview)
      .slice(0, 20);

    if (movies.length < 4) {
      return NextResponse.json(
        { error: "Not enough movies available." },
        { status: 500 }
      );
    }

    const shuffled = [...movies].sort(() => Math.random() - 0.5);

    const correctMovie = shuffled[0];

    const wrongMovies = shuffled
      .slice(1)
      .filter((movie) => movie.id !== correctMovie.id)
      .slice(0, 3);

    const options = [correctMovie, ...wrongMovies]
      .sort(() => Math.random() - 0.5)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
      }));

    return NextResponse.json({
      question: "Which movie matches this description?",
      overview: correctMovie.overview,
      options,
      correctAnswer: correctMovie.id,
    });
  } catch (error) {
    console.error("Quiz API error:", error);

    return NextResponse.json(
      { error: "Unable to create quiz question." },
      { status: 500 }
    );
  }
}