import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#3a2b20] bg-[#0b0908]/95 text-[#f3ead7] backdrop-blur-md">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <span className="font-serif text-3xl font-semibold tracking-tight text-[#f5ead3]">
            Filmora
          </span>

          <span className="font-serif text-3xl italic text-[#c5a15b] transition group-hover:text-[#e0bd70]">
            X
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-9 md:flex">

          <Link
            href="/"
            className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#9f917d] transition hover:text-[#d0ae68]"
          >
            Home
          </Link>

          <Link
            href="/movies"
            className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#9f917d] transition hover:text-[#d0ae68]"
          >
            Movies
          </Link>

          <Link
            href="/quiz"
            className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#9f917d] transition hover:text-[#d0ae68]"
          >
            Quiz
          </Link>

          {session?.user && (
            <Link
              href="/profile"
              className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#9f917d] transition hover:text-[#d0ae68]"
            >
              Profile
            </Link>
          )}
        </div>

        {/* Account */}
        {session?.user ? (
          <div className="flex items-center gap-4">

            <Link
              href="/profile"
              className="hidden max-w-[150px] truncate font-serif text-sm text-[#cbbda7] transition hover:text-[#e0bd70] sm:block"
            >
              {session.user.name ||
                session.user.email}
            </Link>

            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="border border-[#80633a] bg-[#15110e] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#c5a15b] transition hover:border-[#c5a15b] hover:bg-[#b9934f] hover:text-[#100d09]"
              >
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="border border-[#c5a15b] bg-[#b9934f] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#100d09] transition hover:bg-[#d0ae68]"
            >
              Enter Cinema
            </button>
          </form>
        )}
      </nav>

      {/* Cinematic gold line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#80633a]/50 to-transparent" />
    </header>
  );
}