import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type QuizAnswer = {
  questionId: string;
  userAnswer: number;
};

export async function POST(request: Request) {
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

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const requestBody = body as {
      answers?: unknown;
      totalQuestions?: unknown;
    };

    const totalQuestions = Number(
      requestBody.totalQuestions
    );

    if (
      !Number.isInteger(totalQuestions) ||
      totalQuestions <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid total question count." },
        { status: 400 }
      );
    }

    if (!Array.isArray(requestBody.answers)) {
      return NextResponse.json(
        { error: "Quiz answers are missing." },
        { status: 400 }
      );
    }

    const answers: QuizAnswer[] = [];

    for (const item of requestBody.answers) {
      if (
        typeof item !== "object" ||
        item === null
      ) {
        return NextResponse.json(
          { error: "Invalid quiz answer." },
          { status: 400 }
        );
      }

      const answer = item as {
        questionId?: unknown;
        userAnswer?: unknown;
      };

      if (
        typeof answer.questionId !== "string" ||
        typeof answer.userAnswer !== "number" ||
        !Number.isInteger(answer.userAnswer)
      ) {
        return NextResponse.json(
          { error: "Invalid quiz answer." },
          { status: 400 }
        );
      }

      answers.push({
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
      });
    }

    if (answers.length !== totalQuestions) {
      return NextResponse.json(
        {
          error: `Quiz answers are incomplete. Received ${answers.length} of ${totalQuestions} answers.`,
        },
        { status: 400 }
      );
    }

    const questionIds = answers.map(
      (answer) => answer.questionId
    );

    const questions =
      await prisma.quizQuestion.findMany({
        where: {
          id: {
            in: questionIds,
          },
        },
        select: {
          id: true,
          question: true,

          optionA: true,
          optionAId: true,

          optionB: true,
          optionBId: true,

          optionC: true,
          optionCId: true,

          optionD: true,
          optionDId: true,

          correctAnswer: true,
        },
      });

    if (
      questions.length !==
      answers.length
    ) {
      return NextResponse.json(
        {
          error:
            "One or more quiz questions were not found.",
        },
        { status: 400 }
      );
    }

    const questionMap =
      new Map(
        questions.map((question) => [
          question.id,
          question,
        ])
      );

    let score = 0;

    const answerRecords = answers.map(
      (answer) => {
        const question =
          questionMap.get(
            answer.questionId
          );

        if (!question) {
          throw new Error(
            "Quiz question not found."
          );
        }

        const isCorrect =
          question.correctAnswer ===
          String(answer.userAnswer);

        if (isCorrect) {
          score += 1;
        }

        return {
          questionId: answer.questionId,
          userAnswer: String(
            answer.userAnswer
          ),
          isCorrect,
        };
      }
    );

    const attempt =
      await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          score,
          totalQuestions,
          completedAt: new Date(),

          questions: {
            create: answerRecords,
          },
        },

        include: {
          questions: {
            include: {
              question: {
                select: {
                  id: true,
                  question: true,

                  optionA: true,
                  optionAId: true,

                  optionB: true,
                  optionBId: true,

                  optionC: true,
                  optionCId: true,

                  optionD: true,
                  optionDId: true,

                  correctAnswer: true,
                },
              },
            },
          },
        },
      });

    const review = attempt.questions.map(
      (item) => {
        const question = item.question;

        const options = [
          {
            id: question.optionAId,
            title: question.optionA,
          },
          {
            id: question.optionBId,
            title: question.optionB,
          },
          {
            id: question.optionCId,
            title: question.optionC,
          },
          {
            id: question.optionDId,
            title: question.optionD,
          },
        ];

        const userAnswerId = Number(
          item.userAnswer
        );

        const correctAnswerId = Number(
          question.correctAnswer
        );

        const userAnswerTitle =
          options.find(
            (option) =>
              option.id === userAnswerId
          )?.title ?? "Unknown movie";

        const correctAnswerTitle =
          options.find(
            (option) =>
              option.id ===
              correctAnswerId
          )?.title ?? "Unknown movie";

        return {
          questionId: item.questionId,

          question:
            question.question,

          options,

          userAnswer:
            userAnswerId,

          userAnswerTitle,

          correctAnswer:
            correctAnswerId,

          correctAnswerTitle,

          isCorrect:
            item.isCorrect,
        };
      }
    );

    return NextResponse.json({
      success: true,
      score,
      totalQuestions,
      attemptId: attempt.id,
      review,
    });
  } catch (error) {
    console.error(
      "Complete quiz error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to save quiz result.",
      },
      { status: 500 }
    );
  }
}