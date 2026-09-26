import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";
import { prisma } from "@/lib/prisma";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const usedIdsParam = searchParams.get("usedIds") || "";

    const usedIds = new Set(
      usedIdsParam
        .split(",")
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id))
    );

    const pages = [1, 2, 3];

    const allMovies: TMDBMovie[] = [];

    for (const page of pages) {
      const data = await tmdbFetch<TMDBResponse>(
        `/movie/popular?language=en-US&page=${page}`
      );

      allMovies.push(...data.results);
    }

    const uniqueMovies = Array.from(
      new Map(
        allMovies
          .filter((movie) => movie.overview)
          .map((movie) => [movie.id, movie])
      ).values()
    );

    const availableMovies = uniqueMovies.filter(
      (movie) => !usedIds.has(movie.id)
    );

    if (availableMovies.length < 4) {
      return NextResponse.json(
        {
          error: "Not enough unused movies available.",
        },
        { status: 500 }
      );
    }

    const shuffledMovies = [...availableMovies].sort(
      () => Math.random() - 0.5
    );

    const correctMovie = shuffledMovies[0];

    const wrongMovies = shuffledMovies.slice(1, 4);

    const options = [
      correctMovie,
      ...wrongMovies,
    ].sort(() => Math.random() - 0.5);

    const question = await prisma.quizQuestion.create({
      data: {
        movieId: correctMovie.id,

        question:
          "Which movie matches this description?",

        optionA: options[0].title,
        optionAId: options[0].id,

        optionB: options[1].title,
        optionBId: options[1].id,

        optionC: options[2].title,
        optionCId: options[2].id,

        optionD: options[3].title,
        optionDId: options[3].id,

        correctAnswer: String(correctMovie.id),

        difficulty: "medium",
      },
    });

    return NextResponse.json({
      id: question.id,
      question: question.question,
      overview: correctMovie.overview,

      options: options.map((movie) => ({
        id: movie.id,
        title: movie.title,
      })),

      correctAnswer: correctMovie.id,
    });
  } catch (error) {
    console.error(
      "Create quiz question error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create quiz question.",
      },
      { status: 500 }
    );
  }
}