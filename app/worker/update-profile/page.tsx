"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  User, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Calendar,
  Save, 
  ArrowLeft
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/loader';

export default function WorkerProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    occupation: '',
    dailyWages: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/api/auth/signin');
    }
  }, [status, router]);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setFormData({ ...formData, name: value });
    }
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, limit: number) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= limit) {
      setFormData({ ...formData, [field]: value });
    }
  };

  if (status === 'loading') return <Loader />;
  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, address, occupation, dailyWages } = formData;
    if (!name.trim() || !address.trim() || !occupation.trim() || !dailyWages ) {
      toast.error("Please fill all fields");
      return;
    }


      try {
      setLoading(true);
      const res = await axios.put('/api/worker/update-profile', formData);
      
      if (res.status === 200 || res.status === 201) {
        toast.success("Worker profile updated!");
        router.replace('/worker/profile'); 
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white overflow-x-hidden py-12">
      <Toaster position="top-center" />

      <div className="relative p-6 flex flex-col items-center justify-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl z-10"
        >
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
          </button>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">

            <header className="mb-10 text-center">
              <h1 className="text-3xl font-black mb-2 tracking-tight">Worker <span className="text-emerald-400">Profile</span></h1>
              <p className="text-slate-400 text-sm">Update your work details to get more jobs</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500  group-focus-within:text-emerald-400 transition-colors">
                    <User size={20} />
                  </div>
                  <input 
                    type="text"
                    required
                    placeholder="Enter full name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white"
                    value={formData.name}
                    onChange={handleNameChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Occupation</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500  group-focus-within:text-emerald-400 transition-colors">
                      <Briefcase size={20} />
                    </div>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Plumber, Driver"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white"
                      value={formData.occupation}
                      onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    />
                  </div>
                </div>

                
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Expected Daily Wages (₹)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                    <IndianRupee size={20} />
                  </div>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 500"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white"
                    value={formData.dailyWages}
                    onChange={(e) => handleNumericChange(e, 'dailyWages', 5)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Work Location / Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-5 text-slate-500  group-focus-within:text-emerald-400 transition-colors">
                    <MapPin size={20} />
                  </div>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Enter your village/city and area..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full  bg-gradient-to-r from-emerald-500 to-teal-600 py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Save Worker Profile <Save size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}