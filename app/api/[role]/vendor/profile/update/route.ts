import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { NextRequest, NextResponse } from "next/server";


export async function PUT( request:NextRequest , {params} : {params : Promise<{role: string}>}){
    const session = await sessionDeatils()
    if(!session){
        return NextResponse.json({
            success:false,
            error: "Unauthorised (vendor/update)"
        },{status :401})
    }

    const { role :role} = await params
    const existingvendor = await prisma.user.findFirst({
        where:{
            email:session.user?.email!
        }
    })
    if(!existingvendor){
        return NextResponse.json({
            success:false,
            error:"vendor not found. Signin again"
        },{status:402})
    }

    const { name , address , mobileNumber , shopName , age  } = await request.json()
    const updatedvendor = await prisma.myVendor.update({
        where:{
            userId : existingvendor.id!
        },
        data:{
            name,
            mobileNumber,
            address,
            shopName,
            age
        }   
    })

    return NextResponse.json({
        success:true,
        msg:"vendor updated successfully",
        updatedvendor,
        
    })
}