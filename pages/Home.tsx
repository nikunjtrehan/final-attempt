import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Globe, ChevronRight, Server, Briefcase, TrendingUp, HeartPulse, Building, ShieldCheck } from 'lucide-react';
import { PageWrapper } from '../components/UI';
import { PageView } from '../types';
import { SplineScene } from '../components/SplineScene';
import { Spotlight } from '../components/Spotlight';
import { LiquidButton } from '../components/LiquidGlassButton';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';
import { FAQSection } from '../components/FAQSection';

export const HomePage: React.FC<{ setPage: (page: PageView) => void }> = ({ setPage }) => {
  return (
    <PageWrapper className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-teal-500/30">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[200px] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 min-h-screen flex flex-col justify-center">
        <div className="w-full min-h-[600px] bg-black/[0.96] relative overflow-hidden rounded-[32px] border border-white/10 shadow-2xl">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          
          <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
            {/* Left content */}
            <div className="flex-1 p-8 md:p-14 relative z-10 flex flex-col justify-center items-start">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-900/50 bg-red-950/20 w-fit backdrop-blur-md mb-8"
              >
                <span className="flex w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-sm font-medium text-red-400">Live Experts Available Now</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white"
              >
                Expertise on Demand.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-[length:200%_auto] animate-shimmer">
                  Billed by the Minute.
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-zinc-400 max-w-lg text-lg leading-relaxed"
              >
                Instant access to top-tier industry leaders, specialized consultants, and enterprise firms. Pay only for the advice you need.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-6 pt-8 w-full sm:w-auto"
              >
                <div className="relative h-[56px] min-w-[200px]">
                  <LiquidButton 
                    onClick={() => setPage('browse')}
                    className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-full text-white"
                  >
                    Find an Expert <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </LiquidButton>
                </div>
                
                <div className="relative h-[56px] min-w-[200px]">
                  <LiquidButton 
                    onClick={() => setPage('signup')}
                    className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-full text-white"
                  >
                    Become an Expert
                  </LiquidButton>
                </div>
              </motion.div>
            </div>

            {/* Right content */}
            <div className="flex-1 relative min-h-[400px] lg:min-h-full">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full absolute inset-0"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Categories */}
      <section className="py-24 relative border-t border-white/5 bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Industry Categories</h2>
            <p className="text-slate-400">Explore specialized talent across critical sectors.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
                { name: "Legal", icon: ShieldCheck, color: "text-emerald-400", bgHover: "hover:border-emerald-500/50" },
                { name: "Tech", icon: Server, color: "text-blue-400", bgHover: "hover:border-blue-500/50" },
                { name: "Finance", icon: TrendingUp, color: "text-amber-400", bgHover: "hover:border-amber-500/50" },
                { name: "Health", icon: HeartPulse, color: "text-rose-400", bgHover: "hover:border-rose-500/50" },
                { name: "Business", icon: Building, color: "text-purple-400", bgHover: "hover:border-purple-500/50" },
                { name: "Product", icon: Briefcase, color: "text-orange-400", bgHover: "hover:border-orange-500/50" },
            ].map((cat, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setPage('browse')} 
                    className={`group cursor-pointer p-6 bg-white/[0.02] rounded-2xl border border-white/5 ${cat.bgHover} transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden`}
                >
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                            <cat.icon size={26} className={cat.color} />
                        </div>
                        <h3 className="font-semibold text-slate-300 group-hover:text-white transition-colors">{cat.name}</h3>
                    </div>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsCarousel />
      <FAQSection />
    </PageWrapper>
  );
};