import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { all } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest , {params}:{params:Promise <{role:string}>}){
    const session = await sessionDeatils()
    if(!session){
        return NextResponse.json({ error: "Unauthorised", success: false }, { status: 401 });
    }
    const { role } = await params;
    
        const normalizedRole = role.toLowerCase().trim()
    const person = await prisma.user.findUnique({
        where: { email: session.user?.email! }
    });
    if (!person) {
        return NextResponse.json({ error: "User not found. Create your profile first", success: false }, { status: 404 });
    }
    
    if(normalizedRole==='user'){
        const allPerson = await prisma.myUser.findMany({
        where:{role:normalizedRole},
        omit:{
            id:true,
            userId:true
        }
    }) 
        if(!allPerson){
            return NextResponse.json({
                success:false,
                error:`No ${role} found`
            },{status:402})
        }
    return NextResponse.json({
        success:true,
        allPerson
    })
    }
    else if(normalizedRole==='worker'){
        const allPerson = await prisma.myWorker.findMany({
        where:{role:normalizedRole},
        omit:{
            userId:true
        }
    }) 
        if(!allPerson){
            return NextResponse.json({
                success:false,
                error:`No ${role} found`
            },{status:402})
        }
    return NextResponse.json({
        success:true,
        allPerson
    })
    }
    else if(normalizedRole==='vendor'){
        const allPerson = await prisma.myVendor.findMany({
        where:{role:normalizedRole},
        omit:{
            userId:true
        }
    }) 
        if(!allPerson){
            return NextResponse.json({
                success:false,
                error:`No ${role} found`
            },{status:402})
        }
    return NextResponse.json({
        success:true,
        allPerson
    })
    }
}