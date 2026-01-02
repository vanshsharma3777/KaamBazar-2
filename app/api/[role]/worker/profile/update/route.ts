import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { NextRequest, NextResponse } from "next/server";


export async function PUT( request:NextRequest , {params} : {params : Promise<{role: string}>}){
    const session = await sessionDeatils()
    if(!session){
        return NextResponse.json({
            success:false,
            error: "Unauthorised (worker/update)"
        },{status :401})
    }

    const { role :role} = await params
    const existingworker = await prisma.user.findFirst({
        where:{
            email:session.user?.email!
        }
    })
    if(!existingworker){
        return NextResponse.json({
            success:false,
            error:"worker not found. Signin again"
        },{status:402})
    }

    const { name , address , mobileNumber , age , dailyWage , occupation  } = await request.json()
    const updatedworker = await prisma.myWorker.update({
        where:{
            userId : existingworker.id!
        },
        data:{
            name,
            mobileNumber,
            occupation,
            dailyWage,
            age
        }   
    })

    return NextResponse.json({
        success:true,
        msg:"worker updated successfully",
        updatedworker,
        
    })
}