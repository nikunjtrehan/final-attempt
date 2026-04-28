import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, User, ArrowRightLeft, Clock, ChevronLeft, ChevronRight, Loader2, Globe, MapPin } from 'lucide-react';
import { PageView, UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
  setPage: (page: PageView) => void;
}

// ─── Calendar Widget ────────────────────────────────────────────────────
const CALENDARIFIC_KEY = 'RxOP54MZFZmw6MLUpLLFU1uh0gV6KwMV';
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

interface Holiday { name: string; date: { iso: string }; description: string; type: string[] }

function CalendarWidget() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://calendarific.com/api/v2/holidays?api_key=${CALENDARIFIC_KEY}&country=US&year=${year}&month=${month + 1}`)
      .then(r => r.json())
      .then(data => { setHolidays(data?.response?.holidays || []); })
      .catch(() => setHolidays([]))
      .finally(() => setLoading(false));
  }, [year, month]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const holidayDates = new Set(holidays.map(h => new Date(h.date.iso).getDate()));

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div className="border border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-medium text-zinc-300 min-w-[130px] text-center">{MONTHS[month]} {year}</span>
          <button onClick={next} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => <div key={d} className="text-center text-xs font-medium text-zinc-500 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const isHoliday = holidayDates.has(day);
          return (
            <div key={day} className={`text-center py-1.5 text-sm rounded-lg transition-colors cursor-default
              ${isToday ? 'bg-red-500 text-white font-bold' : isHoliday ? 'bg-blue-500/20 text-blue-300 font-medium' : 'text-zinc-400 hover:bg-white/5'}`}
            >{day}</div>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-zinc-500 animate-spin" /></div>
      ) : holidays.length > 0 ? (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-2 max-h-[140px] overflow-y-auto scrollbar-hide">
          {holidays.slice(0, 5).map((h, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-zinc-200 truncate">{h.name}</p>
                <p className="text-xs text-zinc-500">{new Date(h.date.iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ─── Currency Converter Widget ──────────────────────────────────────────
// Using frankfurter.app — free, HTTPS, no API key required
const CURRENCIES = ['USD','EUR','GBP','INR','JPY','CAD','AUD','CNY','CHF','SGD'];

function CurrencyWidget() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [amount, setAmount] = useState('1');
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRate = (fromCur: string, toCur: string) => {
    if (fromCur === toCur) { setRate(1); return; }
    setLoading(true);
    setError('');
    fetch(`https://api.frankfurter.app/latest?from=${fromCur}&to=${toCur}`)
      .then(r => r.json())
      .then(data => {
        if (data.rates && data.rates[toCur] !== undefined) {
          setRate(data.rates[toCur]);
        } else {
          setError('Rate unavailable for this pair');
        }
      })
      .catch(() => setError('Network error — please try again'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRate(from, to); }, [from, to]);


  return (
    <div className="border border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Currency Exchange</h3>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0"
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">From</label>
            <select value={from} onChange={e => setFrom(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer">
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={() => { setFrom(to); setTo(from); }}
            className="p-2.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white mb-0.5">
            <ArrowRightLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">To</label>
            <select value={to} onChange={e => setTo(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer">
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="bg-white/[0.04] border border-white/5 rounded-xl p-4 text-center">
          {loading ? (
            <Loader2 className="w-5 h-5 text-zinc-500 animate-spin mx-auto" />
          ) : rate ? (
            <>
              <p className="text-2xl font-bold text-white">{(parseFloat(amount || '0') * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-zinc-500 mt-1">1 {from} = {rate.toFixed(4)} {to}</p>
            </>
          ) : (
            <p className="text-sm text-zinc-500">Enter an amount to convert</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ─────────────────────────────────────────────────────
export const DashboardPage: React.FC<DashboardProps> = ({ user, setPage }) => {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const cardAnim = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  });

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div {...cardAnim(0)} className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {greeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">{user.displayName || 'User'}</span>
              </h1>
              <p className="text-zinc-400 mt-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <button onClick={() => setPage('browse')}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-red-500/20 w-fit">
              Browse Experts
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div {...cardAnim(0.1)} className="lg:col-span-1">
            <div className="border border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 shadow-xl h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Your Profile</h3>
              </div>

              <div className="flex flex-col items-center text-center mb-6">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-20 h-20 rounded-full border-2 border-zinc-700 mb-4" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-white mb-4">
                    {(user.displayName || 'U').charAt(0)}
                  </div>
                )}
                <h4 className="text-xl font-semibold text-white">{user.displayName || 'User'}</h4>
                <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
                {user.bio && <p className="text-sm text-zinc-500 mt-3 leading-relaxed">{user.bio}</p>}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Status</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Email verified</span>
                  <span className={user.emailVerified ? 'text-emerald-400' : 'text-amber-400'}>{user.emailVerified ? 'Yes' : 'Pending'}</span>
                </div>
              </div>

              <button onClick={() => setPage('my-profile')}
                className="w-full mt-6 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">
                Edit Profile
              </button>
            </div>
          </motion.div>

          {/* Calendar */}
          <motion.div {...cardAnim(0.2)} className="lg:col-span-2">
            <CalendarWidget />
          </motion.div>

          {/* Billing Info */}
          <motion.div {...cardAnim(0.3)} className="lg:col-span-1">
            <div className="border border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 shadow-xl h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Billing</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/[0.04] border border-white/5 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-white">$0.00</p>
                </div>
                <div className="bg-white/[0.04] border border-white/5 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 mb-1">Sessions</p>
                  <p className="text-xl font-bold text-white">0</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <div>
                    <p className="text-sm text-zinc-300">Total Minutes</p>
                    <p className="text-xs text-zinc-500">0 minutes used</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <Globe className="w-4 h-4 text-zinc-500" />
                  <div>
                    <p className="text-sm text-zinc-300">Payment Method</p>
                    <p className="text-xs text-zinc-500">No card on file</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm font-medium text-amber-400 hover:bg-amber-500/20 transition-colors">
                Add Payment Method
              </button>
            </div>
          </motion.div>

          {/* Currency Converter */}
          <motion.div {...cardAnim(0.4)} className="lg:col-span-2">
            <CurrencyWidget />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
