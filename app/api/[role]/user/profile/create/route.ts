import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, { params }: { params: Promise<{ role: string }> }) {
    const session = await sessionDeatils()

    if (!session) {
        return NextResponse.json({
            error: "Unauthorized (user/profile/create)",
            success: false
        }, { status: 401 })
    }
    const { role: role } = await params
    const { name, mobileNumber, address } = await request.json()
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email!
        }
    })
    const isUserExists = await prisma.myUser.findFirst({
        where:{
            userId:user?.id
        }
    })
    if(isUserExists){
        return NextResponse.json({
            error: "Profile already created (user/profile/create)",
            success: false
        }, { status: 405 })
    }
    console.log(user)
    if (!user) {
        return NextResponse.json({
            success: false,
            error: "User not found Signin again"
        }, { status: 402 })
    }
    const createdUser = await prisma.myUser.create({
        data: {
            name,
            userId: user?.id!,
            mobileNumber,
            address,
            role
        },
        select: {
            name:true,
            mobileNumber:true,
            address:true,
            role:true
        }
    })

    return NextResponse.json({
        success:true,
        createdUser,
        msg: "User creted successfuly"
    })
}