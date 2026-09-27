"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  favoriteId: string;
};

export default function RemoveFavoriteButton({ favoriteId }: Props) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    if (removing) return;

    setRemoving(true);

    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setRemoving(false);
      alert("Unable to remove favorite right now.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={removing}
      className="mt-4 w-full rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {removing ? "REMOVING..." : "REMOVE FROM FAVORITES"}
    </button>
  );
}