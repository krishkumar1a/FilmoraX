"use client";

import { FormEvent, useEffect, useState } from "react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    username: string | null;
    name: string | null;
    image: string | null;
  };
};

type ReviewsResponse = {
  reviews: Review[];
};

type MovieReviewsProps = {
  movieId: number;
};

export default function MovieReviews({
  movieId,
}: MovieReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadReviews() {
    try {
      const response = await fetch(`/api/movies/${movieId}/reviews`);

      if (!response.ok) {
        throw new Error("Failed to load reviews.");
      }

      const data: ReviewsResponse = await response.json();
      setReviews(data.reviews);
    } catch {
      setError("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, [movieId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/movies/${movieId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to save review.");
        return;
      }

      setComment("");
      setRating(5);

      await loadReviews();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">
        Reviews
      </h2>

      {/* Review Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <h3 className="text-lg font-semibold">
          Write a review
        </h3>

        <div className="mt-5">
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-zinc-300"
          >
            Rating
          </label>

          <select
            id="rating"
            value={rating}
            onChange={(event) =>
              setRating(Number(event.target.value))
            }
            className="mt-2 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-white outline-none focus:border-red-500"
          >
            <option value={5}>★★★★★ — 5</option>
            <option value={4}>★★★★☆ — 4</option>
            <option value={3}>★★★☆☆ — 3</option>
            <option value={2}>★★☆☆☆ — 2</option>
            <option value={1}>★☆☆☆☆ — 1</option>
          </select>
        </div>

        <div className="mt-5">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-zinc-300"
          >
            Your review
          </label>

          <textarea
            id="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What did you think about this movie?"
            maxLength={2000}
            rows={5}
            className="mt-2 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-red-500"
            required
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Posting..." : "Post Review"}
        </button>
      </form>

      {/* Existing Reviews */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-zinc-500">
            Loading reviews...
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-zinc-500">
            No reviews yet. Be the first to review this movie!
          </p>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {review.user.username ||
                      review.user.name ||
                      "FilmoraX User"}
                  </p>

                  <p className="mt-1 text-sm text-yellow-400">
                    {"★".repeat(review.rating)}
                    <span className="text-zinc-700">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </p>
                </div>

                <span className="text-xs text-zinc-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="mt-4 leading-7 text-zinc-300">
                {review.comment}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}