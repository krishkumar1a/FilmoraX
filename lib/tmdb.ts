const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!TMDB_ACCESS_TOKEN) {
  throw new Error("TMDB_ACCESS_TOKEN is not configured");
}

export async function tmdbFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      accept: "application/json",
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `TMDB API error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  return response.json();
}