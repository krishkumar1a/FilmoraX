"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  listId: string;
};

export default function DeleteListButton({
  listId,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] =
    useState(false);

  async function deleteList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entire list? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

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

      router.push("/profile");
    } catch (error) {
      console.error(
        "Delete list error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete the list."
      );

      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={deleteList}
      disabled={deleting}
      className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting
        ? "Deleting..."
        : "🗑 Delete List"}
    </button>
  );
}