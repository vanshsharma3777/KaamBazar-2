import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, { params }: { params: Promise<{ role: string }> }) {
    const session = await sessionDeatils()

    if (!session) {
        return NextResponse.json({
            error: "Unauthorized (vendor/profile/create)",
            success: false
        }, { status: 401 })
    }
    const { role: role } = await params
    const { name, mobileNumber,  age,address   , shopName} = await request.json()
    const vendor = await prisma.user.findUnique({
        where: {
            email: session?.user?.email!
        }
    })
    const isvendorExists = await prisma.myVendor.findFirst({
        where: {
            userId: vendor?.id
        }
    })
    if (isvendorExists) {
        return NextResponse.json({
            error: "Profile already created (vendor/profile/create)",
            success: false
        }, { status: 405 })
    }
    console.log(vendor)
    if (!vendor) {
        return NextResponse.json({
            success: false,
            error: "vendor not found Signin again"
        }, { status: 402 })
    }
    const createdvendor = await prisma.myVendor.create({
        data: {
            name,
            userId: vendor?.id!,
            mobileNumber,
            shopName,
            address,
            age,
            role
        },
        select: {
            name: true,
            shopName: true,
            mobileNumber: true,
            address: true,
            role: true,
            age:true

        }
    })

    return NextResponse.json({
        success: true,
        createdvendor,
        msg: "vendor creted successfuly"
    })
}