"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Store, 
  Briefcase, 
  ShieldCheck, 
  Layout, 
  Database, 
  Key, 
  Smartphone,
  Github,
  Twitter,
  Linkedin,
  Heart,
  Zap,
  TrendingUp,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AboutKaamBazar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log(status)
  useEffect(()=>{
    if(status==='authenticated'){
      router.replace("/role")
    }
  }, [status])
  const features = [
    {
      title: "Worker Direct-Hire",
      description: "No more waiting at 'Chowks' or labor hubs. Workers get a notification as soon as a job is posted nearby, ensuring zero idle days.",
      icon: <TrendingUp className="text-blue-400" />,
    },
    {
      title: "Vendor Marketplace",
      description: "Local shop owners digitize their inventory, reaching customers directly without expensive advertising.",
      icon: <Store className="text-emerald-400" />,
    },
    {
      title: "Job-Posting for Users",
      description: "Users post their requirements (e.g., 'Need a Plumber') and workers contact them directly, cutting out brokers and extra commissions.",
      icon: <UserPlus className="text-purple-400" />,
    }
  ];

  const handleGetStarted = () => {
    router.push('/api/auth/signin');
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 flex flex-col">
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            Project Overview
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
          >
            Kaam<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Bazar</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10"
          >
            A broker-free ecosystem where users post work and skilled labor finds consistent, daily employment without the middleman.
          </motion.p>
          
          
        </div>
      </section>
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Zap className="text-yellow-400" /> Disrupting the Middleman
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                In the traditional system, workers spend half their day waiting for work at hubs, and users pay extra to brokers. **KaamBazar** fixes this.
              </p>
              <p>
                **For Users:** Simply post your task. Skilled workers in your vicinity will view it and reach out to you directly. It's faster, cheaper, and more transparent.
              </p>
              <p>
                **For Workers:** We ensure you don't have to "sit idle." By digitizing demand, we provide a steady stream of work opportunities directly to your smartphone every single day.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className={`p-6 rounded-3xl bg-slate-900 border border-white/5 ${i === 2 ? 'col-span-2' : ''}`}>
                <div className="mb-4">{f.icon}</div>
                <h4 className="font-bold text-white mb-2">{f.title}</h4>
                <p className="text-xs text-slate-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Platform Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TechCard icon={<Layout />} title="Real-time Feed" desc="Live job board where users post and workers respond instantly." />
            <TechCard icon={<Key />} title="NextAuth.js" desc="Secure authentication for Users, Workers, and Vendors." />
            <TechCard icon={<Database />} title="Prisma & SQL" desc="Matching localized work posts with nearby skilled labor." />
            <TechCard icon={<Smartphone />} title="Mobile First" desc="Designed for workers to manage their day on the go." />
            <TechCard 
              icon={<motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Zap size={24}/></motion.div>} 
              title="Framer Motion" 
              desc="Interactive UI for smooth job-posting and profile management." 
            />
            <TechCard icon={<ShieldCheck />} title="Zero Brokers" desc="Direct P2P communication logic built into the core." />
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-slate-900 border border-white/10 rounded-[3rem] p-12 text-center">
            <h2 className="text-4xl font-black mb-4">Join the Revolution</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Whether you are looking to hire, sell, or work, KaamBazar is the platform for you. No brokers, no hidden costs.
            </p>
            <button 
              onClick={handleGetStarted}
              className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-black text-lg hover:bg-slate-200 transition-colors shadow-xl"
            >
              Sign In to KaamBazar
            </button>
          </div>
        </div>
      </section>
      <footer className="mt-auto border-t border-white/10 bg-slate-950/50 backdrop-blur-md py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black tracking-tighter mb-2">
                Kaam<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Bazar</span>
              </h2>
              <p className="text-slate-500 text-sm flex items-center justify-center md:justify-start gap-1">
                Built with <Heart size={14} className="text-red-500 fill-red-500" /> by <span className="text-slate-300 font-semibold">Vansh</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <SocialLink href="https://github.com/vanshsharma3777" icon={<Github size={20} />} label="GitHub" />
              <SocialLink href="https://x.com/itz_sharmaji001" icon={<Twitter size={20} />} label="X (Twitter)" />
              <SocialLink href="https://www.linkedin.com/in/vansh-sharma-812199316/" icon={<Linkedin size={20} />} label="LinkedIn" />
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-600 text-xs tracking-widest uppercase font-bold">
              © 2026 KaamBazar • All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TechCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all shadow-xl"
      aria-label={label}
    >
      {icon}
    </motion.a>
  );
}