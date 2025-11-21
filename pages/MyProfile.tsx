
import React, { useState, useEffect } from 'react';
import { UserProfile, PageView } from '../types';
import { PageWrapper, Button, Badge, Input } from '../components/UI';
import { Calendar, Clock, Video, Settings, LogOut, CreditCard, User, Smartphone, Plus, Trash2, Lock, AlertTriangle, Save, CheckCircle } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { updateProfile, deleteUser } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface MyProfileProps {
  user: UserProfile;
  setPage: (page: PageView) => void;
}

// Types
interface PaymentMethod {
  id: string;
  type: 'card' | 'upi';
  title: string;
  subtitle: string;
  isDefault: boolean;
  brand?: 'visa' | 'mastercard';
}

// Mock Data
const UPCOMING_SESSIONS = [
  { id: 1, expert: "Dr. Evelyn Reed", date: "Today, 4:00 PM", duration: "30 min", topic: "AI Implementation Strategy", status: "Confirmed" }
];

const PAST_SESSIONS = [
  { id: 101, expert: "Apex Legal Partners", date: "Oct 12, 2023", duration: "45 min", cost: "₹18,750", topic: "IP Dispute Review" },
  { id: 102, expert: "Sarah Jenkins", date: "Sep 28, 2023", duration: "15 min", cost: "₹3,000", topic: "Brand Audit" }
];

const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', type: 'card', title: 'Visa ending in 4242', subtitle: 'Expires 12/25', isDefault: true, brand: 'visa' },
  { id: '2', type: 'upi', title: 'user@oksbi', subtitle: 'Verified', isDefault: false }
];

export const MyProfilePage: React.FC<MyProfileProps> = ({ user, setPage }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'billing' | 'settings'>('dashboard');
  
  // Billing State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [addMethodType, setAddMethodType] = useState<'card' | 'upi'>('card');
  
  // Settings State
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    phoneNumber: user.phoneNumber || '',
    bio: user.bio || ''
  });
  const [statusMsg, setStatusMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Sync user data to form when user prop updates
  useEffect(() => {
    setFormData({
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || ''
    });
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    setPage('home');
  };

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
  };

  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd process Stripe/Payment gateway here
    const newMethod: PaymentMethod = addMethodType === 'card' 
        ? { id: Date.now().toString(), type: 'card', title: 'Mastercard ending 8888', subtitle: 'Expires 10/28', isDefault: false, brand: 'mastercard' }
        : { id: Date.now().toString(), type: 'upi', title: 'new@upi', subtitle: 'Verified', isDefault: false };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setIsAddingMethod(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    try {
        if (auth.currentUser) {
            // Update Auth Profile (DisplayName, PhotoURL)
            await updateProfile(auth.currentUser, {
                displayName: formData.displayName,
                photoURL: formData.photoURL
            });

            // Update Firestore Document
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: formData.displayName,
                photoURL: formData.photoURL,
                phoneNumber: formData.phoneNumber,
                bio: formData.bio
            });
            
            setStatusMsg({ type: 'success', text: 'Profile updated successfully.' });
        }
    } catch (error) {
        console.error(error);
        setStatusMsg({ type: 'error', text: 'Failed to update profile.' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
      if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
          try {
              if (auth.currentUser) {
                  // Delete Firestore data first
                  await deleteDoc(doc(db, "users", user.uid));
                  // Delete Auth user
                  await deleteUser(auth.currentUser);
                  setPage('home');
              }
          } catch (error) {
              console.error("Error deleting account:", error);
              alert("Failed to delete account. You may need to re-login first for security reasons.");
          }
      }
  };

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800 shadow-xl" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center border-4 border-zinc-700">
                            <User size={32} className="text-zinc-500" />
                        </div>
                    )}
                    <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-zinc-900"></div>
                </div>
                <h2 className="text-xl font-bold text-white truncate w-full">{user.displayName || 'User'}</h2>
                <p className="text-zinc-500 text-sm truncate w-full">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <NavItem id="dashboard" label="Dashboard" icon={Calendar} />
                <NavItem id="billing" label="Billing Methods" icon={CreditCard} />
                <NavItem id="settings" label="Settings" icon={Settings} />
              </nav>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/10 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                
                {/* DASHBOARD TAB */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Upcoming */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <Video className="mr-2 text-red-500" size={20} /> Upcoming Consultations
                            </h3>
                            {UPCOMING_SESSIONS.length > 0 ? (
                                <div className="space-y-4">
                                    {UPCOMING_SESSIONS.map(session => (
                                        <div key={session.id} className="bg-zinc-800/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between border border-zinc-700/50">
                                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                                <div className="bg-zinc-700 p-3 rounded-lg">
                                                    <Calendar className="text-zinc-300" size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{session.expert}</h4>
                                                    <p className="text-zinc-400 text-sm">{session.topic}</p>
                                                    <div className="flex items-center text-xs text-zinc-500 mt-1">
                                                        <span className="mr-3">{session.date}</span>
                                                        <span>{session.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className="w-full sm:w-auto">Join Meeting</Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-500 text-sm">No upcoming sessions scheduled.</p>
                            )}
                        </div>

                        {/* Past */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <Clock className="mr-2 text-zinc-500" size={20} /> Past Sessions
                            </h3>
                            <div className="space-y-4">
                                {PAST_SESSIONS.map(session => (
                                    <div key={session.id} className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <h4 className="font-medium text-zinc-200">{session.expert}</h4>
                                            <p className="text-xs text-zinc-500">{session.date} • {session.duration}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-white">{session.cost}</div>
                                            <Badge>Completed</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* BILLING TAB */}
                {activeTab === 'billing' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Payment Methods</h2>
                                    <p className="text-zinc-400">Manage your payment details securely.</p>
                                </div>
                                {!isAddingMethod && (
                                    <Button variant="secondary" onClick={() => setIsAddingMethod(true)}>
                                        <Plus size={18} className="mr-2" /> Add Method
                                    </Button>
                                )}
                            </div>

                            {isAddingMethod ? (
                                <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 animate-slideUp">
                                    <div className="flex space-x-4 mb-6 border-b border-zinc-700 pb-2">
                                        <button 
                                            onClick={() => setAddMethodType('card')}
                                            className={`pb-2 px-1 text-sm font-medium transition-colors ${addMethodType === 'card' ? 'text-white border-b-2 border-red-500' : 'text-zinc-400 hover:text-white'}`}
                                        >
                                            Credit/Debit Card
                                        </button>
                                        <button 
                                            onClick={() => setAddMethodType('upi')}
                                            className={`pb-2 px-1 text-sm font-medium transition-colors ${addMethodType === 'upi' ? 'text-white border-b-2 border-red-500' : 'text-zinc-400 hover:text-white'}`}
                                        >
                                            UPI
                                        </button>
                                    </div>

                                    <form onSubmit={handleAddMethod} className="space-y-4">
                                        {addMethodType === 'card' ? (
                                            <>
                                                <Input placeholder="Card Number" required />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Input placeholder="MM/YY" required />
                                                    <Input placeholder="CVC" required />
                                                </div>
                                                <Input placeholder="Cardholder Name" required />
                                            </>
                                        ) : (
                                            <Input placeholder="Enter UPI ID (e.g. name@oksbi)" required />
                                        )}

                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex items-center text-zinc-500 text-xs">
                                                <Lock size={12} className="mr-1" /> Secured by SSL encryption
                                            </div>
                                            <div className="flex space-x-3">
                                                <Button type="button" variant="secondary" onClick={() => setIsAddingMethod(false)}>Cancel</Button>
                                                <Button type="submit">Save Method</Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {paymentMethods.map(method => (
                                        <div key={method.id} className="bg-zinc-800 rounded-xl p-4 flex items-center justify-between border border-zinc-700 group">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-zinc-700 p-3 rounded-lg text-zinc-300">
                                                    {method.type === 'card' ? <CreditCard size={24} /> : <Smartphone size={24} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-white">{method.title}</h4>
                                                        {method.isDefault && <Badge color="blue">Default</Badge>}
                                                    </div>
                                                    <p className="text-zinc-400 text-sm">{method.subtitle}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteMethod(method.id)}
                                                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                            
                            {statusMsg && (
                                <div className={`p-4 rounded-lg mb-6 flex items-center ${statusMsg.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-red-900/20 text-red-400 border border-red-900/50'}`}>
                                    {statusMsg.type === 'success' ? <CheckCircle size={18} className="mr-2" /> : <AlertTriangle size={18} className="mr-2" />}
                                    {statusMsg.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="flex items-center space-x-6 mb-8">
                                    <img 
                                        src={formData.photoURL || 'https://via.placeholder.com/150'} 
                                        alt="Preview" 
                                        className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700"
                                    />
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Profile Photo URL</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={formData.photoURL}
                                                onChange={e => setFormData({...formData, photoURL: e.target.value})}
                                                placeholder="https://..."
                                                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input 
                                        label="Display Name" 
                                        value={formData.displayName} 
                                        onChange={e => setFormData({...formData, displayName: e.target.value})}
                                    />
                                    <Input 
                                        label="Phone Number" 
                                        value={formData.phoneNumber} 
                                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2 ml-1">Bio</label>
                                    <textarea 
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
                                        value={formData.bio}
                                        onChange={e => setFormData({...formData, bio: e.target.value})}
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div className="pt-4 border-t border-zinc-800 flex justify-end">
                                    <Button type="submit" isLoading={isLoading}>
                                        <Save size={18} className="mr-2" /> Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-8">
                            <h3 className="text-red-500 font-bold text-lg mb-2 flex items-center">
                                <AlertTriangle size={20} className="mr-2" /> Danger Zone
                            </h3>
                            <p className="text-zinc-400 text-sm mb-6">
                                Deleting your account is permanent. All your data, history, and access will be removed immediately.
                            </p>
                            <Button variant="danger" onClick={handleDeleteAccount}>
                                Delete Account
                            </Button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
