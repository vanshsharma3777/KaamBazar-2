'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from '../../../components/loader'
import UserHeader from "@/components/userHeader";
import { motion } from 'framer-motion'
import { 
  Store, 
  UserCircle, 
  MapPin, 
  PhoneCall, 
  ArrowUpRight,
  Truck,
  Star
} from 'lucide-react';

interface VendorDetails {
  mobileNumber: string;
  address: string;
  id: string;
  shopName: string;
  role: string;
  rating: number;
  age: number;
  name: string;
}

export default function UserProfilePage() {
    const router = useRouter();
    const { status } = useSession();
    const [loader, setLoader] = useState(false)
    const [vendorDetails, setVendorDetails] = useState<VendorDetails[]>([])

    useEffect(() => {
        async function getResponse() {
      if (status === 'unauthenticated') {
          router.replace('/');
          return;
      }
      if (status === 'authenticated') {
          try {
              setLoader(true);
      const res = await axios.get(`/api/all-workerandVendor`);
      if(!res.data.success && res.status===201){
        router.replace('/user/create-profile')
      }
      if(!res.data.success && res.data.status===404){
        router.push('/')
      }
      setVendorDetails(res.data.allVendor || []);   
  } catch (err) {
      console.error("API error:", err);
  } finally {
      setLoader(false);
  }
}
}
getResponse();
}, [status, router]);

    if (status === 'loading' || loader) return <Loader />;



    if (status === "authenticated") {
        return (
<div className="w-full min-h-screen bg-[#020617] overflow-x-hidden">   
<UserHeader tab={"vendors"} />

<div className="p-4 md:p-8 relative">
  <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none" />
  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

  <div className="max-w-6xl mx-auto relative z-10">
      <header className="mb-10">
      <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-emerald-400 font-bold tracking-widest text-[10px] uppercase mb-2"
      >
          <Truck size={14} /> Supply & Logistics
      </motion.div>
      <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black text-white tracking-tight"
      >
          Partner <span className="text-emerald-400">Vendors</span>
      </motion.h1>
  </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendorDetails.map((vendor, index) => (
            <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/vendor/detail/`)}
                className="group cursor-pointer"
            >
                <div className="relative h-full p-5 rounded-[1.5rem] bg-slate-900/60 backdrop-blur-md border border-white/5 hover:border-emerald-500/30 transition-all shadow-xl">
          
          <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Store size={20} />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[13px] font-bold text-white">{vendor.rating || "4.5"}</span>
              </div>
          </div>

          <div className="mb-4">
              <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {vendor.shopName}
              </h2>
              <div className="flex items-center gap-1.5 text-slate-500">
                  <UserCircle size={14} />
                  <span className="text-[16px] font-medium">Owned by {vendor.name}</span>
              </div>
          </div>

        <div className="space-y-2 py-3 border-t border-white/5">
            <div className="flex items-start gap-2 text-slate-400">
                <MapPin size={14} className="shrink-0 text-emerald-500/60 mt-0.5" />
                <p className="text-[14px] leading-snug line-clamp-2">{vendor.address}</p>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
                <PhoneCall size={14} className="shrink-0 text-cyan-500/60" />
                <p className="text-[14px] font-mono tracking-tight">{vendor.mobileNumber}</p>
            </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
            <span className="text-[14px] font-bold text-slate-500 uppercase tracking-tighter">
                Exp: {vendor.age} Years
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <ArrowUpRight size={16} />
            </div>
        </div>
                </div>
            </motion.div>
        ))}
    </div>
        </div>
    </div>
</div>
          );
      }
      return null;
  }