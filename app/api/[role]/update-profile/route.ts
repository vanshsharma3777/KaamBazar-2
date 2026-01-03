import getLatitudeLongitude from "@/lib/getLatitudeLongitude";
import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { promises } from "dns";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request:NextRequest , {params}:{params:Promise <{role:string}>}){
    const session = await sessionDeatils()
    if (!session) {
        return NextResponse.json({
            success: false,
            error: "Unauthorised (user/update)"
        }, { status: 401 })
    }

    const { role: role } = await params
    const normalizedRole = role.toLowerCase().trim()
    const existingPerson = await prisma.user.findFirst({
        where: {
            email: session.user?.email!
        }
    })
    if (!existingPerson) {
        return NextResponse.json({
            success: false,
            error: "User not found. Signin again"
        }, { status: 402 })
    }
    if (normalizedRole === 'user') {
        const isPersonExists = await prisma.myUser.findFirst({
            where: {
                userId: existingPerson?.id
            }
        })
        if (!isPersonExists) {
            return NextResponse.json({
                error: "Profile already created (user/profile/create)",
                success: false
            }, { status: 405 })
        }
        const { name, address, mobileNumber } = await request.json()
        const location = await getLatitudeLongitude(address)
        console.log(location?.lat)
        console.log(location?.lng)
        const updatedUser = await prisma.myUser.update({
            where: {
                userId: existingPerson.id!
            },
            data: {
                name,
                mobileNumber,
                address,
                lat:location?.lat,
                lng:location?.lng,

            },
            select:{
                name:true,
                mobileNumber:true,
                lat:true,
                lng:true,
                address:true,
            }
        })

        return NextResponse.json({
            success: true,
            msg: "User updated successfully",
            updatedUser,

        })
    }
    else if (normalizedRole === 'vendor') {
        const isPersonExists = await prisma.myUser.findFirst({
            where: {
                userId: existingPerson?.id
            }
        })
        if (!isPersonExists) {
            return NextResponse.json({
                error: "Profile already created (user/profile/create)",
                success: false
            }, { status: 405 })
        }
        const { name, address, mobileNumber, shopName, age } = await request.json()
        const updatedvendor = await prisma.myVendor.update({
            where: {
                userId: existingPerson.id!
            },
            data: {
                name,
                mobileNumber,
                address,
                shopName,
                age
            },
            select:{
                name:true,
                mobileNumber:true,
                address:true,
                shopName:true,
                age:true
            }
        })

        return NextResponse.json({
            success: true,
            msg: "vendor updated successfully",
            updatedvendor,

        })
    }
    else if (normalizedRole === 'worker') {
        const isPersonExists = await prisma.myUser.findFirst({
            where: {
                userId: existingPerson?.id
            }
        })
        if (!isPersonExists) {
            return NextResponse.json({
                error: "Profile already created (user/profile/create)",
                success: false
            }, { status: 405 })
        }
        const { name, mobileNumber, age, dailyWage, occupation , address} = await request.json()
        const location = await getLatitudeLongitude(address)
        console.log(location?.lat)
        console.log(location?.lng)
        const updatedworker = await prisma.myWorker.update({
            where: {
                userId: existingPerson.id!
            },
            data: {
                name,
                mobileNumber,
                occupation,
                dailyWage,
                lat:location?.lat,
                lan:location?.lng,
                address,
                age
            },
            select:{
                name:true,
                mobileNumber:true,
                occupation:true,
                address:true,
                dailyWage:true,
                age:true
            }
        })
        return NextResponse.json({
            success: true,
            msg: "worker updated successfully",
            updatedworker,

        })
    }
}