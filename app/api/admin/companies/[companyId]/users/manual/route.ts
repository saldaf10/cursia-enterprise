import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailEq, normEmail } from "@/lib/email";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { companyId } = await params;

  try {
    const body = await req.json();
    const { email } = body;

    // Validate email format
    if (!email || !String(email).includes("@")) {
      return NextResponse.json(
        { error: "Correo electrónico inválido" },
        { status: 400 }
      );
    }

    const trimmedEmail = normEmail(String(email));

    // Check if user already exists
    const existingUser = await prisma.preRegisteredUser.findFirst({
      where: { email: emailEq(trimmedEmail) },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este correo ya está registrado" },
        { status: 400 }
      );
    }

    // Create new pre-registered user with only email
    const newUser = await prisma.preRegisteredUser.create({
      data: {
        email: trimmedEmail,
        companyId,
        isRegistered: false,
      },
    });

    return NextResponse.json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
