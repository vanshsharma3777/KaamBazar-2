import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ role: string }> }) {
    const session = await sessionDeatils()
    if (!session) {
        return NextResponse.json({
            error: "Unauthorised (user/dahboard)",
            success: false
        }, { status: 401 })
    }
    const { role: role } = await params
    const person = await prisma.user.findUnique({
        where: {
            email: session.user?.email!
        }
    })
    if (!person) {
        return NextResponse.json({
            error: "Person deatils not found ([role]/dahboard)",
            success: false
        }, { status: 402 })
    }
    if (role === 'user') {
        const userDeatils = await prisma.myUser.findFirst({
            where: {
                userId: person.id
            },
            select: {
                name: true,
                mobileNumber: true,
                address: true,
                role: true
            }
        })
        console.log(userDeatils)

        return NextResponse.json({
            success: true,
            userDeatils
        })
    }
    else if (role === 'vendor') {
        const userDeatils = await prisma.myVendor.findFirst({
            where: {
                userId: person.id
            },
            select: {
                name: true,
                shopName: true,
                mobileNumber: true,
                address: true,
                role: true,
                age: true
            }
        })
        return NextResponse.json({
            success:true,
            userDeatils
        })
    }
    else if (role === 'worker') {
        const userDeatils = await prisma.myWorker.findFirst({
            where: {
                userId: person.id
            },
            select: {
                name: true,
                mobileNumber: true,
                occupation: true,
                dailyWage:true,
                role: true,
                age: true
            }
        })
        return NextResponse.json({
            success:true,
            userDeatils
        })
    }
}
