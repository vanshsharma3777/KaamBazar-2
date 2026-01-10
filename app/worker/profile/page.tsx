'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from '@/components/loader';
import {
    User,
    Mail,
    MapPin,
    Phone,
    Edit3,
    ShieldCheck,
    Briefcase,
    IndianRupee,
    Calendar,
    UserCog,
    Building2,
    Users
} from 'lucide-react';
import WorkerHeader from "@/components/workerHeader";

export default function WorkerProfilePage() {
    interface WorkerDetails {
        name: string;
        address: string;
        mobileNumber: string;
        occupation: string;
        dailyWage: string;
        age: string;
    }

    const router = useRouter();
    const { data: session, status } = useSession();
    const [loader, setLoader] = useState(false);
    const [workerDetails, setWorkerDetails] = useState<WorkerDetails | null>(null);

    useEffect(() => {
        async function getResponse() {
            setLoader(true);
            if (status === 'unauthenticated') {
                router.replace('/');
            } else if (status === 'authenticated') {
                try {
                    const res = await axios.get(`/api/worker/details`);
                    const data = res.data.userDetails;
                    if (res.data.success === true && res.status===201 ) {
                        router.replace('/worker/create-profile');
                        return;
                    }
                    setWorkerDetails(res.data.userDetails);

                } catch (error) {
                    if (axios.isAxiosError(error) && error.response?.status === 404) {
                        router.replace('/worker/create-profile');
                    }
                } finally {
                    setLoader(false);
                }
            }
        }
        getResponse();
    }, [router, status]);

    const capitalName = (str: string, msg: string) => {
        return str ? str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") : msg;
    };


    if (status === 'loading' || loader) {
        return <Loader />;
    }

    if (status === "authenticated") {
        return (
            <div className="bg-[#020617] min-h-screen w-screen overflow-x-hidden">
                <WorkerHeader tab={"profile"} />

                <div className="h-full w-full text-slate-200 p-4 md:p-8 relative overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-5xl mx-auto relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-6 text-center md:text-left"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        src={session.user?.image || '/pro.png'}
                                        alt="Profile"
                                        className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/10 bg-slate-800 object-cover"
                                    />
                                    <div className="absolute bottom-1 right-1 bg-blue-500 p-1.5 rounded-full border-4 border-[#020617]">
                                        <ShieldCheck size={16} className="text-white" />
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-start">
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-2">
                    {workerDetails?.name ? capitalName(workerDetails.name, "Worker") : "Worker"}
                </h1>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Briefcase size={12} /> {workerDetails?.occupation || "Worker"}
                </span>
            </div>
                            </div>

                            <motion.button
                                onClick={() => router.push('/worker/update-profile')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-semibold text-sm"
                            >
                                <Edit3 size={18} /> Edit Profile
                            </motion.button>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="lg:col-span-2 p-6 md:p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl"
                            >
                                <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center gap-2">
                                    Professional Details
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-4">
                                    <InfoItem icon={<Briefcase className="text-blue-400" />} label="Occupation" value={capitalName(workerDetails?.occupation!, "Worker")} />
                                    <InfoItem icon={<IndianRupee className="text-emerald-400" />} label="Daily Wage" value={`${workerDetails?.dailyWage} / Day`} />
                                    <InfoItem icon={<Phone className="text-cyan-400" />} label="Phone Number" value={workerDetails?.mobileNumber!} />
                                    <InfoItem icon={<Calendar className="text-purple-400" />} label="Age" value={`${workerDetails?.age} Years`} />
                                    <div className="md:col-span-2">
                                        <InfoItem icon={<MapPin className="text-rose-400" />} label="Work Address" value={workerDetails?.address ? capitalName(workerDetails.address, "Unable to fetch") : "Unable to fetch"} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InfoItem icon={<Mail className="text-indigo-400" />} label="Email Address" value={session.user?.email!} />
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                                    <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                                        <Users size={18} /> Work Status
                                    </h4>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                        Your profile is visible to recruiters. Keep your daily wage updated to get better offers.
                                    </p>
                                    <div className="py-2 px-4 bg-blue-500/20 rounded-xl border border-blue-500/30 text-blue-300 text-xs font-bold text-center">
                                        AVAILABLE FOR HIRE
                                    </div>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10">
                                    <h4 className="text-white font-bold mb-4">Switch Role</h4>
                                    <ul className="space-y-4">
                                        <SettingsLink icon={<UserCog size={18} />} label="User" />
                                        <SettingsLink icon={<Building2 size={18} />} label="Vendor" />
                                    </ul>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center sm:items-start gap-3 md:gap-4 group">
            <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                {icon}
            </div>
            <div className="min-w-0"> 
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.15em] text-slate-500 mb-0.5 md:mb-1">
                    {label}
                </p>
                <p className="text-sm md:text-base text-slate-200 font-semibold truncate">
                    {value || "Not Provided"}
                </p>
            </div>
        </div>
    );
}

function SettingsLink({ icon, label }: { icon: React.ReactNode, label: string }) {
    const router = useRouter();
    return (
        <li onClick={() => {
            const newLabel = label.toLowerCase();
            router.push(`/${newLabel}/profile`);
        }} className="flex items-center justify-between text-slate-400 hover:text-white cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
                {icon}
                <span className="font-medium">{label}</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                →
            </div>
        </li>
    );
}