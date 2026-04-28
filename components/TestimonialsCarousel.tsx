import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { cn } from '../lib/utils';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1, name: "Alex Johnson", role: "Full Stack Developer", company: "TechFlow",
    content: "ProConnect matched me with a senior architect in under 30 seconds. The per-minute billing means I only paid for exactly what I needed. Absolute game changer.",
    rating: 5, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: 2, name: "Sarah Miller", role: "VP of Engineering", company: "DesignHub",
    content: "The quality of experts on this platform is outstanding. We've used ProConnect for three major technical decisions and saved weeks of internal deliberation each time.",
    rating: 5, avatar: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: 3, name: "Michael Chen", role: "Product Manager", company: "InnovateLabs",
    content: "Our team launched our MVP in record time thanks to expert guidance from ProConnect. The NDA coverage made enterprise adoption seamless. Highly recommended!",
    rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: 4, name: "Jessica Harper", role: "Enterprise Client", company: "GlobalCorp",
    content: "End-to-end encrypted sessions and verified experts gave us the confidence to discuss sensitive M&A strategy. The ROI on a single 20-minute call was extraordinary.",
    rating: 5, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&auto=format&fit=crop",
  },
];

const COMPANIES = ["Google", "McKinsey", "Deloitte", "Stripe", "Meta"];

export function TestimonialsCarousel({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (isInView) controls.start("visible"); }, [isInView, controls]);

  const containerV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemV = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

  return (
    <section ref={sectionRef} id="testimonials" className={cn("py-24 sm:py-32 relative overflow-hidden bg-[#050505]", className)}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" animate={controls} variants={containerV} className="text-center mb-16 space-y-4">
          <motion.h2 variants={itemV} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">What Our Users Say</motion.h2>
          <motion.p variants={itemV} className="text-slate-400 max-w-[700px] mx-auto md:text-lg">Hear directly from clients and experts who have transformed their workflows using ProConnect.</motion.p>
        </motion.div>

        <motion.div initial="hidden" animate={controls} variants={containerV} className="md:grid md:grid-cols-[1fr_auto] gap-8 items-center max-w-[900px] mx-auto">
          <motion.div variants={itemV} className="relative">
            <div className="absolute -top-6 -left-4 z-10"><Quote className="h-10 w-10 text-teal-500/20" strokeWidth={1} /></div>
            <div className="relative h-[340px] sm:h-[300px] md:h-[280px]">
              {TESTIMONIALS.map((t, i) => (
                <div key={t.id} className={cn("absolute inset-0 transition-all duration-500 ease-out", i === activeIndex ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[60px] pointer-events-none")}>
                  <div className="h-full border border-white/10 bg-white/[0.04] backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-6 md:p-8 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full border-2 border-teal-500/20 overflow-hidden flex-shrink-0 bg-zinc-800">
                            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                          </div>
                          <div><h4 className="font-semibold text-white">{t.name}</h4><p className="text-sm text-slate-400">{t.role}, {t.company}</p></div>
                        </div>
                        <div className="flex gap-0.5">{[...Array(t.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-500 text-yellow-500" />)}</div>
                      </div>
                      <div className="h-px bg-white/10 my-4" />
                      <p className="flex-1 italic text-base leading-relaxed text-slate-300">"{t.content}"</p>
                      <div className="mt-4 text-xs text-right text-slate-500">Verified Customer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemV} className="flex md:flex-col gap-4 justify-center mt-8 md:mt-0">
            <button onClick={() => setActiveIndex((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="rounded-full h-10 w-10 flex items-center justify-center border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-colors text-slate-400 hover:text-white" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
            <div className="flex md:flex-col gap-2 items-center justify-center">
              {TESTIMONIALS.map((_, i) => <button key={i} className={cn("w-2 h-2 rounded-full transition-all duration-300", i === activeIndex ? "bg-teal-400 scale-125" : "bg-white/20 hover:bg-white/40")} onClick={() => setActiveIndex(i)} aria-label={`Testimonial ${i+1}`} />)}
            </div>
            <button onClick={() => setActiveIndex((p) => (p + 1) % TESTIMONIALS.length)} className="rounded-full h-10 w-10 flex items-center justify-center border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-colors text-slate-400 hover:text-white" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
          </motion.div>
        </motion.div>

        <motion.div initial="hidden" animate={controls} variants={containerV} className="mt-20 pt-10 border-t border-white/5">
          <motion.h3 variants={itemV} className="text-sm font-medium text-slate-500 text-center mb-8 tracking-widest uppercase">Trusted by innovative teams worldwide</motion.h3>
          <motion.div variants={itemV} className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {COMPANIES.map((c) => <div key={c} className="text-xl font-bold tracking-tight text-white/20 hover:text-white/40 transition-colors">{c}</div>)}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
