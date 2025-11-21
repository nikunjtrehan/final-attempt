import React from 'react';
import { ArrowRight, Search, DollarSign, Check, Briefcase, HeartPulse, TrendingUp, ShieldCheck, Server, Building } from 'lucide-react';
import { Button, PageWrapper } from '../components/UI';
import { PageView } from '../types';

export const HomePage: React.FC<{ setPage: (page: PageView) => void }> = ({ setPage }) => {
  return (
    <PageWrapper>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
             <div className="absolute inset-0 bg-zinc-950">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-950 to-zinc-950 opacity-50"></div>
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100"></div>
             </div>
             
             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium mb-8 animate-fadeIn">
                    <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                    Live Experts Available Now
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                    Expertise on Demand.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
                        Billed by the Minute.
                    </span>
                </h1>
                <p className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                    Instant access to top-tier industry leaders, specialized consultants, and enterprise firms. Pay only for the advice you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
                    <Button onClick={() => setPage('browse')} className="h-14 px-8 text-lg shadow-red-500/20">
                        Find an Expert <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button onClick={() => setPage('signup')} variant="secondary" className="h-14 px-8 text-lg">
                        Become an Expert
                    </Button>
                </div>
             </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-zinc-900 border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white">Industry Categories</h2>
                    <p className="text-zinc-400 mt-4">Explore specialized talent across critical sectors.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { name: "Legal", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        { name: "Tech", icon: Server, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { name: "Finance", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
                        { name: "Health", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-500/10" },
                        { name: "Business", icon: Building, color: "text-purple-500", bg: "bg-purple-500/10" },
                        { name: "Product", icon: Briefcase, color: "text-orange-500", bg: "bg-orange-500/10" },
                    ].map((cat, i) => (
                        <div key={i} onClick={() => setPage('browse')} className="group cursor-pointer p-6 bg-zinc-800 rounded-2xl border border-zinc-700/50 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 text-center">
                            <div className={`mx-auto w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <cat.icon size={24} className={cat.color} />
                            </div>
                            <h3 className="font-semibold text-zinc-200 group-hover:text-white">{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { title: "Search & Match", desc: "Use our AI-powered search to find the perfect expert for your specific problem.", icon: Search },
                        { title: "Secure Pre-auth", desc: "Pre-authorize funds via Stripe/UPI. You are only charged for the exact duration.", icon: DollarSign },
                        { title: "Instant Connect", desc: "Jump into a secure video/audio call immediately or schedule for later.", icon: Check },
                    ].map((item, i) => (
                        <div key={i} className="relative p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
                             <div className="absolute -top-6 left-8 bg-zinc-800 border border-zinc-700 p-4 rounded-2xl shadow-xl">
                                <item.icon size={28} className="text-red-500" />
                             </div>
                             <h3 className="mt-8 text-xl font-bold text-white mb-3">{item.title}</h3>
                             <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </PageWrapper>
  );
};
