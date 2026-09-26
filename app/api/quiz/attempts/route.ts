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

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        startedAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        score: true,
        totalQuestions: true,
        startedAt: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      attempts,
    });
  } catch (error) {
    console.error("Get quiz attempts error:", error);

    return NextResponse.json(
      { error: "Unable to load quiz history." },
      { status: 500 }
    );
  }
}