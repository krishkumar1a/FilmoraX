import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Get favorites error:", error);

    return NextResponse.json(
      { error: "Unable to load favorites." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const movieId = Number(body.movieId);
    const position = Number(body.position);

    if (!Number.isInteger(movieId) || movieId <= 0) {
      return NextResponse.json(
        { error: "Invalid movie ID." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(position) || position < 1 || position > 5) {
      return NextResponse.json(
        { error: "Favorite position must be between 1 and 5." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const existingMovie = await prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId,
        },
      },
    });

    if (existingMovie) {
      const updated = await prisma.favorite.update({
        where: {
          id: existingMovie.id,
        },
        data: {
          position,
        },
      });

      return NextResponse.json({
        success: true,
        favorite: updated,
      });
    }

    const existingPosition = await prisma.favorite.findUnique({
      where: {
        userId_position: {
          userId: user.id,
          position,
        },
      },
    });

    if (existingPosition) {
      return NextResponse.json(
        {
          error: `Favorite slot ${position} is already occupied.`,
        },
        { status: 409 }
      );
    }

    const favoriteCount = await prisma.favorite.count({
      where: {
        userId: user.id,
      },
    });

    if (favoriteCount >= 5) {
      return NextResponse.json(
        {
          error:
            "You already have 5 favorite movies. Remove one before adding another.",
        },
        { status: 409 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        movieId,
        position,
      },
    });

    return NextResponse.json(
      {
        success: true,
        favorite,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save favorite error:", error);

    return NextResponse.json(
      { error: "Unable to save favorite." },
      { status: 500 }
    );
  }
}