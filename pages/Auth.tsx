
import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Button, Input, PageWrapper } from '../components/UI';
import { PageView } from '../types';
import { Loader2, AlertCircle, Mail } from 'lucide-react';

interface AuthPageProps {
  setPage: (page: PageView) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ setPage, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Auth Profile
        await updateProfile(user, { displayName: name });
        
        // Create Firestore Document
        // We set initial empty values for bio and phoneNumber
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
        await signOut(auth); // Force sign out to require login after verification
        setVerificationSent(true);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
             await signOut(auth);
             setError('Please verify your email before logging in.');
             setVerificationSent(true); 
        } else {
            setPage('browse');
        }
      }
    } catch (err: any) {
      console.error(err);
      let msg = "Authentication failed.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already in use.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
      return (
        <PageWrapper>
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800 text-center">
                     <div className="mx-auto w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                        <Mail className="w-8 h-8 text-green-500" />
                     </div>
                     <h2 className="text-2xl font-bold text-white mb-4">Verify your email</h2>
                     <p className="text-zinc-400 mb-8">
                        We've sent a verification link to <span className="text-white font-semibold">{email}</span>. Please check your inbox.
                     </p>
                     <Button onClick={() => { setVerificationSent(false); setMode('login'); }} className="w-full">
                        Return to Login
                     </Button>
                </div>
            </div>
        </PageWrapper>
      )
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              {mode === 'login' ? 'Sign in to access your dashboard' : 'Join the network of top-tier professionals'}
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <Input 
                    id="name" 
                    label="Full Name" 
                    placeholder="John Doe" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                />
              )}
              <Input 
                id="email" 
                type="email" 
                label="Email Address" 
                placeholder="you@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
              <Input 
                id="password" 
                type="password" 
                label="Password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />

              {error && (
                <div className="flex items-center p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    {error}
                </div>
              )}

              <Button type="submit" className="w-full py-3.5" isLoading={isLoading}>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-400">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                    className="font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                    {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
