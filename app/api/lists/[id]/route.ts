import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const list = await prisma.movieList.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        items: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!list) {
      return NextResponse.json(
        { error: "Movie list not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ list });
  } catch (error) {
    console.error("Get movie list error:", error);

    return NextResponse.json(
      { error: "Unable to load movie list." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const list = await prisma.movieList.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!list) {
      return NextResponse.json(
        { error: "Movie list not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const movieId = Number(body.movieId);

    if (!Number.isInteger(movieId) || movieId <= 0) {
      return NextResponse.json(
        { error: "Invalid movie ID." },
        { status: 400 }
      );
    }

    const existingMovie =
      await prisma.movieListItem.findUnique({
        where: {
          listId_movieId: {
            listId: id,
            movieId,
          },
        },
      });

    if (existingMovie) {
      return NextResponse.json(
        {
          error:
            "This movie is already in the list.",
        },
        { status: 409 }
      );
    }

    const item = await prisma.movieListItem.create({
      data: {
        listId: id,
        movieId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Add movie to list error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to add movie to list.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Make sure this list belongs to the
    // currently logged-in user.
    const list =
      await prisma.movieList.findFirst({
        where: {
          id,
          userId: user.id,
        },
        select: {
          id: true,
        },
      });

    if (!list) {
      return NextResponse.json(
        {
          error:
            "Movie list not found.",
        },
        { status: 404 }
      );
    }

    // Try to read the request body.
    // If there is no body, we delete
    // the entire list.
    let body: { movieId?: number } = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const movieId = Number(body.movieId);

    // If movieId is provided, remove
    // only that movie from the list.
    if (
      Number.isInteger(movieId) &&
      movieId > 0
    ) {
      await prisma.movieListItem.deleteMany({
        where: {
          listId: id,
          movieId,
        },
      });

      return NextResponse.json({
        success: true,
        type: "movie",
      });
    }

    // Otherwise delete the entire list.
    //
    // Delete the movies inside the list first
    // so this also works if the Prisma relation
    // does not have cascade delete enabled.
    await prisma.movieListItem.deleteMany({
      where: {
        listId: id,
      },
    });

    await prisma.movieList.delete({
      where: {
        id: list.id,
      },
    });

    return NextResponse.json({
      success: true,
      type: "list",
    });
  } catch (error) {
    console.error(
      "Delete list error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete the list.",
      },
      { status: 500 }
    );
  }
}