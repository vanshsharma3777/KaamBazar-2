'use client'

import { auth } from "@/lib/auth";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const session = useSession()
  const router = useRouter()
  console.log(session)
  useEffect(() => {
    if(session.status==='unauthenticated'){
      router.push('/api/auth/signin') 
    }
  }, [session.status])
  if(session.status==='unauthenticated'){
    return null
  }

  return (
    <div>
      hello worlds
      <div>

      </div>
    </div>
  );
}
