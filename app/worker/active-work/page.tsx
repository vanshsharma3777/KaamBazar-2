'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Briefcase, Calendar, Clock, ImageIcon, MapPin, Maximize2, Navigation, Phone, User, X } from 'lucide-react';
import axios from "axios";
import { Loader } from '../../../components/loader';
import WorkerHeader from "@/components/workerHeader";
import { on } from "events";
import { useRouter } from "next/navigation";

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "N/A";
    const R = 6371

    const toRad = (deg: number) => (deg * Math.PI) / 180

    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return (R * c).toFixed(2) + " km"
};


export default function ActiveWorkPage() {
    const router = useRouter()
    const [activeWorks, setActiveWorks] = useState<any[]>([]);
    const [workerDetails, setWorkerDetails] = useState<{ lat: number, lan: number, occupation: string } | null>(null);
    const [selectedWork, setSelectedWork] = useState<any | null>(null);
    const [filterByOccupation, setFilterByOccupation] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workerRes, workRes] = await Promise.all([
                    axios.get('/api/worker/details'),
                    axios.get('/api/all-work')
                ]);
                
                if (workerRes.data.success && (workRes.status===201 || workerRes.status===201)) {
                    router.replace('/worker/create-profile')
                }
                if (workerRes.data.success) {
                    setWorkerDetails(workerRes.data.userDetails);
                }

                if (workRes.data.success) {
                    const active = workRes.data.allWork.filter((w: any) => w.isActive);
                    setActiveWorks(active);
                }
            } catch (error) {
                if(axios.isAxiosError(error)){
                    const errorStatus = error.response?.status
                    if(errorStatus===402){
                        router.replace('/worker/create-profile')
                    }
                }
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const displayWorks = activeWorks.filter((work) => {
        if (!filterByOccupation || !workerDetails?.occupation) return true;
        return work.title.toLowerCase().includes(workerDetails.occupation.toLowerCase());
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const sortedWorks = [...activeWorks].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#020617]"><Loader /></div>;

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <WorkerHeader tab="active" />

            <main className="max-w-4xl mx-auto p-6">
                <AnimatePresence mode="wait">
                    {!selectedWork ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-black">Active <span className="text-indigo-400">Opportunities</span></h1>
                                    <p className="text-slate-500 text-sm">
                                        {workerDetails ? `Showing tasks for ${workerDetails.occupation}` : "Tasks available in your area"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
                                    <span className="text-[10px] font-bold uppercase tracking-wider pl-2 text-slate-400">
                                        {filterByOccupation ? "Recommended" : "All Jobs"}
                                    </span>
                                    <button
                                        onClick={() => setFilterByOccupation(!filterByOccupation)}
                                        className={`relative w-11 h-6 rounded-full transition-colors ${filterByOccupation ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                    >
                                        <motion.div
                                            animate={{ x: filterByOccupation ? 22 : 4 }}
                                            className="w-4 h-4 bg-white rounded-full absolute top-1"
                                        />
                                    </button>
                                </div>
                            </div>
                            {displayWorks.length === 0 ? (
                                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-slate-900/20">
                                    <div className="bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Briefcase className="text-indigo-400" size={30} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                                        {filterByOccupation
                                            ? `We couldn't find any active "${workerDetails?.occupation.toLocaleUpperCase().trim()}" jobs right now.`
                                            : "There are no active jobs posted in the system at the moment."}
                                    </p>
                                    {filterByOccupation && (
                                        <button
                                            onClick={() => setFilterByOccupation(false)}
                                            className="text-indigo-400 font-bold hover:text-white transition-colors text-sm underline underline-offset-4"
                                        >
                                            Show all other types of work
                                        </button>
                                    )}
                                </div>
                            ) : (
                                displayWorks.map((work, index) => (
                                    <WorkCard
                                        key={work.id || index}
                                        work={work}
                                        distance={workerDetails ? getDistance(workerDetails.lat, workerDetails.lan, work.lat, work.lng) : "Calculating..."}
                                        onViewDetails={() => setSelectedWork(work)}
                                    />
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                        >
                            <button
                                onClick={() => setSelectedWork(null)}
                                className="flex items-center gap-2 text-indigo-400 hover:text-white mb-6 font-bold transition-all group"
                            >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Job Feed
                            </button>
                            <WorkDetailsView work={selectedWork} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
function WorkCard({ work, distance, onViewDetails }: any) {
    const formatExactDateTime = (dateString: string) => {
        const date = new Date(dateString);

        const datePart = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        const timePart = date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return { datePart, timePart };
    };

    const { datePart, timePart } = formatExactDateTime(work.createdAt);

    return (
        <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 hover:border-indigo-500/40 transition-all group relative">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-white capitalize tracking-tight">
                        {work.title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-1">
                        {work.description}
                    </p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20">
                    <Navigation size={12} /> {distance}
                </div>
            </div>
            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <MapPin size={14} className="text-indigo-500 shrink-0" />
                    <span className="truncate">{work?.address || "Location not specified"}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                        <Calendar size={12} className="text-indigo-400" />
                        <span>{datePart}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                        <Clock size={12} className="text-indigo-400" />
                        <span>{timePart}</span>
                    </div>
                </div>
            </div>
            <button
                onClick={onViewDetails}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 group-hover:shadow-indigo-600/20"
            >
                View Full Details
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}


function WorkDetailsView({ work }: any) {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    return (
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden">
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImg(null)}
                        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <button className="absolute top-10 right-10 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all">
                            <X size={24} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={selectedImg}
                            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
                            alt="Preview"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="p-8 bg-gradient-to-br from-indigo-600/20 to-transparent border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded mb-4 inline-block">
                    Job Request
                </span>
                <h2 className="text-4xl font-black capitalize mb-2">{work.title}</h2>
            </div>

            <div className="p-8 space-y-8">
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2">Requirement</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">{work.description}</p>
                </div>
                {work.photo && work.photo.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-4 flex items-center gap-2">
                            <ImageIcon size={14} /> Attached Photos ({work.photo.length})
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {work.photo.map((imgUrl: string, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedImg(imgUrl)}
                                    className="relative min-w-[160px] h-32 rounded-2xl overflow-hidden cursor-pointer group border border-white/10"
                                >
                                    <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                        <Maximize2 className="text-white" size={20} />
                                    </div>
                                    <img
                                        src={imgUrl}
                                        alt={`Work preview ${idx}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                        <h3 className="text-xs font-bold text-emerald-500 uppercase mb-4">Client Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400"><User size={20} /></div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase">Name</p>
                                    <p className="font-bold">{work.user?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400"><Phone size={20} /></div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase">Mobile</p>
                                    <p className="font-mono font-bold">{work.user?.mobileNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-indigo-500 uppercase mb-4">Service Location</h3>
                            <div className="flex gap-3">
                                <MapPin className="text-rose-500 shrink-0" size={20} />
                                <p className="text-slate-300 text-sm font-medium">{work?.address}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.open(`https://www.google.com/maps?q=${work.lat},${work.lng}`)}
                            className="mt-6 w-full py-3 bg-white text-black rounded-xl font-black text-sm hover:bg-slate-200 transition-all"
                        >
                            GET DIRECTIONS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}