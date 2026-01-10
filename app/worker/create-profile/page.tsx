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
  ArrowLeft,
  Briefcase,
  IndianRupee,
  Calendar
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/loader';

export default function CreateWorkerProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobileNumber: '',
    occupation: '',
    dailyWage: '',
    age: ''
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

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: string, maxLength?: number) => {
    const value = e.target.value;
    if (value === "" || /^\d*$/.test(value)) {
      if (maxLength && value.length > maxLength) return;
      setFormData({ ...formData, [field]: value });
    }
  };

  if (status === 'loading') {
    return <Loader />;
  }

  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, address, mobileNumber, occupation, dailyWage, age } = formData;
    if (!name || !address || !mobileNumber || !occupation || !dailyWage || !age) {
      toast.error("Please fill all fields");
      return;
    }

    if (mobileNumber.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    if (parseInt(age) < 18 || parseInt(age) > 100) {
        toast.error("Please enter a valid age (18-100)");
        return;
    }

    try {
      setLoading(true);
      
      const res = await axios.post('/api/worker/create-profile', formData);
      if (res.status === 200 || res.status === 201) {
        toast.success("Worker profile created!");
        router.replace('/worker/profile');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 405) {
          toast.error("Profile already exists");
      } else {
          toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <Toaster position="top-center" />

      <div className="relative p-6 flex flex-col items-center justify-center min-h-screen py-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

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
            <span className="text-sm font-bold uppercase tracking-widest">Go Back</span>
          </button>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <header className="mb-10 text-center">
              <h1 className="text-3xl font-black mb-2 tracking-tight">Worker <span className="text-blue-400">Registration</span></h1>
              <p className="text-slate-400 text-sm">Set up your professional worker profile.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 w-5 h-5" />
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all"
                      placeholder="Alex Smith"
                      value={formData.name}
                      onChange={handleNameChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mobile (10 Digits)</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 w-5 h-5" />
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                      placeholder="9876543210"
                      value={formData.mobileNumber}
                      onChange={(e) => handleNumberInput(e, 'mobileNumber', 10)}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Occupation</label>
                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 w-5 h-5" />
                        <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all"
                        placeholder="e.g. Electrician"
                        value={formData.occupation}
                        onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Age</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 w-5 h-5" />
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all"
                      placeholder='25'
                      value={formData.age}
                      onChange={(e) => handleNumberInput(e, 'age', 2)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Daily Wage (In Rupees)</label>
                <div className="relative group">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 w-5 h-5" />
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-blue-400"
                    placeholder="500"
                    value={Number(formData.dailyWage)}
                    onChange={(e) => handleNumberInput(e, 'dailyWage', 5)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-5 text-slate-500 group-focus-within:text-blue-400 w-5 h-5" />
                  <textarea
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                    placeholder="Street address, City, Pincode"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Complete Registration <Save size={20} /></>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}