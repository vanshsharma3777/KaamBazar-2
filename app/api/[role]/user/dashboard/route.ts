import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest , {params}:{params: Promise<{ role :string}> } ){
    const session = await sessionDeatils()
    if(!session){
        return NextResponse.json({
            error:"Unauthorised (user/dahboard)",
            success:false
        },{status :401})
    }
    const {role :role} = await params
    const user = await prisma.user.findUnique({
        where:{
            email:session.user?.email!
        }
    })
    if(!user){
        return NextResponse.json({
            error:"User not found (user/dahboard)",
            success:false
        },{status:402})
    }
}
