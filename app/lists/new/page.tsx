import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import CreateListForm from "@/components/CreateListForm";

export default async function NewListPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Private Collection
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Create a Movie List
          </h1>

          <p className="mt-3 text-zinc-400">
            Create a private collection for movies you want to
            organize.
          </p>

          <CreateListForm />
        </div>
      </main>
    </>
  );
}