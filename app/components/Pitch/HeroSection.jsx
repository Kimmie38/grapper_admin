import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export function HeroSection({ preLaunchStats }) {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-black to-purple-500/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-8 max-w-5xl"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6"
        >
          <span className="bg-gradient-to-r from-emerald-400 to-purple-400 text-black px-6 py-2 rounded-full text-sm font-bold">
            PRE-LAUNCH • SEED ROUND • $2M RAISE
          </span>
        </motion.div>

        <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
          GRAPPER
        </h1>

        <p className="text-3xl md:text-4xl font-light mb-8 text-gray-300">
          The Campus Economy Platform
        </p>

        <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Connecting 150M+ university students worldwide with peer-to-peer
          services, creating a $50B marketplace opportunity
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 px-8 py-4 rounded-2xl">
            <div className="text-4xl font-bold text-emerald-400">
              {preLaunchStats.waitlistSignups.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Waitlist Signups</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 px-8 py-4 rounded-2xl">
            <div className="text-4xl font-bold text-purple-400">
              {preLaunchStats.campusInterest}+
            </div>
            <div className="text-sm text-gray-400">Campuses Interested</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 px-8 py-4 rounded-2xl">
            <div className="text-4xl font-bold text-teal-400">
              {preLaunchStats.pilotProviders}
            </div>
            <div className="text-sm text-gray-400">Pilot Providers Ready</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 px-8 py-4 rounded-2xl">
            <div className="text-4xl font-bold text-yellow-400">
              {preLaunchStats.marketValidation}%
            </div>
            <div className="text-sm text-gray-400">Would Use Platform</div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-gray-500"
        >
          <ChevronDown size={40} className="mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}
