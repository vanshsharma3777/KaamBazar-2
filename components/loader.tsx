
import { motion } from 'framer-motion';

 export function Loader() {
    return(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]">
      <div className="absolute w-[300px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full" />

      <div className="relative flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-3 w-3 rounded-full bg-indigo-400"
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [0, -6, 0],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,

                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Text */}
        <p className="text-sm font-semibold tracking-wide text-slate-400">
          Loading ...
        </p>
      </div>
    </div>
    )
}