import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, { params }: { params: Promise<{ role: string }> }) {
    const session = await sessionDeatils()

    if (!session) {
        return NextResponse.json({
            error: "Unauthorized (worker/profile/create)",
            success: false
        }, { status: 401 })
    }
    const { role: role } = await params
    const { name, mobileNumber, occupation , dailyWage , age } = await request.json()
    const worker = await prisma.user.findUnique({
        where: {
            email: session?.user?.email!
        }
    })
    const isworkerExists = await prisma.myWorker.findFirst({
        where:{
           userId :worker?.id
        }
    })
    if(isworkerExists){
        return NextResponse.json({
            error: "Profile already created (worker/profile/create)",
            success: false
        }, { status: 405 })
    }
    console.log(worker)
    if (!worker) {
        return NextResponse.json({
            success: false,
            error: "worker not found Signin again"
        }, { status: 402 })
    }
    const createdworker = await prisma.myWorker.create({
        data: {
            name,
            userId: worker?.id!,
            mobileNumber,
            occupation,
            dailyWage,
            age,
            role
        },
        select: {
            name:true,
            mobileNumber:true,
            occupation:true,
            dailyWage:true,
            age:true,
            role:true
        }
    })

    return NextResponse.json({
        success:true,
        createdworker,
        msg: "worker creted successfuly"
    })
}