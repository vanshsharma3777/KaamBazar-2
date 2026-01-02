import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ role: string }> }) {
    const session = await sessionDeatils();
    if (!session) {
        return NextResponse.json({ error: "Unauthorised", success: false }, { status: 401 });
    }

    const { role } = await params;
    // Normalize role string
    const normalizedRole = role.toLowerCase().trim();

    const person = await prisma.user.findUnique({
        where: { email: session.user?.email! }
    });

    if (!person) {
        return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
    }

    let userDetails = null;

    if (normalizedRole === 'user') {
        userDetails = await prisma.myUser.findUnique({
            where: { userId: person.id },
            select: { name: true, mobileNumber: true, address: true, role: true }
        });
    } else if (normalizedRole === 'vendor') {
        userDetails = await prisma.myVendor.findUnique({
            where: { userId: person.id },
            select: { name: true, shopName: true, mobileNumber: true, address: true, role: true, age: true }
        });
    } else if (normalizedRole === 'worker') {
        userDetails = await prisma.myWorker.findUnique({
            where: { userId: person.id },
            select: { name: true, mobileNumber: true, occupation: true, dailyWage: true, role: true, age: true }
        });
    }
    if (!userDetails) {
        return NextResponse.json({
            success: false,
            msg: `${normalizedRole} profile record missing in database`,
            userDetails: null 
        }, { status: 200 }); 
    }
    return NextResponse.json({
        success: true,
        msg: normalizedRole,
        userDetails
    });
}