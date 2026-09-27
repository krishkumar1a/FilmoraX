"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateListForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create list.");
        return;
      }

      router.push("/lists");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-200"
        >
          List name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Best Sci-Fi Movies"
          maxLength={50}
          required
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-red-500"
        />

        <p className="mt-2 text-xs text-zinc-500">
          Maximum 50 characters.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-200"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="What is this collection about?"
          maxLength={300}
          rows={5}
          className="mt-2 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-red-500"
        />

        <p className="mt-2 text-xs text-zinc-500">
          Maximum 300 characters.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create List"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/lists")}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-6 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}