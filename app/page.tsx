"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/loader';

const roles = [
  {
    id: 'user',
    title: 'Regular User',
    description: 'Hire professionals for your projects and manage tasks.',
    icon: '👤',
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20'
  },
  {
    id: 'worker',
    title: 'Service Worker',
    description: 'Find work, showcase your skills, and earn daily wages.',
    icon: '👷',
    color: 'from-indigo-500 to-purple-600',
    shadow: 'shadow-indigo-500/20'
  },
  {
    id: 'vendor',
    title: 'Vendor / Supplier',
    description: 'Sell construction materials or rent out heavy equipment.',
    icon: '🏗️',
    color: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/20'
  }
];

export default function RoleSelection() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  const handleSelection = (role: string) => {
    router.push(`${role}/profile`);
  };

  if (status === "loading") {
   return (
    <Loader></Loader>
   )
  }
  if (status === "authenticated") {
    return (
      <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden relative">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4 ">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">KaamBazar</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium">
            Select your journey to continue
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => handleSelection(role.id)}
              className="cursor-pointer group"
            >
              <div className={`relative h-full p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all ${role.shadow} hover:shadow-2xl`}>
                <div className={`w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-3xl shadow-lg transform group-hover:rotate-6 transition-transform`}>
                  {role.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {role.title}
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  {role.description}
                </p>
                <div className="flex items-center text-sm font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  Get Started
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}