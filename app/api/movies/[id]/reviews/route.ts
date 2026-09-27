import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const movieId = Number(id);

    if (!Number.isInteger(movieId)) {
      return NextResponse.json(
        { error: "Invalid movie ID." },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        movieId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Get reviews error:", error);

    return NextResponse.json(
      { error: "Unable to load reviews." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to review a movie." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const movieId = Number(id);

    if (!Number.isInteger(movieId)) {
      return NextResponse.json(
        { error: "Invalid movie ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const rating = Number(body.rating);
    const comment = String(body.comment ?? "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    if (!comment) {
      return NextResponse.json(
        { error: "Review text is required." },
        { status: 400 }
      );
    }

    if (comment.length > 2000) {
      return NextResponse.json(
        { error: "Review cannot exceed 2000 characters." },
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

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId,
        },
      },
    });

    if (existingReview) {
      const review = await prisma.review.update({
        where: {
          id: existingReview.id,
        },
        data: {
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        review,
      });
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        movieId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create review error:", error);

    return NextResponse.json(
      { error: "Unable to save review." },
      { status: 500 }
    );
  }
}