import React from 'react';
import { ArrowLeft, MapPin, Linkedin, MessageSquare, Star, Clock, CheckCircle, Building } from 'lucide-react';
import { Expert, PageView } from '../types';
import { Button, PageWrapper, Badge } from '../components/UI';

interface ProfilePageProps {
  profile: Expert | null;
  setPage: (page: PageView) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile, setPage }) => {
  if (!profile) return null;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-zinc-950 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <button 
            onClick={() => setPage('browse')}
            className="flex items-center text-zinc-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Browse
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Sidebar - Key Info */}
            <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                    <img 
                        src={profile.image} 
                        alt={profile.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-zinc-800 shadow-lg mx-auto mb-6" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/400'; }}
                    />
                    <h1 className="text-2xl font-bold text-white text-center mb-1">{profile.name}</h1>
                    <p className="text-red-400 text-center font-medium mb-6">{profile.title}</p>
                    
                    <div className="space-y-4 border-t border-zinc-800 pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Rate</span>
                            <span className="text-white font-bold">₹{profile.rateHour}/hr</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Min. Session</span>
                            <span className="text-white font-bold">15 mins</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Response Time</span>
                            <span className="text-green-400 font-bold text-xs bg-green-900/20 px-2 py-1 rounded">~2 hrs</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <Button className="w-full">Request Consultation</Button>
                        <Button variant="secondary" className="w-full">Send Message</Button>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Rating</h3>
                        <div className="flex items-center text-amber-400">
                            <Star fill="currentColor" size={16} />
                            <span className="ml-1 font-bold text-white">{profile.rating}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-zinc-800/50 p-3 rounded-lg">
                            <p className="text-zinc-300 text-sm italic">"Incredible insight. Solved our deployment issue in 20 mins."</p>
                            <p className="text-zinc-500 text-xs mt-2 text-right">- Tech Lead, FinCorp</p>
                        </div>
                        <div className="bg-zinc-800/50 p-3 rounded-lg">
                            <p className="text-zinc-300 text-sm italic">"Worth every penny. Very direct and actionable advice."</p>
                            <p className="text-zinc-500 text-xs mt-2 text-right">- Founder, Stealth</p>
                        </div>
                    </div>
                    <button className="w-full mt-4 text-sm text-zinc-500 hover:text-white transition-colors">View all {profile.reviews} reviews</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Bio */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        About {profile.type === 'enterprise' ? 'the Firm' : 'Me'}
                    </h2>
                    <p className="text-zinc-300 leading-relaxed text-lg">
                        {profile.bio}
                    </p>
                    
                    <div className="mt-8">
                         <h3 className="text-white font-semibold mb-4">Expertise & Skills</h3>
                         <div className="flex flex-wrap gap-2">
                            {profile.skills.map(skill => (
                                <Badge key={skill} color="zinc">{skill}</Badge>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Availability (Mock) */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <Clock className="mr-2 text-red-500" size={20} /> Availability
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                            <div key={day} className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 hover:border-red-500/50 cursor-pointer transition-colors">
                                <div className="text-zinc-400 text-xs mb-1">{day}</div>
                                <div className="text-white font-bold text-sm">10am - 4pm</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Credentials */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                         <CheckCircle className="mr-2 text-red-500" size={20} /> Verified Credentials
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="mt-1 bg-green-900/30 p-1 rounded text-green-400 mr-3">
                                <Linkedin size={16} />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Identity Verified</h4>
                                <p className="text-zinc-500 text-sm">LinkedIn and Government ID checked.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                             <div className="mt-1 bg-blue-900/30 p-1 rounded text-blue-400 mr-3">
                                <Building size={16} />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Current Employment Verified</h4>
                                <p className="text-zinc-500 text-sm">Verified via work email at {profile.company}.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};