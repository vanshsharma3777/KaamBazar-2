'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from '../../../components/loader'
import UserHeader from "@/components/userHeader";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Edit3,
  Settings,
  ShieldCheck,
  ExternalLink,
  Store,
  HardHat,
  UserCog,
  Building2
} from 'lucide-react';
export default function UserProfilePage() {
  interface UserDetails {
    name: string,
    address: string,
    mobileNumber: string
    lat: number
    lng: number,
  }
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loader, setLoader] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

  useEffect(() => {
    async function getResponse() {
      setLoader(true)
      console.log(status)
      if (status === 'unauthenticated') {
        router.replace('/api/auth/signin')
      }
      else {
        try {
          const res = await axios.get(`/api/user/details`)
          const data = res.data.userDetails
          console.log(data)
          setUserDetails(data)
          if (!data) {
            console.log("No details found for user:", res.data)
            return
          }
        } catch (error) {
          setLoader(true)
          if (axios.isAxiosError(error)) {
            const status = error.response?.status

            if (status === 404) {
              router.replace('/user/create-profile')
              return
            }

            if (status === 401) {
              router.replace('/api/auth/signin')
              return
            }

            console.log("Handled API error:", error.response?.data)
          }
        } finally {
          setLoader(false)
        }
      }
    }
    getResponse()
  }, [router, status])
  const formatDate = (dateString: string) => {
    console.log(dateString)
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (status === 'loading' || loader) {
    return <Loader></Loader>
  }
  if (status === "authenticated") {
    return (
      <div className="bg-[#020617] h-screen w-screen overflow-x-hidden">
        <UserHeader tab={"profile"}></UserHeader>

        <div className="h-full w-full text-slate-200 p-4 md:p-8 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={session.user?.image! || '/pro.png' } 
                    alt="Profile"
                    className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/10 bg-slate-800 object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-emerald-500 p-1.5 rounded-full border-4 border-[#020617]">
                    <ShieldCheck size={16} className="text-white" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-1">
                    {userDetails?.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                      User
                    </span>

                  </div>
                </div>
              </div>

              <motion.button onClick={()=>{
                  router.push('/user/update-profile')
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-semibold text-sm"
              >
                <Edit3 size={18}  /> Edit Profile
              </motion.button>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <InfoItem icon={<Mail className="text-indigo-400" />} label="Email Address" value={session.user?.email!} />
                  <InfoItem icon={<Phone className="text-emerald-400" />} label="Phone Number" value={userDetails?.mobileNumber!} />
                  <InfoItem icon={<MapPin className="text-rose-400" />} label="Address" value={userDetails?.address!} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div className="p-8 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20">
                  <h4 className="text-indigo-400 font-bold mb-2">Account Status</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">Your account is fully verified. You can now post projects and hire workers.</p>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[100%] bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10">
                  <h4 className="text-white font-bold mb-4">Switch your role  </h4>
                  <ul className="space-y-4">
                    <SettingsLink icon={<UserCog size={18} />} label="Worker" />
                    <SettingsLink  icon={<Building2  size={18} />} label="Vendor"  />
                  </ul>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    );

  }

  function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
      <div className="flex items-start gap-4 group">
        <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
          <p className="text-lg text-slate-200 font-medium">{value}</p>
        </div>
      </div>
    );
  }

  function SettingsLink({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
      <li onClick={()=>{
       const newLabel = label.charAt(0).toLowerCase()+label.slice(1)
        router.push(`/${newLabel}/home`)
      }} className="flex items-center justify-between text-slate-400 hover:text-white cursor-pointer transition-colors group">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </div>
      </li>
    );
  }

}