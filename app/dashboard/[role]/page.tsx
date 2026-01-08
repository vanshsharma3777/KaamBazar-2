'use client'

import { div } from "framer-motion/client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Dahboard(){
    const router = useRouter()
    const { role } = useParams<{role : string}>();
    console.log(role)
    if(role==='user'){
        console.log("helllo")
        router.replace('/user/profile')
    } else if(role ==='vendor'){
        router.replace('/vendor/profile')
    }
    else if( role ==='worker'){ 
        router.replace('/worker/profile')
    }
    return null
}