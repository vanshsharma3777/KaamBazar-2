"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  User,
  MapPin,
  Phone,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/loader';

export default function CreateProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobileNumber: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
      setFormData({ ...formData, name: value });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d*$/.test(value) && value.length <= 10)) {
      setFormData({ ...formData, mobileNumber: value });
    }
  };

  if (status === 'loading') {
    return <Loader />;
  }

  if (!session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim() || !formData.mobileNumber.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.mobileNumber.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/user/create-profile', formData);

      if (res.status === 200 || res.status === 201) {
        toast.success("Profile created successfully!");
        router.replace('/user/profile');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errStatus = error.response?.status;
        if (errStatus === 405) {
          toast.error("Failed to create profile. Profile already created");
          return;
        }
      }
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <Toaster position="top-center" />

      <div className="relative p-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl z-10"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Go Back</span>
          </button>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <header className="mb-10 text-center">
              <h1 className="text-3xl font-black mb-2 tracking-tight">Complete Your <span className="text-emerald-400">Profile</span></h1>
              <p className="text-slate-400 text-sm">Tell us a bit about yourself to get started.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name (Letters Only)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-600"
                    value={formData.name}
                    onChange={handleNameChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mobile Number (10 Digits)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                    <Phone size={20} />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="9876543210"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-600 font-mono"
                    value={formData.mobileNumber}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Complete Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                    <MapPin size={20} />
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Flat, Street, Area, City..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-600 resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Save Profile <Save size={20} />
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