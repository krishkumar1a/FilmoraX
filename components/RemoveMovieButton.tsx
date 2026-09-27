"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  listId: string;
  movieId: number;
};

export default function RemoveMovieButton({
  listId,
  movieId,
}: Props) {
  const router = useRouter();
  const [removing, setRemoving] =
    useState(false);

  async function removeMovie() {
    const confirmed = window.confirm(
      "Remove this movie from your list?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemoving(true);

      const response = await fetch(
        `/api/lists/${listId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            movieId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to remove the movie."
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Remove movie error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to remove the movie."
      );

      setRemoving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={removeMovie}
      disabled={removing}
      className="mt-4 w-full rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {removing
        ? "Removing..."
        : "🗑 Remove from List"}
    </button>
  );
}