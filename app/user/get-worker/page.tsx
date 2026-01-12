'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion'
import { Loader } from '../../../components/loader'
import UserHeader from "@/components/userHeader";
import {
  Briefcase,
  Star,
  ChevronRight,
  MapPin,
  Clock,
  User
} from 'lucide-react';

export default function UserProfilePage() {
  interface WorkerDetails {
    name: string,
    mobileNumber: string,
    lat: number,
    id: string,
    lan: number,
    occupation: string,
    distance: number,
    address: string,
    role: string,
    photo: string,
    hourlyWages:number,
    experience:number,
    dailyWage: number,
    age: number
  }

  const router = useRouter();
  const { status } = useSession();
  const [loader, setLoader] = useState(false)
  const [workerDetails, setWorkerDetails] = useState<WorkerDetails[]>([])

  useEffect(() => {
    async function getResponse() {
      if (status === 'unauthenticated') {
        router.replace('/')
        return;
      }
      if (status === 'authenticated') {
        try {
          setLoader(true)
          const res = await axios.get(`/api/all-workerandVendor`)
          if(res.status===201 && !res.data.success){
            router.replace('/user/create-profile')
          }
          const data = res.data.allPerson
          setWorkerDetails(res.data.allWorker || [])
        } catch (err) {
        } finally {
          setLoader(false)
        }
      }
    }
    getResponse()
  }, [router, status])

  if (status === 'loading' || loader) {
    return <Loader />
  }

  if (status === "authenticated") {
    return (
      <div className="w-full min-h-screen bg-[#020617] overflow-x-hidden">
        <UserHeader tab={"workers"} />

        <div className="p-4 md:p-8 relative">
          <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            <header className="mb-8">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight"
              >
                Available <span className="text-emerald-400">Professionals</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400 text-sm md:text-base"
              >
                Find verified local workers for your home or business.
              </motion.p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {workerDetails.map((worker, index) => (
                <motion.div
                  key={worker.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                    className=" group relative"
                >
                  <div className="h-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[1.5rem] p-5 transition-all hover:bg-slate-900/60 hover:border-white/20 shadow-xl flex flex-col">

                    <div className="relative mb-4 flex justify-center">
                      <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-75 group-hover:scale-100 transition-transform" />
                      <img
                        src={worker.photo || '/pro.png'}
                        alt={worker.name}
                        className="w-20 h-20 rounded-full border-2 border-white/10 relative z-10 bg-slate-800 object-cover"
                      />
                    </div>

                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors truncate">
                        {worker.occupation.toUpperCase().trim()}
                      </h3>
                      <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[14px] font-medium  tracking-wider">
                        <Briefcase size={12} className="text-indigo-400" />
                        Worker name: {worker.name.charAt(0).toUpperCase()+ worker.name.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white/5 rounded-xl p-2 text-center border border-white/5">
                        <p className="text-[12px] uppercase tracking-tighter text-slate-500 font-bold">Age</p>
                        <p className="text-white text-xs font-semibold">{worker.age} Yrs</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2 text-center border border-white/5">
                        <p className="text-[12px] uppercase tracking-tighter text-slate-500 font-bold">Distance</p>
                        <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold">
                          22.5 <span className="text-[9px] opacity-60">KM</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                      <div>
                        <p className="text-[12px] uppercase text-slate-500 font-bold leading-none mb-1">Daily Wage</p>
                        <p className="text-base font-black text-white">₹{worker.dailyWage}</p>
                      </div>
                      <div>
                        <p className="text-[12px] uppercase text-slate-500 font-bold leading-none mb-1">Per Hour Wage</p>
                        <p className="text-base font-black text-white">₹{worker.hourlyWages}</p>
                      </div>
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <ChevronRight size={18} />
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