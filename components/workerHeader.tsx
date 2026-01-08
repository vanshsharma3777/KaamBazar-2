"use client";

import React, { JSX, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Loader } from "../components/loader";

export default function WorkerHeader({ tab }: { tab: string }): JSX.Element | null {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center py-6">
        <Loader />
      </div>
    );
  }

  if (status === "unauthenticated") return null;
  const navLinks = [
    { 
      name: "Profile", 
      href: "/worker/profile", 
      id: "profile", 
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" 
    },
    { 
      name: "Active Works", 
      href: "/worker/active-works", 
      id: "active", 
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" 
    },
    { 
      name: "Past Works", 
      href: "/worker/past-works", 
      id: "history", 
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" 
    },
    { 
      name: "Update Profile", 
      href: "/worker/update-profile", 
      id: "update", 
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" 
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <span className="font-black text-4xl cursor-pointer  text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 " 
           onClick={()=>{
            router.push('/')
           }} >
            KaamBazar
          </span> 
        
        <nav className="hidden md:flex gap-2">
          {navLinks.map((link) => {
            const isActive = tab === link.id;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  isActive 
                    ? `${link.color}` 
                    : "text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            {session?.user?.name?.charAt(0).toUpperCase() || "W"}
          </motion.button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-52 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-xs text-slate-500">Logged in as Worker</p>
                  <p className="text-sm font-medium text-slate-200 truncate">{session?.user?.name}</p>
                </div>
                
                <Link
                  href="/worker/profile"
                  className="block px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  👤 View Profile
                </Link>
                
                <button 
                  onClick={() => signOut({ callbackUrl: '/api/auth/signin' })}
                  className="w-full text-left block px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}