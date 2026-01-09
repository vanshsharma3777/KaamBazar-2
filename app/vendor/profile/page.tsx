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
    Store,
    Calendar,
    UserCog,
    Briefcase,
    Users,
    UserCheck
} from 'lucide-react';
import VendorHeader from "@/components/vendorHeader";

export default function VendorProfilePage() {
    interface VendorDetails {
        ownerName: string;
        shopName: string;
        address: string;
        mobileNumber: string;
        age: string;
    }

    const router = useRouter();
    const { data: session, status } = useSession();
    const [loader, setLoader] = useState(false);
    const [vendorDetails, setVendorDetails] = useState<VendorDetails | null>(null);

    useEffect(() => {
        async function getResponse() {
            setLoader(true);
            if (status === 'unauthenticated') {
                router.replace('/api/auth/signin');
            } else if (status === 'authenticated') {
                try {
                    const res = await axios.get(`/api/vendor/details`);
                    console.log(res.data)
                    if (res.data.success === false || !res.data.userDetails) {
                        router.replace('/vendor/create-profile');
                        return;
                    }
                    setVendorDetails(res.data.userDetails);
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response?.status === 404) {
                        router.replace('/vendor/create-profile');
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
                <VendorHeader tab={"profile"} />

                <div className="h-full w-full text-slate-200 p-4 md:p-8 relative overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-5xl mx-auto relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6"
                        >
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        src={session.user?.image || '/pro.png'}
                                        alt="Profile"
                                        className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/10 bg-slate-800 object-cover"
                                    />
                                    <div className="absolute bottom-1 right-1 bg-emerald-500 p-1.5 rounded-full border-4 border-[#020617]">
                                        <ShieldCheck size={16} className="text-white" />
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-1">
                                        {vendorDetails?.shopName ? capitalName(vendorDetails.shopName, "Vendor") : "Vendor"}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Store size={12} /> Store Name
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                onClick={() => router.push('/vendor/update-profile')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-semibold text-sm"
                            >
                                <Edit3 size={18} /> Edit Profile
                            </motion.button>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="md:col-span-2 p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl"
                            >
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                    Shop & Owner Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                                    <InfoItem icon={<UserCheck className="text-emerald-400" />} label="Owner Name" value={capitalName(vendorDetails?.ownerName!, "Vendor")} />
                                    <InfoItem icon={<Store className="text-cyan-400" />} label="Shop Name" value={vendorDetails?.shopName!} />
                                    <InfoItem icon={<Phone className="text-emerald-400" />} label="Phone Number" value={vendorDetails?.mobileNumber!} />
                                    <InfoItem icon={<Calendar className="text-purple-400" />} label="Age" value={`${vendorDetails?.age} Years`} />
                                    <div className="md:col-span-2">
                                        <InfoItem icon={<MapPin className="text-rose-400" />} label="Shop Address" value={vendorDetails?.address ? capitalName(vendorDetails.address, "Address Not Found") : "Address Not Found"} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InfoItem icon={<Mail className="text-indigo-400" />} label="Login Email" value={session.user?.email!} />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                                    <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                        <Users size={18} /> Shop Status
                                    </h4>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                        Your shop is visible to users. Keep your inventory and products updated to attract more customers.
                                    </p>
                                    <div className="py-2 px-4 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                                        OPEN FOR BUSINESS
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10">
                                    <h4 className="text-white font-bold mb-4">Switch Role</h4>
                                    <ul className="space-y-4">
                                        <SettingsLink icon={<UserCog size={18} />} label="User" />
                                        <SettingsLink icon={<Briefcase size={18} />} label="Worker" />
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
        <div className="flex items-start gap-4 group">
            <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-1">{label}</p>
                <p className="text-base text-slate-200 font-semibold">{value || "Not Provided"}</p>
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