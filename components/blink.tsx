"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface BlinkingPointProps {
  color?: "indigo" | "emerald" | "amber" | "rose";
  label?: string;
}

export const BlinkingPoint = ({ color = "indigo", label }: BlinkingPointProps) => {
  const colorMap = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  const glowMap = {
    indigo: "bg-indigo-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${glowMap[color]} opacity-75`}></span>
        
        <span className={`relative inline-flex rounded-full h-3 w-3 ${colorMap[color]} shadow-[0_0_8px_rgba(var(--color-rgb),0.5)]`}></span>
      </div>
      
      {label && (
        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${color === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'}`}>
          {label}
        </span>
      )}
    </div>
  );
};