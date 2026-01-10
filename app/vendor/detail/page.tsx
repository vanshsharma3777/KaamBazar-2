"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Construction, 
  ArrowLeft, 
  Sparkles,
  Rocket
} from 'lucide-react';
import VendorHeader from '@/components/vendorHeader';

export default function VendorProductsComingSoon() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white overflow-hidden flex flex-col">
      <VendorHeader tab="products" />

      <main className="flex-1 relative flex items-center justify-center p-6">
        

        <div className="max-w-2xl w-full text-center z-10">
          

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">
              COMING <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">SOON</span>
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles size={18} className="text-emerald-400" />
              <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">
                Product Inventory Management
              </p>
              <Sparkles size={18} className="text-emerald-400" />
            </div>

            

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center gap-2 transition-all font-bold"
              >
                <ArrowLeft size={20} /> Back to page
              </motion.button>

              
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}