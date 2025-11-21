import React from 'react';
import { Zap, User, Menu, X } from 'lucide-react';
import { Button } from './UI';
import { PageView, UserProfile } from '../types';

interface NavbarProps {
  setPage: (page: PageView) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  currentPage: PageView;
}

export const Navbar: React.FC<NavbarProps> = ({ setPage, currentUser, onLogout, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinkClass = (target: PageView) => `
    cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
    ${currentPage === target 
      ? 'text-red-400 bg-red-900/10' 
      : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}
  `;

  return (
    <nav className="fixed w-full z-50 top-0 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => setPage('home')}>
            <div className="bg-red-600/10 p-2 rounded-lg group-hover:bg-red-600/20 transition-colors">
                <Zap className="h-6 w-6 text-red-500" />
            </div>
            <span className="ml-2 text-xl font-bold text-white tracking-tight">ProConnect</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-4">
              <a onClick={() => setPage('home')} className={navLinkClass('home')}>Home</a>
              <a onClick={() => setPage('browse')} className={navLinkClass('browse')}>Browse Experts</a>
            </div>
            
            <div className="flex items-center space-x-4 pl-4 border-l border-zinc-800">
              {currentUser ? (
                <>
                  <button 
                    onClick={() => setPage('my-profile')} 
                    className="flex items-center space-x-2 text-zinc-300 hover:text-red-400 transition-colors"
                  >
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-zinc-700" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                        <User size={16} />
                      </div>
                    )}
                    <span className="text-sm font-medium hidden lg:block">{currentUser.displayName || 'User'}</span>
                  </button>
                  <Button variant="outline" className="px-4 py-1.5 text-xs h-8" onClick={onLogout}>Log Out</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="px-4 py-2 text-xs" onClick={() => setPage('login')}>Log In</Button>
                  <Button variant="primary" className="px-4 py-2 text-xs" onClick={() => setPage('signup')}>Sign Up</Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-400 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a onClick={() => { setPage('home'); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-zinc-800">Home</a>
            <a onClick={() => { setPage('browse'); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800">Browse Experts</a>
            {currentUser ? (
               <>
                <a onClick={() => { setPage('my-profile'); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800">My Profile</a>
                <a onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-zinc-800">Log Out</a>
               </>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-4 px-3">
                 <Button variant="outline" onClick={() => { setPage('login'); setIsMobileMenuOpen(false); }}>Log In</Button>
                 <Button variant="primary" onClick={() => { setPage('signup'); setIsMobileMenuOpen(false); }}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
