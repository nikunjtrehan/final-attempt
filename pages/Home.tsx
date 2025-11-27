import React from 'react';
import { ArrowRight, Search, DollarSign, Check, Briefcase, HeartPulse, TrendingUp, ShieldCheck, Server, Building, Zap } from 'lucide-react';
import { Button, PageWrapper } from '../components/UI';
import { PageView } from '../types';

export const HomePage: React.FC<{ setPage: (page: PageView) => void }> = ({ setPage }) => {
  return (
    <PageWrapper>
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100"></div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-md text-zinc-300 text-sm font-medium mb-8 animate-slideUp opacity-0">
                    <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                    <span className="bg-gradient-to-r from-red-400 to-orange-400 text-transparent bg-clip-text font-bold">New</span>
                    <span className="mx-2 text-zinc-600">|</span>
                    Live Experts Available Now
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-8 leading-[1.1] animate-slideUp opacity-0 animation-delay-200">
                    Expertise <span className="text-zinc-500 font-serif italic">on</span> Demand.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-shimmer bg-[length:200%_auto]">
                        Billed by the Minute.
                    </span>
                </h1>
                
                <p className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto mb-12 animate-slideUp opacity-0 animation-delay-400 leading-relaxed">
                    Access top-tier industry leaders, specialized consultants, and enterprise firms instantly. No retainers, just results.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp opacity-0 animation-delay-600">
                    <Button onClick={() => setPage('browse')} className="h-14 px-8 text-lg rounded-full shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-red-500/50 transition-all duration-300">
                        Find an Expert <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <button 
                        onClick={() => setPage('signup')} 
                        className="h-14 px-8 text-lg rounded-full bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/80 text-white backdrop-blur-md transition-all duration-300 flex items-center justify-center font-semibold"
                    >
                        Become an Expert
                    </button>
                </div>

                {/* Floating Elements (Decorative) */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 hidden xl:block animate-float opacity-80">
                    <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 p-4 rounded-2xl shadow-2xl max-w-xs transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Zap className="text-white h-5 w-5" />
                            </div>
                            <div>
                                <div className="h-2 w-20 bg-zinc-700 rounded mb-1"></div>
                                <div className="h-2 w-12 bg-zinc-800 rounded"></div>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded"></div>
                    </div>
                </div>

                <div className="absolute top-1/3 right-0 translate-x-12 hidden xl:block animate-float animation-delay-2000 opacity-80">
                     <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 p-4 rounded-2xl shadow-2xl max-w-xs transform rotate-[6deg] hover:rotate-0 transition-transform duration-500">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <DollarSign className="text-white h-5 w-5" />
                            </div>
                             <div>
                                <div className="text-xs text-zinc-400">Saved</div>
                                <div className="text-lg font-bold text-white">$12,450</div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </section>

        {/* Categories */}
        <section className="py-24 bg-zinc-950/50 backdrop-blur-sm border-t border-zinc-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-slideUp opacity-0 animation-delay-200" style={{ animationFillMode: 'both' }}>
                    <h2 className="text-3xl font-bold text-white mb-4">Industry Categories</h2>
                    <p className="text-zinc-400">Explore specialized talent across critical sectors.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[
                        { name: "Legal", icon: ShieldCheck, color: "text-emerald-500", from: "from-emerald-500/20", to: "to-emerald-500/5" },
                        { name: "Tech", icon: Server, color: "text-blue-500", from: "from-blue-500/20", to: "to-blue-500/5" },
                        { name: "Finance", icon: TrendingUp, color: "text-amber-500", from: "from-amber-500/20", to: "to-amber-500/5" },
                        { name: "Health", icon: HeartPulse, color: "text-rose-500", from: "from-rose-500/20", to: "to-rose-500/5" },
                        { name: "Business", icon: Building, color: "text-purple-500", from: "from-purple-500/20", to: "to-purple-500/5" },
                        { name: "Product", icon: Briefcase, color: "text-orange-500", from: "from-orange-500/20", to: "to-orange-500/5" },
                    ].map((cat, i) => (
                        <div 
                            key={i} 
                            onClick={() => setPage('browse')} 
                            className="group cursor-pointer p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-2 text-center relative overflow-hidden"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.from} ${cat.to} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            <div className="relative z-10">
                                <div className={`mx-auto w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                                    <cat.icon size={28} className={cat.color} />
                                </div>
                                <h3 className="font-semibold text-zinc-300 group-hover:text-white transition-colors">{cat.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* How It Works */}
        <section className="py-32 relative overflow-hidden">
             {/* Background glow for this section */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-900/10 filter blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Search & Match", desc: "Use our AI-powered search to find the perfect expert for your specific problem.", icon: Search, delay: 0 },
                        { title: "Secure Pre-auth", desc: "Pre-authorize funds via Stripe/UPI. You are only charged for the exact duration.", icon: DollarSign, delay: 200 },
                        { title: "Instant Connect", desc: "Jump into a secure video/audio call immediately or schedule for later.", icon: Check, delay: 400 },
                    ].map((item, i) => (
                        <div 
                            key={i} 
                            className="relative p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-900/10 group"
                        >
                             <div className="w-12 h-12 bg-zinc-800/80 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-zinc-700">
                                <item.icon size={24} className="text-white" />
                             </div>
                             <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                             <p className="text-zinc-400 leading-relaxed text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </PageWrapper>
  );
};