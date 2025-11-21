
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { Navbar } from './components/Navigation';
import { HomePage } from './pages/Home';
import { BrowsePage } from './pages/Browse';
import { ProfilePage } from './pages/Profile';
import { AuthPage } from './pages/Auth';
import { MyProfilePage } from './pages/MyProfile';
import { PageView, Expert, UserProfile } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState<PageView>('home');
  const [selectedProfile, setSelectedProfile] = useState<Expert | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let unsubscribeDoc: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        
        // Check if user doc exists, if not create it (covers legacy users or failed signups)
        try {
            const docSnap = await getDoc(userRef);
            if (!docSnap.exists()) {
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
        } catch (e) {
            console.error("Error checking user doc:", e);
        }

        // Listen to real-time updates from Firestore
        unsubscribeDoc = onSnapshot(userRef, (doc) => {
            const data = doc.data();
            // Merge auth data with firestore data
            setCurrentUser({
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: data?.displayName || user.displayName,
                photoURL: data?.photoURL || user.photoURL,
                bio: data?.bio,
                phoneNumber: data?.phoneNumber
            });
        });
      } else {
        setCurrentUser(null);
        if (unsubscribeDoc) unsubscribeDoc();
      }
      setIsAuthReady(true);
    });

    return () => {
        unsubscribeAuth();
        if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  // Navigation handler
  const handleSetPage = (newPage: PageView) => {
    window.scrollTo(0, 0);
    setPage(newPage);
  };

  // Auth Guard
  useEffect(() => {
    if (isAuthReady && !currentUser && (page === 'my-profile')) {
        handleSetPage('login');
    }
  }, [page, currentUser, isAuthReady]);


  if (!isAuthReady) {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
        </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage setPage={handleSetPage} />;
      case 'browse':
        return <BrowsePage setPage={handleSetPage} setSelectedProfile={setSelectedProfile} />;
      case 'profile':
        return <ProfilePage profile={selectedProfile} setPage={handleSetPage} />;
      case 'login':
        return <AuthPage setPage={handleSetPage} initialMode="login" />;
      case 'signup':
        return <AuthPage setPage={handleSetPage} initialMode="signup" />;
      case 'my-profile':
        if (!currentUser) return <AuthPage setPage={handleSetPage} initialMode="login" />;
        return <MyProfilePage user={currentUser} setPage={handleSetPage} />;
      default:
        return <HomePage setPage={handleSetPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500/30">
      <Navbar 
        setPage={handleSetPage} 
        currentUser={currentUser} 
        onLogout={() => auth.signOut()} 
        currentPage={page}
      />
      <main>{renderPage()}</main>
      
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-2xl font-bold text-white mb-4 tracking-tighter">ProConnect</p>
            <div className="flex justify-center space-x-6 mb-8 text-zinc-500 text-sm">
                <a href="#" className="hover:text-white">Terms</a>
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Enterprise</a>
                <a href="#" className="hover:text-white">Support</a>
            </div>
            <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} ProConnect Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
