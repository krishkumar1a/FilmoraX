"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MovieList = {
  id: string;
  name?: string;
  title?: string;
  description?: string | null;
  createdAt?: string;
};

export default function MyListsSection() {
  const [lists, setLists] =
    useState<MovieList[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  async function loadLists() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/lists",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load your lists."
        );
      }

      const receivedLists =
        Array.isArray(data)
          ? data
          : Array.isArray(data.lists)
            ? data.lists
            : [];

      setLists(receivedLists);
    } catch (err) {
      console.error(
        "Load profile lists error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your lists."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteList(listId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entire list? All movies inside it will also be removed. This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(listId);
      setError("");

      const response = await fetch(
        `/api/lists/${listId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to delete the list."
        );
      }

      setLists((currentLists) =>
        currentLists.filter(
          (list) => list.id !== listId
        )
      );
    } catch (err) {
      console.error(
        "Delete profile list error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the list."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // Load lists when component starts.
  useState(() => {
    loadLists();
  });

  return (
    <section className="mt-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
          Your Collections
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              My Private Lists
            </h2>

            <p className="mt-2 text-zinc-500">
              Movie lists created by you.
              Only you can view and manage
              these lists.
            </p>
          </div>

          <Link
            href="/lists/new"
            className="inline-flex w-fit rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-600"
          >
            + Create List
          </Link>
        </div>
      </div>

      {loading && (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-zinc-500">
            Loading your lists...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        lists.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-8 text-center">
            <div className="text-4xl">
              📋
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              No private lists yet
            </h3>

            <p className="mt-2 text-zinc-500">
              Create your first movie list
              to organize movies your way.
            </p>

            <Link
              href="/lists/new"
              className="mt-5 inline-flex rounded-xl bg-red-500 px-6 py-3 font-semibold transition hover:bg-red-600"
            >
              Create Your First List
            </Link>
          </div>
        )}

      {!loading &&
        !error &&
        lists.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => {
              const listName =
                list.name ||
                list.title ||
                "Untitled List";

              const isDeleting =
                deletingId === list.id;

              return (
                <div
                  key={list.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-600"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-xl">
                      📋
                    </div>

                    <Link
                      href={`/lists/${list.id}`}
                      className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                    >
                      View List
                    </Link>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {listName}
                  </h3>

                  {list.description ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
                      {list.description}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-zinc-600">
                      No description
                    </p>
                  )}

                  {list.createdAt && (
                    <p className="mt-4 text-xs text-zinc-600">
                      Created{" "}
                      {new Date(
                        list.createdAt
                      ).toLocaleDateString()}
                    </p>
                  )}

                  {/* Delete List */}
                  <button
                    type="button"
                    onClick={() =>
                      deleteList(list.id)
                    }
                    disabled={isDeleting}
                    className="mt-5 w-full rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting
                      ? "Deleting..."
                      : "🗑 Delete List"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
    </section>
  );
}