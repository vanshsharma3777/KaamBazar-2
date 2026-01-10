'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { toast, Toaster } from 'react-hot-toast';
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from '../../../components/loader'
import UserHeader from "@/components/userHeader";

import {
    Clock,
    CheckCircle2,
    Calendar,
    User,
    Phone,
    ArrowRight,
    History,
    Activity
} from 'lucide-react';
import { BlinkingPoint } from "@/components/blink";
const initialActiveWorks = [
    {
        id: 'w-101',
        title: 'Kitchen Sink Leakage',
        description: 'The pipe under the sink is leaking severely. Need immediate fix.',
        createdAt: '2024-05-20T10:30:00',
        category: 'Plumber'
    },
    {
        id: 'w-102',
        title: 'Short Circuit in Living Room',
        description: 'Main switch is tripping repeatedly when AC is turned on.',
        createdAt: '2024-05-21T14:15:00',
        category: 'Electrician'
    }
];


export default function CreateNewWork() {
    interface UserDetails {
        name: string,
        address: string,
        mobileNumber: string
        lat: number
        lng: number
    }

    interface Worker {
        id?: string;
        name: string;
        phone: string;
    }

    interface Work {
        id: string;
        title: string;
        description:string,
        isActive: boolean;
        lat: number;
        lng: number;
        worker: Worker,
        createdAt:string
        updatedAt:string
    }


    const router = useRouter();
    const { data: session, status } = useSession();
    const [loader, setLoader] = useState(false)
    const [activeWorks, setActiveWorks] = useState<Work[]>([]);
    const [pastWorks, setPastWorks] = useState<Work[]>([]);
    const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
    const [allWork, setAllWork] = useState<Work[]>([])
    const [completingId, setCompletingId] = useState<string | null>(null);


    useEffect(() => {
        async function getResponse() {
            setLoader(true)
            if (status === 'unauthenticated') {
                router.replace('/')
            }
            const res = await axios.get(`/api/work`)
            if(!res.data.success){
                router.replace("/user/create-profile")
                return
            }
            if (res.data.allWork.length != 0) {
                setAllWork(res.data.allWork)
            }
            else{
                console.log("Work length is empty")
            }
        }
        getResponse()
    }, [])

    useEffect(() => {
        if (!allWork) return;
        const active = allWork.filter(work=>work.isActive)
        const past = allWork.filter(work=>!work.isActive)
        setActiveWorks(active)
        setPastWorks(past)
    }, [allWork ])


    const markAsComplete = async (work: Work) => {
        setCompletingId(work.id)
       setActiveWorks(prev => prev.filter(w => w.id !== work.id));
  setPastWorks(prev => [
    {
      ...work,
      isActive: false,
      completedAt: new Date().toISOString(),
    },
    ...prev,
  ]);
       try {
    
    await axios.put(`/api/work/${work.id}`, { isActive: false });

    toast.success("Work marked as completed!", {
      style: { background: "#064e3b", color: "#fff" },
    });

    const res = await axios.get(`/api/work/${work.id}`)
  } catch (error) {
    setPastWorks(prev => prev.filter(w => w.id !== work.id));
    setActiveWorks(prev => [...prev, work]);
    if(axios.isAxiosError(error)){
        const errorStatus = error.response?.status;
        if(errorStatus === 404){
            router.replace('/user/create-profile')
        }
    }

    toast.error("Failed to mark work complete");
  } finally {
    setCompletingId(null);
  }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (status === "loading") {
        return (
            <div className="h-screen flex items-center justify-center bg-[#020617]">
                <Loader />
            </div>
        );
    }
    {
return (
<div>
<UserHeader tab={"history"}></UserHeader>
<div className="min-h-screen w-full bg-[#020617] text-white p-6 md:p-12 relative overflow-hidden">
<Toaster />
<div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-indigo-600/10 blur-[100px] rounded-full" />
<div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-emerald-600/10 blur-[100px] rounded-full" />

<div className="max-w-5xl mx-auto relative z-10">
    <header className="mb-10">
        <h1 className="text-4xl font-black mb-6 tracking-tight">Work <span className="text-indigo-400">Status</span></h1>
        <div className="flex p-1.5 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl w-fit">
            <button
                onClick={() => setActiveTab('active')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'active' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white'}`}
            >
                <Activity size={18} /> Active ({activeWorks.length})
            </button>
            <button
                onClick={() => setActiveTab('past')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'past' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
            >
                <History size={18} /> Past ({pastWorks.length})
            </button>
        </div>
    </header>

    <div className="space-y-6">
        <AnimatePresence mode="wait">
{activeTab === 'active' ? (
    <motion.div
        key="active-list"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-6"
    >
        {activeWorks.length === 0 && <EmptyState message="No active tasks found." />}
        {activeWorks.map((work) => (
            <div key={work.id} className="p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <BlinkingPoint></BlinkingPoint>
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase rounded-md border border-indigo-500/20">
                                {work.title}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 text-xs">
                                <Clock size={14} /> Created: {formatDate(work.createdAt)}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold group-hover:text-indigo-400 transition-colors">{work.title}</h2>
                        <p className="text-slate-400 leading-relaxed max-w-2xl">{work.description}</p>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={() =>  markAsComplete(work)}
                            className="w-full md:w-auto px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                           {completingId===work.id ? "Completing..." :" Mark as Complete"} <CheckCircle2 size={18} />
                        </button>
                    </div>  
                </div>
            </div>
        ))}
    </motion.div>
) : (
    <motion.div
        key="past-list"
        initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
>
    {pastWorks.length === 0 && <EmptyState message="No project history yet." />}
    {pastWorks.map((work) => (
        <div key={work.id} className="p-8 rounded-[2.5rem] bg-slate-900/20 backdrop-blur-sm border border-emerald-500/10 group">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                    <div>
                        <div className="flex gap-3">
                            <BlinkingPoint ></BlinkingPoint>
                            <h2 className="text-xl  font-bold text-slate-300">{work.title}</h2>
                        </div>
                        <p className="text-emerald-500/70 text-xs font-medium flex items-center gap-1 mt-1">
                            <Calendar size={14} /> Completed: {formatDate(work.updatedAt!)}
                        </p>
                    </div>
                    <div
                        onClick={() => router.push(`/worker/details/${work.worker?.id}`)}
                        className="inline-flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 cursor-pointer transition-all"
                    >
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Completed By</p>
                            <p className="text-sm font-bold text-white flex items-center gap-2">
                                {work.worker?.name} <ArrowRight size={14} className="text-emerald-400" />
                            </p>
                        </div>
                        <div className="ml-4 border-l border-white/10 pl-4">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Contact</p>
                            <p className="text-sm font-mono text-slate-300">{work.worker?.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center opacity-40">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                </div>
            </div>
        </div>
    ))}
</motion.div>
)}
</AnimatePresence>
</div>
</div>
</div>
            </div>
        );
}

    function EmptyState({ message }: { message: string }) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                <div className="text-slate-600 mb-4 flex justify-center"><History size={48} /></div>
                <p className="text-slate-500 font-medium">{message}</p>
            </div>
        );
    }

}