
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
import { DashboardPage } from './pages/Dashboard';
import { PageView, Expert, UserProfile } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState<PageView>('home');
  const [selectedProfile, setSelectedProfile] = useState<Expert | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let unsubscribeDoc: () => void;
    let unsubscribeAuth: () => void;

    // Timeout fallback: if Firebase auth doesn't respond within 5s, proceed anyway
    const authTimeout = setTimeout(() => {
      console.warn("Firebase auth timeout - proceeding without auth");
      setIsAuthReady(true);
    }, 5000);

    try {
      if (!auth) {
        throw new Error("Firebase auth not initialized");
      }
      
      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        clearTimeout(authTimeout);
        if (user) {
          const userRef = doc(db, "users", user.uid);
          
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

          unsubscribeDoc = onSnapshot(userRef, (doc) => {
              const data = doc.data();
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
    } catch (e) {
      console.error("Firebase auth setup failed:", e);
      clearTimeout(authTimeout);
      setIsAuthReady(true);
    }

    return () => {
        clearTimeout(authTimeout);
        if (unsubscribeAuth) unsubscribeAuth();
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
    if (isAuthReady && !currentUser && (page === 'my-profile' || page === 'dashboard')) {
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

  const isAuthPage = page === 'login' || page === 'signup';

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage setPage={handleSetPage} />;
      case 'browse':
        return <BrowsePage setPage={handleSetPage} setSelectedProfile={setSelectedProfile} />;
      case 'profile':
        return <ProfilePage profile={selectedProfile} setPage={handleSetPage} />;
      case 'login':
        return <AuthPage key="login" setPage={handleSetPage} initialMode="login" />;
      case 'signup':
        return <AuthPage key="signup" setPage={handleSetPage} initialMode="signup" />;
      case 'my-profile':
        if (!currentUser) return <AuthPage key="login-guard" setPage={handleSetPage} initialMode="login" />;
        return <MyProfilePage user={currentUser} setPage={handleSetPage} />;
      case 'dashboard':
        if (!currentUser) return <AuthPage key="login-guard" setPage={handleSetPage} initialMode="login" />;
        return <DashboardPage user={currentUser} setPage={handleSetPage} />;
      default:
        return <HomePage setPage={handleSetPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500/30">
      {!isAuthPage && (
        <Navbar 
          setPage={handleSetPage} 
          currentUser={currentUser} 
          onLogout={() => auth.signOut()} 
          currentPage={page}
        />
      )}
      <main>{renderPage()}</main>
    </div>
  );
}
