"use client";

import { useEffect, useState } from "react";

type Favorite = {
  id: string;
  movieId: number;
  position: number;
};

type FavoritesResponse = {
  favorites: Favorite[];
};

type FavoriteButtonProps = {
  movieId: number;
};

export default function FavoriteButton({
  movieId,
}: FavoriteButtonProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadFavorites() {
    try {
      const response = await fetch("/api/favorites");

      if (!response.ok) {
        return;
      }

      const data: FavoritesResponse = await response.json();

      setFavorites(data.favorites);

      const existingFavorite = data.favorites.find(
        (favorite) => favorite.movieId === movieId
      );

      if (existingFavorite) {
        setSelectedPosition(String(existingFavorite.position));
      }
    } catch {
      // User may simply not be logged in.
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, [movieId]);

  async function saveFavorite() {
    if (!selectedPosition) {
      setMessage("Choose a favorite slot first.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          position: Number(selectedPosition),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to save favorite.");
        return;
      }

      setMessage("Added to your favorites!");

      await loadFavorites();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-lg font-semibold">
        ❤️ Add to Favorites
      </h3>

      <p className="mt-2 text-sm text-zinc-500">
        Choose one of your 5 favorite movie slots.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select
          value={selectedPosition}
          onChange={(event) =>
            setSelectedPosition(event.target.value)
          }
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
        >
          <option value="">Choose slot</option>

          {[1, 2, 3, 4, 5].map((position) => {
            const favorite = favorites.find(
              (item) => item.position === position
            );

            const isCurrentMovie = favorite?.movieId === movieId;

            return (
              <option key={position} value={position}>
                Favorite #{position}
                {isCurrentMovie ? " — This movie" : ""}
                {favorite && !isCurrentMovie
                  ? " — Occupied"
                  : ""}
              </option>
            );
          })}
        </select>

        <button
          type="button"
          onClick={saveFavorite}
          disabled={saving || !selectedPosition}
          className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Favorite"}
        </button>
      </div>

      {message && (
        <p className="mt-3 text-sm text-zinc-300">
          {message}
        </p>
      )}
    </div>
  );
}