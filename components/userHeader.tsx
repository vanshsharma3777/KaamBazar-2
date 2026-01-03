"use client";

import React, { JSX, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader } from "../components/loader";

export default function UserHeader(): JSX.Element | null {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState("U");

  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/api/auth/signin");
    }
  }, [status, router]);
  useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name.charAt(0).toUpperCase());
    }
  }, [session]);
  if (status === "loading") {
    return (
      <div className="flex justify-center py-6">
        <Loader />
      </div>
    );
  }
  if (status === "unauthenticated") {
    return null;
  }

  const navLinks = [
    { name: "Profile", href: "/dashboard/user/profile" },
    { name: "Workers", href: "/dashboard/user/workers" },
    { name: "Vendors", href: "/dashboard/user/vendors" },
    { name: "Create New Work", href: "/dashboard/user/create" },
    { name: "Past Work", href: "/dashboard/user/history" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">

        <Link href="/dashboard/user" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            👤
          </div>
          <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            KaamBazar
          </span>
        </Link>

        <nav className="hidden md:flex gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "text-white" : "text-slate-400"}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="relative">
          <motion.button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold"
          >
            {username}
          </motion.button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 mt-3 w-52 bg-slate-900 border border-white/10 rounded-xl"
              >
                <Link
                  href="/dashboard/user/profile"
                  className="block px-4 py-3 hover:bg-white/5"
                >
                  ⚙️ Profile
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
