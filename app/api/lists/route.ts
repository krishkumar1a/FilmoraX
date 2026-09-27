import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const lists = await prisma.movieList.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json({ lists });
  } catch (error) {
    console.error("Get lists error:", error);

    return NextResponse.json(
      { error: "Unable to load movie lists." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "List name is required." },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: "List name cannot exceed 50 characters." },
        { status: 400 }
      );
    }

    if (description.length > 300) {
      return NextResponse.json(
        { error: "Description cannot exceed 300 characters." },
        { status: 400 }
      );
    }

    const list = await prisma.movieList.create({
      data: {
        userId: user.id,
        name,
        description: description || null,
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        list,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create list error:", error);

    return NextResponse.json(
      { error: "Unable to create movie list." },
      { status: 500 }
    );
  }
}