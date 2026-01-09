"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  UserCheck,
  MapPin,
  Phone,
  Save,
  ArrowLeft,
  Store,
  RefreshCcw
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/loader';
import VendorHeader from '@/components/vendorHeader';

export default function UpdateVendorProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    shopName: '',
    address: '',
    mobileNumber: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/api/auth/signin');
    }
    async function getData() {
        const res = await axios.get('/api/vendor/details');
        console.log(res.data)
      if(res.status===201 && res.data.success===false){
        router.replace("/vendor/create-profile")
      }
    }
    getData()
  }, [status, router]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
        if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: string, maxLength?: number) => {
    const value = e.target.value;
    if (value === "" || /^\d*$/.test(value)) {
      if (maxLength && value.length > maxLength) return;
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  if (status === 'loading') {
    return <Loader />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ownerName, shopName, address, mobileNumber } = formData;
        if (!ownerName || !shopName || !address || !mobileNumber) {
      toast.error("Please fill in all fields to update");
      return;
    }

    if (mobileNumber.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put('/api/vendor/update-profile', formData);
      console.log(res.data)
      if (res.status === 200) {
        toast.success("Profile updated successfully!");
        router.push('/vendor/profile');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMsg);
      console.error("Update Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <Toaster position="top-center" />
      <VendorHeader tab="update" />

      <div className="relative p-6 flex flex-col items-center justify-center py-12">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl z-10"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors mb-6 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Go Back</span>
          </button>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <RefreshCcw className="text-emerald-400" size={24} />
                <h1 className="text-3xl font-black tracking-tight">Update <span className="text-emerald-400">Profile</span></h1>
              </div>
              <p className="text-slate-400 text-sm">Enter the new details for your shop below.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Shop Name</label>
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 w-5 h-5" />
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500/50 transition-all"
                      placeholder="Enter Shop Name"
                      value={formData.shopName}
                      onChange={(e) => setFormData(prev => ({...prev, shopName: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Owner Name</label>
                  <div className="relative group">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 w-5 h-5" />
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500/50 transition-all"
                      placeholder="Enter Owner Name"
                      value={formData.ownerName}
                      onChange={(e) => handleTextChange(e, 'ownerName')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mobile Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 w-5 h-5" />
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                      placeholder="10 digit phone number"
                      value={formData.mobileNumber}
                      onChange={(e) => handleNumberInput(e, 'mobileNumber', 10)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-5 text-slate-500 group-focus-within:text-emerald-400 w-5 h-5" />
                    <textarea
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                      placeholder="Shop physical address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Update Information <Save size={20} /></>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}