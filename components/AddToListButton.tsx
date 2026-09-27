"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MovieList = {
  id: string;
  name: string;
  _count: {
    items: number;
  };
};

type ListsResponse = {
  lists: MovieList[];
};

type AddToListButtonProps = {
  movieId: number;
};

export default function AddToListButton({
  movieId,
}: AddToListButtonProps) {
  const [lists, setLists] = useState<MovieList[]>([]);
  const [selectedList, setSelectedList] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState(false);

  async function loadLists() {
    setLoading(true);
    setLoadError(false);

    try {
      const response = await fetch("/api/lists", {
        cache: "no-store",
      });

      if (!response.ok) {
        setLoadError(true);
        return;
      }

      const data: ListsResponse = await response.json();

      setLists(data.lists || []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLists();
  }, []);

  async function addToList() {
    if (!selectedList) {
      setMessage("Please choose a list first.");
      return;
    }

    setAdding(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/lists/${selectedList}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Unable to add movie to list."
        );
        return;
      }

      setMessage("✓ Movie added to your collection.");

      await loadLists();
    } catch {
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mt-6 border border-[#5a4328] bg-[#11100e]">
      {/* Header */}
      <div className="border-b border-[#3a2b20] bg-[#15110e] px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="text-xl text-[#c5a15b]">
            ◆
          </span>

          <div>
            <h3 className="font-serif text-xl font-semibold text-[#eee1ca]">
              Add to Private List
            </h3>

            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#756754]">
              Your personal cinema collections
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center gap-3 text-sm text-[#9f917d]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#3a2b20] border-t-[#c5a15b]" />
            Loading your collections...
          </div>
        ) : loadError ? (
          <div>
            <p className="text-sm text-[#c58c7d]">
              Unable to load your private lists.
            </p>

            <button
              type="button"
              onClick={loadLists}
              className="mt-4 border border-[#80633a] px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c5a15b] transition hover:bg-[#201810]"
            >
              Try Again
            </button>
          </div>
        ) : lists.length === 0 ? (
          <div>
            <p className="text-sm leading-6 text-[#9f917d]">
              You don't have any private movie lists yet.
              Create a collection from your profile and
              then add this movie to it.
            </p>

            <Link
              href="/profile"
              className="mt-5 inline-flex border border-[#c5a15b] bg-[#b9934f] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#100d09] transition hover:bg-[#d0ae68]"
            >
              Create a List
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm leading-6 text-[#9f917d]">
              Choose one of your private collections for
              this movie.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedList}
                onChange={(event) => {
                  setSelectedList(event.target.value);
                  setMessage("");
                }}
                className="flex-1 border border-[#4a3928] bg-[#0b0908] px-4 py-3 text-sm text-[#eee1ca] outline-none transition focus:border-[#c5a15b]"
              >
                <option value="">
                  Choose a private list
                </option>

                {lists.map((list) => (
                  <option
                    key={list.id}
                    value={list.id}
                  >
                    {list.name} ({list._count.items} movies)
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={addToList}
                disabled={adding || !selectedList}
                className="border border-[#c5a15b] bg-[#b9934f] px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#100d09] transition hover:bg-[#d0ae68] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {adding
                  ? "Adding..."
                  : "Add to List"}
              </button>
            </div>

            {message && (
              <p
                className={`mt-4 text-sm ${
                  message.startsWith("✓")
                    ? "text-[#c5a15b]"
                    : "text-[#c58c7d]"
                }`}
              >
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}