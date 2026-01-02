
import { motion } from 'framer-motion';

 export function Loader() {
    return(
        <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="mt-8 text-indigo-400 font-black tracking-widest text-sm"
        >
          KAAMBAZAR
        </motion.p>
      </div>
    )
}