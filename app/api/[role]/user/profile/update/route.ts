import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { NextRequest, NextResponse } from "next/server";


export async function PUT( request:NextRequest , {params} : {params : Promise<{role: string}>}){
    const session = await sessionDeatils()
    if(!session){
        return NextResponse.json({
            success:false,
            error: "Unauthorised (user/update)"
        },{status :401})
    }

    const { role :role} = await params
    const existingUser = await prisma.user.findFirst({
        where:{
            email:session.user?.email!
        }
    })
    if(!existingUser){
        return NextResponse.json({
            success:false,
            error:"User not found. Signin again"
        },{status:402})
    }

    const { name , address , mobileNumber   } = await request.json()
    const updatedUser = await prisma.myUser.update({
        where:{
            userId : existingUser.id!
        },
        data:{
            name,
            mobileNumber,
            address
        }   
    })

    return NextResponse.json({
        success:true,
        msg:"User updated successfully",
        updatedUser,
        
    })
}