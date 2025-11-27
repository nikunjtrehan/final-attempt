import React from 'react';
import { Star, Building, User, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Expert } from '../types';

interface ExpertCardProps {
  expert: Expert;
  onSelect: (expert: Expert) => void;
  matchReason?: string;
  delay?: number;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onSelect, matchReason, delay = 0 }) => {
  return (
    <div 
      onClick={() => onSelect(expert)} 
      style={{ animationDelay: `${delay}ms` }}
      className={`
        group relative bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden 
        transition-all duration-500 ease-out hover:scale-[1.02] hover:border-zinc-600 hover:shadow-2xl hover:shadow-red-900/10 cursor-pointer
        animate-slideUp opacity-0 flex flex-col
        ${matchReason ? 'ring-1 ring-amber-500/50' : ''}
      `}
    >
      {/* Image Header */}
      <div className="relative h-56 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10 opacity-80" />
        <img 
          src={expert.image} 
          alt={expert.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300'; }}
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
           {expert.type === 'individual' ? <User size={12} className="text-blue-400" /> : <Building size={12} className="text-purple-400" />}
           <span className="text-xs font-semibold text-white uppercase tracking-wider">{expert.type}</span>
        </div>

        {/* Rate Badge */}
        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 shadow-lg">
           ₹{expert.rateHour.toLocaleString()}/hr
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-20 -mt-10 flex-grow flex flex-col">
        {/* AI Reasoning Bubble */}
        {matchReason && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg backdrop-blur-md">
                <div className="flex items-start gap-2">
                    <Sparkles size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-100 leading-relaxed font-medium">{matchReason}</p>
                </div>
            </div>
        )}

        <div className="bg-zinc-800/80 border border-zinc-700/50 p-5 rounded-xl backdrop-blur-md shadow-lg flex-grow">
            <h3 className="text-xl font-bold text-white truncate group-hover:text-red-400 transition-colors">{expert.name}</h3>
            <p className="text-sm text-red-400 font-medium mb-2">{expert.title}</p>
            <p className="text-xs text-zinc-500 flex items-center mb-4">
                <Building size={12} className="mr-1.5" /> {expert.company}
            </p>

            <div className="flex items-center justify-between border-t border-zinc-700/50 pt-3 mt-auto">
                <div className="flex items-center text-zinc-300">
                    <Star size={14} className="text-amber-400 fill-current" />
                    <span className="ml-1.5 font-semibold text-sm">{expert.rating}</span>
                    <span className="ml-1 text-xs text-zinc-500">({expert.reviews})</span>
                </div>
                <div className="text-xs text-zinc-400 flex items-center bg-zinc-900/50 px-2 py-1 rounded">
                    <Clock size={12} className="mr-1" /> ₹{expert.rateMinute}/min
                </div>
            </div>
        </div>

        {/* Skills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
            {expert.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-2.5 py-1 bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 rounded-md text-[10px] font-semibold uppercase tracking-wide">
                    {skill}
                </span>
            ))}
             {expert.skills.length > 3 && (
                <span className="px-2.5 py-1 bg-zinc-800/50 text-zinc-500 border border-zinc-700/50 rounded-md text-[10px] font-semibold">
                    +{expert.skills.length - 3}
                </span>
            )}
        </div>
        
        <div className="mt-6 flex justify-end">
             <div className="text-red-500 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform duration-300">
                View Profile <ArrowRight size={16} className="ml-1" />
             </div>
        </div>
      </div>
    </div>
  );
};