import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
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

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        totalQuestions: 5,
      },
    });

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error("Start quiz error:", error);

    return NextResponse.json(
      { error: "Unable to start quiz." },
      { status: 500 }
    );
  }
}