import React from 'react';
import { Star, Building, User, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Expert } from '../types';

interface ExpertCardProps {
  expert: Expert;
  onSelect: (expert: Expert) => void;
  matchReason?: string;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onSelect, matchReason }) => {
  return (
    <div 
      onClick={() => onSelect(expert)} 
      className={`
        group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden 
        transition-all duration-300 ease-out hover:border-zinc-600 hover:shadow-2xl hover:-translate-y-1 cursor-pointer
        ${matchReason ? 'ring-2 ring-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : ''}
      `}
    >
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10" />
        <img 
          src={expert.image} 
          alt={expert.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300'; }}
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3 z-20 bg-zinc-950/70 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
           {expert.type === 'individual' ? <User size={12} className="text-blue-400" /> : <Building size={12} className="text-purple-400" />}
           <span className="text-xs font-medium text-white capitalize">{expert.type}</span>
        </div>

        {/* Rate Badge */}
        <div className="absolute top-3 right-3 z-20 bg-zinc-950/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-zinc-700 shadow-lg">
           ₹{expert.rateHour.toLocaleString()}/hr
        </div>
      </div>

      {/* Content */}
      <div className="p-5 relative z-20 -mt-8">
        {/* AI Reasoning Bubble */}
        {matchReason && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg backdrop-blur-md">
                <div className="flex items-start gap-2">
                    <Sparkles size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-100 leading-relaxed font-medium">{matchReason}</p>
                </div>
            </div>
        )}

        <div className="bg-zinc-800/50 border border-zinc-700/50 p-4 rounded-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white truncate group-hover:text-red-400 transition-colors">{expert.name}</h3>
            <p className="text-sm text-red-400 font-medium mb-1">{expert.title}</p>
            <p className="text-xs text-zinc-500 flex items-center mb-3">
                <Building size={12} className="mr-1.5" /> {expert.company}
            </p>

            <div className="flex items-center justify-between border-t border-zinc-700 pt-3 mt-3">
                <div className="flex items-center text-zinc-300">
                    <Star size={14} className="text-amber-400 fill-current" />
                    <span className="ml-1.5 font-semibold text-sm">{expert.rating}</span>
                    <span className="ml-1 text-xs text-zinc-500">({expert.reviews})</span>
                </div>
                <div className="text-xs text-zinc-400 flex items-center">
                    <Clock size={12} className="mr-1" /> ~₹{expert.rateMinute}/min
                </div>
            </div>
        </div>

        {/* Skills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
            {expert.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded text-[10px] font-medium uppercase tracking-wide">
                    {skill}
                </span>
            ))}
             {expert.skills.length > 3 && (
                <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 border border-zinc-700 rounded text-[10px]">
                    +{expert.skills.length - 3}
                </span>
            )}
        </div>
        
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-5 right-5">
             <div className="bg-red-600 text-white p-2 rounded-full shadow-lg">
                <ArrowRight size={16} />
             </div>
        </div>
      </div>
    </div>
  );
};
