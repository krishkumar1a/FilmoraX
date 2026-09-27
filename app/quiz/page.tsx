import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import MovieQuiz from "@/components/MovieQuiz";
import { auth } from "@/auth";

export default async function QuizPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
              FilmoraX Game
            </p>

            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Movie Quiz
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-zinc-400">
              Read the movie description and choose the movie
              you think matches it.
            </p>
          </div>

          <MovieQuiz />
        </div>
      </main>
    </>
  );
}