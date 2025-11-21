import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Loader2, X } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db, appId } from '../services/firebase';
import { matchExpertsWithAI } from '../services/gemini';
import { Expert, PageView } from '../types';
import { ExpertCard } from '../components/ExpertCard';
import { Button, PageWrapper } from '../components/UI';

// Mock data for fallback
const MOCK_EXPERTS: Expert[] = [
    { id: '1', name: "Dr. Evelyn Reed", title: "Senior AI Specialist", company: "DeepMind (Ex)", rateHour: 18000, rateMinute: 300, rating: 4.9, reviews: 132, skills: ["Generative AI", "Python", "TensorFlow", "LLMs"], bio: "I specialize in helping enterprises deploy Large Language Models securely. PhD in Computer Science from Stanford.", type: 'individual', image: "https://picsum.photos/id/64/400/400" },
    { id: '2', name: "Apex Legal Partners", title: "Corporate Litigation Firm", company: "Apex Legal", rateHour: 25000, rateMinute: 420, rating: 4.9, reviews: 78, skills: ["Mergers", "IP Law", "Corporate Governance"], bio: "A full-service law firm specializing in high-stakes corporate litigation and cross-border mergers.", type: 'enterprise', image: "https://picsum.photos/id/48/400/400" },
    { id: '3', name: "Marcus Cole", title: "VP of Product", company: "SaaSify", rateHour: 15000, rateMinute: 250, rating: 4.8, reviews: 98, skills: ["Product Strategy", "Agile", "Growth"], bio: "Scaled 3 B2B SaaS products from $0 to $10M ARR. Expert in product-market fit analysis.", type: 'individual', image: "https://picsum.photos/id/91/400/400" },
    { id: '4', name: "CloudScale DevOps", title: "Infrastructure Consultants", company: "CloudScale", rateHour: 20000, rateMinute: 340, rating: 4.8, reviews: 64, skills: ["AWS", "Kubernetes", "Terraform", "Security"], bio: "We optimize cloud spend and build resilient infrastructure for high-traffic applications.", type: 'enterprise', image: "https://picsum.photos/id/60/400/400" },
    { id: '5', name: "Sarah Jenkins", title: "CMO Fractional", company: "Freelance", rateHour: 12000, rateMinute: 200, rating: 4.7, reviews: 45, skills: ["Marketing", "Brand Strategy", "SEO"], bio: "Helping startups find their voice. Former CMO at TechStar.", type: 'individual', image: "https://picsum.photos/id/65/400/400" },
    { id: '6', name: "CodeCraft Agency", title: "Full Stack Development", company: "CodeCraft", rateHour: 9000, rateMinute: 150, rating: 4.6, reviews: 112, skills: ["React", "Node.js", "Mobile Apps"], bio: "Rapid prototyping and MVP development for early stage startups.", type: 'enterprise', image: "https://picsum.photos/id/20/400/400" }
];

interface BrowseProps {
  setPage: (page: PageView) => void;
  setSelectedProfile: (expert: Expert) => void;
}

export const BrowsePage: React.FC<BrowseProps> = ({ setPage, setSelectedProfile }) => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // AI State
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMatches, setAiMatches] = useState<string[]>([]);
  const [aiReasoning, setAiReasoning] = useState('');

  // Load experts
  useEffect(() => {
    const fetchExperts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, `artifacts/${appId}/public/data/experts`));
            const fetched: Expert[] = [];
            querySnapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() } as Expert));
            
            if (fetched.length > 0) setExperts(fetched);
            else setExperts(MOCK_EXPERTS);
        } catch (err) {
            console.log("Using mock data");
            setExperts(MOCK_EXPERTS);
        } finally {
            setLoading(false);
        }
    };
    fetchExperts();
  }, []);

  // Handle AI Search
  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    
    setAiLoading(true);
    setAiMatches([]);
    setAiReasoning('');
    
    const result = await matchExpertsWithAI(aiQuery, experts);
    
    setAiMatches(result.matchedExpertIds);
    setAiReasoning(result.reasoning);
    setAiLoading(false);
  };

  // Filter Logic
  const displayedExperts = isAiMode && aiMatches.length > 0
    ? experts.filter(e => aiMatches.includes(e.id))
    : experts.filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-zinc-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12">
             <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                   Find Your Expert
                </span>
             </h1>
             <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                Connect with world-class professionals for instant, high-impact advice.
             </p>
          </div>

          {/* Search Toggle */}
          <div className="flex justify-center mb-8">
             <div className="bg-zinc-800 p-1 rounded-lg inline-flex border border-zinc-700">
                <button 
                    onClick={() => { setIsAiMode(false); setAiMatches([]); }}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${!isAiMode ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
                >
                    <Search size={16} className="inline mr-2 -mt-0.5" /> Keyword Search
                </button>
                <button 
                    onClick={() => { setIsAiMode(true); setSearchTerm(''); }}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${isAiMode ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
                >
                    <Sparkles size={16} className="inline mr-2 -mt-0.5" /> AI Matchmaker
                </button>
             </div>
          </div>

          {/* Search Bars */}
          <div className="max-w-3xl mx-auto mb-12">
             {isAiMode ? (
                 <div className="animate-fadeIn bg-zinc-800/50 border border-amber-500/30 p-6 rounded-2xl backdrop-blur-sm">
                    <form onSubmit={handleAiSearch} className="relative">
                        <textarea 
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="Describe your problem... (e.g., 'I need a lawyer for a Series A term sheet review' or 'I need to optimize my AWS RDS costs')"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 pr-12 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent h-32 resize-none"
                        />
                        <div className="absolute bottom-3 right-3">
                             <Button 
                                type="submit" 
                                disabled={aiLoading}
                                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 flex items-center"
                             >
                                {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                                <span className="ml-2">Match</span>
                             </Button>
                        </div>
                    </form>
                    {aiReasoning && (
                        <div className="mt-4 p-4 bg-amber-900/20 rounded-lg border border-amber-500/20 text-amber-100 text-sm flex gap-3 animate-slideUp">
                             <div className="bg-amber-500/20 p-2 rounded-full h-fit"><Sparkles size={16} className="text-amber-400"/></div>
                             <div>
                                <span className="font-bold block text-amber-400 mb-1">AI Analysis</span>
                                {aiReasoning}
                             </div>
                        </div>
                    )}
                 </div>
             ) : (
                <div className="relative animate-fadeIn">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, company, or skill..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-full py-4 pl-12 pr-4 text-lg text-white focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-zinc-500 shadow-lg"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white">
                            <X size={20} />
                        </button>
                    )}
                </div>
             )}
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-red-500 animate-spin" /></div>
          ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedExperts.map(expert => (
                        <ExpertCard 
                            key={expert.id} 
                            expert={expert} 
                            onSelect={() => { setSelectedProfile(expert); setPage('profile'); }} 
                            matchReason={isAiMode ? "Recommended based on your query." : undefined}
                        />
                    ))}
                </div>
                {displayedExperts.length === 0 && (
                    <div className="text-center py-20 text-zinc-500">
                        <p className="text-xl font-medium">No experts found.</p>
                        <p className="mt-2">Try adjusting your search or using the AI Matchmaker.</p>
                    </div>
                )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
