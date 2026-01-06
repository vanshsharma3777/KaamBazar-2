'use client'

import  UserHeader   from "../../../components/userHeader";
import axios from "axios";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { 
  PlusCircle, 
  FileText, 
  Image as ImageIcon, 
  Send, 
  X, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import getLatitudeLongitude from "@/lib/getLatitudeLongitude";
import { Loader } from "@/components/loader";

interface UserDetails {
    name: string,
    address: string,
    mobileNumber: string
    lat: number
    lng: number
}
interface VendorDetails {
    mobileNumber: string,
    address: string,
    shopName: string,
    role: string,
    rating: number,
    age: number,
    name: string,

}
interface WorkerDetails {
    name: string,
    mobileNumber: string,
    lat: number,
    lan: number,
    occupation: string,
    address: string,
    role: string,
    dailyWage: number,
    age: number
}



export default function Dashboard() {
    const { role } = useParams<{ role: string }>()
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false)
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
    const [showConfirm, setShowConfirm] = useState(false);
  
    useEffect(() => {
        async function getResponse() {
            if (status === 'unauthenticated') {
                router.replace('/api/auth/signin')
            }
            else {
                try {
                    const res = await axios.get(`/api/${role}/details`)
                    if (role === "user") {
                        const data = res.data.userDetails
                        setUserDetails(data)
                        if (!data) {
                            console.error("No details found for role:", role, res.data)
                            return
                        }
                    } 
                } catch (err) {
                    console.error("API error while fetching details in dashboard/role :", err)
                } 
            }
        }
        getResponse()
    }, [router,  role , status])

    const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as File[],
    lat:0.0,
    lng:0.0,
    isActive:true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateAndConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Title and Description are required!", {
        style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
      });
      return;
    }
    setShowConfirm(true);
  };

  const submitWork = async () => {
    setLoading(true);
    setShowConfirm(false);
    console.log(userDetails?.address)
    formData.lat = userDetails?.lat as number
    formData.lng =userDetails?.lng as number
   const res= await axios.post('/api/work' , formData)
   console.log
    setTimeout(() => {
      setLoading(false);
      toast.success("Work posted successfully!", {
        icon: '🚀',
        style: { background: '#064e3b', color: '#fff', border: '1px solid #10b981' }
      })
   }, 1000);
   setTimeout(() => {
    router.replace('/user/get-work')
   }, 1000);
  };
    if (status === "loading") {
            return (
                <div className="h-screen flex items-center justify-center bg-[#020617]">
                    <Loader />
                </div>
            );
        }
    return (
        <div className="">
            <UserHeader tab={"create"} ></UserHeader> 
            <div className="min-h-screen w-full bg-[#020617] text-white p-6 flex items-center justify-center relative overflow-hidden">
      <Toaster position="top-center" />
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl z-10"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
            <PlusCircle size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Post New Work</h1>
            <p className="text-slate-400 text-sm">Find the best professional for your task</p>
          </div>
        </div>

        <form onSubmit={validateAndConfirm} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Work Title</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="e.g. Need Plumber for Bathroom Leakage"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition-all text-white placeholder:text-slate-600"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Description (Hindi/English)</label>
            <textarea 
              rows={4}
              placeholder="Describe what needs to be done..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition-all text-white placeholder:text-slate-600 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Work Photos (Optional)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all"
            >
              <ImageIcon className="text-slate-500 mb-2" size={32} />
              <p className="text-slate-400 text-sm">Click to upload images</p>
              <input 
                type="file" 
                multiple 
                hidden 
                ref={fileInputRef} 
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {formData.images.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : "Post Work"} <Send size={20} />
          </motion.button>
        </form>
      </motion.div>
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-bold mb-2">Are you sure?</h2>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                Do you want to post this work? Verified workers in your area will be notified.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-bold text-slate-400 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitWork}
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 font-bold text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Yes, Post it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  
        </div>
    )
}