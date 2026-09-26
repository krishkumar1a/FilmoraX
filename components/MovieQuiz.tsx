"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_QUESTIONS = 5;

type QuizOption = {
  id: number;
  title: string;
};

type QuizQuestion = {
  id: string;
  question: string;
  overview: string;
  options: QuizOption[];
  correctAnswer: number;
};

type QuizAnswer = {
  questionId: string;
  movieId: number;
  userAnswer: number;
};

type QuizReviewItem = {
  questionId: string;
  question: string;
  options: QuizOption[];
  userAnswer: number | null;
  userAnswerTitle: string;
  correctAnswer: number;
  correctAnswerTitle: string;
  isCorrect: boolean;
};

export default function MovieQuiz() {
  const [quiz, setQuiz] =
    useState<QuizQuestion | null>(null);

  const [questionNumber, setQuestionNumber] =
    useState(1);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const [error, setError] =
    useState("");

  const [review, setReview] =
    useState<QuizReviewItem[]>([]);

  /*
   * useRef is important here.
   *
   * React state updates are asynchronous, so using state
   * directly when submitting the final answer could miss
   * the fifth answer.
   */
  const answersRef =
    useRef<QuizAnswer[]>([]);

  async function loadQuestion() {
  setLoading(true);
  setError("");

  try {
    const usedMovieIds = answersRef.current
      .map((answer) => answer.questionId)
      .filter(Boolean);

    const query =
      usedMovieIds.length > 0
        ? `?usedIds=${usedMovieIds.join(",")}`
        : "";

    const response = await fetch(
      `/api/quiz/questions${query}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to load quiz question."
      );
    }

    setQuiz(data);
  } catch (error) {
    console.error(error);

    setError(
      error instanceof Error
        ? error.message
        : "Unable to load quiz question."
    );
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadQuestion();
  }, []);

  function selectAnswer(movieId: number) {
    if (
      selectedAnswer !== null ||
      !quiz ||
      submitting
    ) {
      return;
    }

    setSelectedAnswer(movieId);

    answersRef.current = [
      ...answersRef.current,
      {
        questionId: quiz.id,
        userAnswer: movieId,
        movieId: 0
      },
    ];

    if (movieId === quiz.correctAnswer) {
      setScore(
        (currentScore) =>
          currentScore + 1
      );
    }
  }

  async function nextQuestion() {
    if (
      !quiz ||
      selectedAnswer === null ||
      submitting
    ) {
      return;
    }

    if (
      questionNumber >=
      TOTAL_QUESTIONS
    ) {
      const finalAnswers =
        answersRef.current;

      if (
        finalAnswers.length !==
        TOTAL_QUESTIONS
      ) {
        setError(
          `Quiz answers are incomplete. Received ${finalAnswers.length} of ${TOTAL_QUESTIONS} answers.`
        );

        return;
      }

      try {
        setSubmitting(true);
        setError("");

        const response = await fetch(
          "/api/quiz/complete",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              totalQuestions:
                TOTAL_QUESTIONS,
              answers: finalAnswers,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to save quiz result."
          );
        }

        setScore(data.score);

        setReview(
          Array.isArray(data.review)
            ? data.review
            : []
        );

        setFinished(true);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to save quiz result."
        );
      } finally {
        setSubmitting(false);
      }

      return;
    }

    setQuestionNumber(
      (currentNumber) =>
        currentNumber + 1
    );

    await loadQuestion();
  }

  function playAgain() {
    answersRef.current = [];

    setQuiz(null);
    setQuestionNumber(1);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
    setReview([]);
    setError("");

    loadQuestion();
  }

  function getOptionClass(
    optionId: number
  ) {
    if (!quiz) {
      return "";
    }

    if (selectedAnswer === null) {
      return "border-zinc-700 bg-zinc-900 hover:border-red-500 hover:bg-zinc-800";
    }

    if (
      optionId === quiz.correctAnswer
    ) {
      return "border-green-500 bg-green-500/10 text-green-300";
    }

    if (
      optionId === selectedAnswer
    ) {
      return "border-red-500 bg-red-500/10 text-red-300";
    }

    return "border-zinc-800 bg-zinc-950 text-zinc-500";
  }

  if (finished) {
    return (
      <section className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              Quiz Complete
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              Your Score
            </h2>

            <p className="mt-4 text-5xl font-bold text-red-500">
              {score}/{TOTAL_QUESTIONS}
            </p>

            <p className="mt-2 text-zinc-400">
              {Math.round(
                (score /
                  TOTAL_QUESTIONS) *
                  100
              )}
              %
            </p>
          </div>

          {review.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-5 text-xl font-semibold text-white">
                Answer Review
              </h3>

              <div className="space-y-5">
                {review.map(
                  (item, index) => (
                    <div
                      key={
                        item.questionId
                      }
                      className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-semibold text-white">
                          {index + 1}.{" "}
                          {item.question}
                        </h4>

                        <span
                          className={
                            item.isCorrect
                              ? "shrink-0 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400"
                              : "shrink-0 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400"
                          }
                        >
                          {item.isCorrect
                            ? "Correct"
                            : "Incorrect"}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2">
                        {item.options.map(
                          (option) => {
                            const isUserAnswer =
                              item.userAnswer ===
                              option.id;

                            const isCorrectAnswer =
                              item.correctAnswer ===
                              option.id;

                            let className =
                              "border-zinc-800 bg-zinc-900 text-zinc-300";

                            if (
                              isCorrectAnswer
                            ) {
                              className =
                                "border-green-500/50 bg-green-500/10 text-green-300";
                            } else if (
                              isUserAnswer
                            ) {
                              className =
                                "border-red-500/50 bg-red-500/10 text-red-300";
                            }

                            return (
                              <div
                                key={
                                  option.id
                                }
                                className={`rounded-lg border px-4 py-3 text-sm ${className}`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <span>
                                    {
                                      option.title
                                    }
                                  </span>

                                  <div className="flex gap-2 text-xs font-medium">
                                    {isUserAnswer && (
                                      <span>
                                        Your answer
                                      </span>
                                    )}

                                    {isCorrectAnswer && (
                                      <span>
                                        Correct
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>

                      <div className="mt-4 space-y-2 text-sm">
                        <p
                          className={
                            item.isCorrect
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          <span className="font-semibold">
                            Your answer:
                          </span>{" "}
                          {item.userAnswerTitle}
                        </p>

                        {!item.isCorrect && (
                          <p className="text-green-400">
                            <span className="font-semibold">
                              Correct answer:
                            </span>{" "}
                            {
                              item.correctAnswerTitle
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={playAgain}
              className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              Play Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-zinc-400">
            Loading question...
          </p>
        </div>
      </section>
    );
  }

  if (!quiz) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-red-400">
            {error ||
              "Unable to load quiz."}
          </p>

          <button
            type="button"
            onClick={loadQuestion}
            className="mt-5 rounded-full bg-red-500 px-5 py-2 font-medium text-white transition hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              Movie Quiz
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              Question{" "}
              {questionNumber} of{" "}
              {TOTAL_QUESTIONS}
            </p>
          </div>

          <div className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300">
            Score: {score}
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-red-500 transition-all"
            style={{
              width: `${
                (questionNumber /
                  TOTAL_QUESTIONS) *
                100
              }%`,
            }}
          />
        </div>

        <div className="mt-8">
          <p className="text-lg leading-8 text-zinc-200">
            {quiz.overview}
          </p>
        </div>

        <h2 className="mt-8 text-xl font-bold text-white">
          {quiz.question}
        </h2>

        <div className="mt-5 grid gap-3">
          {quiz.options.map(
            (option) => (
              <button
                key={option.id}
                type="button"
                disabled={
                  selectedAnswer !== null ||
                  submitting
                }
                onClick={() =>
                  selectAnswer(
                    option.id
                  )
                }
                className={`rounded-xl border p-4 text-left text-sm font-medium transition ${getOptionClass(
                  option.id
                )}`}
              >
                {option.title}
              </button>
            )
          )}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            {selectedAnswer ===
            quiz.correctAnswer ? (
              <p className="font-medium text-green-400">
                ✓ Correct answer!
              </p>
            ) : (
              <p className="font-medium text-red-400">
                ✕ Incorrect. The correct
                answer is{" "}
                {
                  quiz.options.find(
                    (option) =>
                      option.id ===
                      quiz.correctAnswer
                  )?.title
                }
                .
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={nextQuestion}
            disabled={
              selectedAnswer === null ||
              submitting
            }
            className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting
              ? "Saving..."
              : questionNumber ===
                  TOTAL_QUESTIONS
                ? "Finish Quiz"
                : "Next Question"}
          </button>
        </div>
      </div>
    </section>
  );
}