import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';
import { PageView } from '../types';
import { Loader2, AlertCircle, Mail, Lock, ArrowRight, Zap, CheckCircle2, Shield, Globe, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { SmokeBackground } from '../components/SmokeBackground';

interface AuthPageProps {
  setPage: (page: PageView) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ setPage, initialMode = 'login' }) => {
  // =========================================================================
  // PRESERVED STATE MANAGEMENT & BACKEND LOGIC - DO NOT ALTER THIS SECTION
  // =========================================================================
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length === 0) return 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8 && /\d/.test(pass)) score++;
    if (pass.length >= 10 && /[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);

  const getStrengthConfig = (score: number) => {
    switch (score) {
        case 1: return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
        case 2: return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
        case 3: return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
        default: return { label: 'Too short', color: 'bg-zinc-700', text: 'text-zinc-500' };
    }
  };

  const strengthConfig = getStrengthConfig(strengthScore);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        if (strengthScore === 0) {
            throw new Error("Password is too short (min 6 chars).");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });
        
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          photoURL: user.photoURL || '',
          bio: '',
          phoneNumber: '',
          createdAt: serverTimestamp()
        });

        await sendEmailVerification(user);
        await signOut(auth);
        setVerificationSent(true);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
             await signOut(auth);
             setError('Please verify your email before signing in.');
             setVerificationSent(true); 
        } else {
            setPage('dashboard');
        }
      }
    } catch (err: any) {
      console.error(err);
      let msg = "Authentication failed.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already in use.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
      if (err.message) msg = err.message;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || '',
          bio: '',
          phoneNumber: '',
          createdAt: serverTimestamp()
        });
      }

      setPage('dashboard');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || 'Google sign-in failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  // =========================================================================
  // END PRESERVED BACKEND LOGIC
  // =========================================================================

  const FEATURES = [
    { icon: Clock, text: "Per-minute billing — only pay for the advice you use" },
    { icon: Shield, text: "Verified experts vetted through a rigorous multi-step process" },
    { icon: Globe, text: "Global network of 2,500+ specialists across 20+ industries" },
    { icon: ShieldCheck, text: "End-to-end encrypted sessions with full NDA coverage" },
    { icon: Zap, text: "AI Smart Match connects you with the right expert in seconds" },
  ];

  // ========================= VERIFICATION SENT =========================
  if (verificationSent) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SmokeBackground smokeColor="#10B981" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md bg-white/[0.05] border border-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl text-center"
        >
          <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
            <Mail className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Verify your email</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            We've sent a verification link to <br/><span className="text-white font-medium bg-white/5 px-2 py-1 rounded-md mt-2 inline-block">{email}</span>.
          </p>
          <button 
            onClick={() => { setVerificationSent(false); setMode('login'); }} 
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-semibold transition-all"
          >
            Return to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  // ========================= SIGN IN (LOGIN) =========================
  if (mode === 'login') {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="min-h-screen flex flex-col lg:flex-row">

          {/* LEFT PANEL - smoke + marketing */}
          <div className="relative lg:w-[55%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 z-0"><SmokeBackground smokeColor="#6366F1" /></div>
            <div className="absolute inset-0 z-[1] bg-black/30" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer mb-12 lg:mb-16" onClick={() => setPage('home')}>
                <div className="bg-red-600/20 p-2 rounded-lg backdrop-blur-sm border border-red-500/20">
                  <Zap className="h-6 w-6 text-red-500" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">ProConnect</span>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-grow flex flex-col justify-center">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] mb-10 text-white">
                  Expert advice,<br />on your schedule,<br />billed by the minute.
                </h1>
                <p className="text-sm font-medium tracking-[0.15em] uppercase text-zinc-400 mb-6">Join free and get instant access to:</p>
                <div className="space-y-4 mb-12">
                  {FEATURES.map((feature, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <span className="text-[15px] text-zinc-200 leading-snug">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="relative z-10 hidden lg:block">
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-zinc-500 mb-4">Trusted by professionals at</p>
                <div className="flex items-center gap-8 text-zinc-500">
                  {['Google','McKinsey','Deloitte','Stripe','Meta'].map(c => <span key={c} className="text-sm font-bold tracking-tight">{c}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Sign in form */}
          <div className="relative lg:w-[45%] flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-zinc-950">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative z-10 w-full max-w-[400px]">
              <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/20">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">Welcome back</h2>
                <p className="text-sm text-zinc-500 mb-8">Sign in to your ProConnect account</p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg py-3 pl-11 pr-4 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all bg-white"
                        placeholder="you@example.com" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-zinc-700">Password</label>
                      <button type="button" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg py-3 pl-11 pr-4 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all bg-white"
                        placeholder="••••••••" />
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      <AlertCircle size={16} className="mr-2 flex-shrink-0" />{error}
                    </motion.div>
                  )}

                  <button type="submit" disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-zinc-200" />
                  <span className="text-xs text-zinc-400 font-medium uppercase">or</span>
                  <div className="flex-1 h-px bg-zinc-200" />
                </div>

                <button onClick={handleGoogleSignIn} type="button" className="w-full flex items-center gap-3 py-3 px-4 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-medium text-zinc-700">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>

                <div className="mt-8 text-center">
                  <p className="text-sm text-zinc-500">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => { setMode('signup'); setError(''); setPassword(''); }} className="font-semibold text-zinc-900 hover:underline ml-0.5">Get started</button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // ========================= GET STARTED (SIGNUP) =========================
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* LEFT PANEL - smoke + marketing */}
        <div className="relative lg:w-[55%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
          <div className="absolute inset-0 z-0"><SmokeBackground smokeColor="#DC2626" /></div>
          <div className="absolute inset-0 z-[1] bg-black/30" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer mb-12 lg:mb-16" onClick={() => setPage('home')}>
              <div className="bg-red-600/20 p-2 rounded-lg backdrop-blur-sm border border-red-500/20">
                <Zap className="h-6 w-6 text-red-500" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">ProConnect</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-grow flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] mb-10 text-white">
                Expert advice,<br />on your schedule,<br />billed by the minute.
              </h1>
              <p className="text-sm font-medium tracking-[0.15em] uppercase text-zinc-400 mb-6">Join free and get instant access to:</p>
              <div className="space-y-4 mb-12">
                {FEATURES.map((feature, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[15px] text-zinc-200 leading-snug">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="relative z-10 hidden lg:block">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-zinc-500 mb-4">Trusted by professionals at</p>
              <div className="flex items-center gap-8 text-zinc-500">
                {['Google','McKinsey','Deloitte','Stripe','Meta'].map(c => <span key={c} className="text-sm font-bold tracking-tight">{c}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Signup form */}
        <div className="relative lg:w-[45%] flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-zinc-950">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative z-10 w-full max-w-[400px]">
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/20">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">Get started</h2>
              <p className="text-sm text-zinc-500 mb-8">Create your free ProConnect account</p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full border border-zinc-300 rounded-lg py-3 px-4 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all bg-white"
                    placeholder="John Doe" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-zinc-300 rounded-lg py-3 pl-11 pr-4 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all bg-white"
                      placeholder="you@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-zinc-300 rounded-lg py-3 pl-11 pr-4 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all bg-white"
                      placeholder="••••••••" />
                  </div>
                  {password.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-3">
                      <div className="flex space-x-1.5 h-1.5 mb-2">
                        {[1, 2, 3].map((level) => (
                          <div key={level} className={`flex-1 rounded-full transition-all duration-500 ${level <= strengthScore ? strengthConfig.color : 'bg-zinc-200'}`} />
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">{strengthScore < 3 && "Use 10+ chars, numbers & symbols"}</span>
                        <span className={`font-semibold ${strengthConfig.text}`}>{strengthConfig.label}</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed">
                  By continuing, you agree to the{' '}
                  <a href="#" className="underline hover:text-zinc-900">Terms of Service</a> and{' '}
                  <a href="#" className="underline hover:text-zinc-900">Privacy Policy</a>.
                </p>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />{error}
                  </motion.div>
                )}

                <button type="submit" disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-zinc-200" />
                <span className="text-xs text-zinc-400 font-medium uppercase">or</span>
                <div className="flex-1 h-px bg-zinc-200" />
              </div>

              <button onClick={handleGoogleSignIn} type="button" className="w-full flex items-center gap-3 py-3 px-4 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-medium text-zinc-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>

              <div className="mt-8 text-center">
                <p className="text-sm text-zinc-500">
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setMode('login'); setError(''); setPassword(''); }} className="font-semibold text-zinc-900 hover:underline ml-0.5">Sign in</button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

