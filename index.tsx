
import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      get: () => originalFetch,
      set: (val) => {
        console.warn('Something tried to reassign window.fetch, ignoring.');
      },
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    console.error('Could not redefine window.fetch', e);
  }
}

import { 
  Plane, 
  Check, 
  Plus, 
  CreditCard, 
  Users, 
  Sparkles,
  ArrowRight,
  Landmark,
  Shield,
  ShoppingBag,
  Globe,
  MessageCircle,
  X,
  Send,
  Loader2,
  ChevronDown,
  Map as MapIcon,
  AlertCircle,
  Utensils,
  Hotel,
  Car,
  Ticket,
  Home
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai/web";

// --- TYPES ---
interface ServiceTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
  badge?: string;
}

interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
  icon?: string;
}

interface BookingState {
  tierId: string;
  addons: string[];
  landingCity: 'Vilnius' | 'Kaunas';
  studyCity: 'Vilnius' | 'Kaunas';
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Discount {
  id: string;
  category: string;
  partner: string;
  value: string;
  icon: React.ReactNode;
}

// --- CONSTANTS ---
const TIERS: ServiceTier[] = [
  {
    id: 'essential',
    name: 'Essential Arrival',
    price: 45,
    description: 'Perfect for tourists and business travelers. A Bolt driver will be waiting for you.',
    features: [
      'Bolt Driver Waiting at Arrivals',
      'English-Speaking Support',
      'Pre-activated SIM Card',
      'LTG & Transport Discounts',
      '1.5L Bottled Water'
    ]
  },
  {
    id: 'mcwelcome',
    name: 'Welcome Plus',
    price: 75,
    description: 'Full guidance for those staying longer. Arrive well-fed and ready to explore.',
    badge: 'Popular',
    features: [
      'All Essential Features',
      'McDonald\'s McMenu',
      'Digital Bank & Card Guides',
      '20-minute Grocery Stop',
      'Exclusive Food Discounts'
    ]
  },
  {
    id: 'softlanding',
    name: 'Native Integration',
    price: 115,
    description: 'Land Smart. Live Local. from day one. Full support until you leave.',
    features: [
      'All Welcome Plus Features',
      'Bank Setup (Physical Support)',
      'Nationwide Area Coverage',
      'Hotel & Restaurant Discounts',
      'Accommodation Assistance',
      '30-Day Transit Pass included'
    ]
  }
];

const DISCOUNTS: Discount[] = [
  { id: 'd1', category: 'Transport', partner: 'Bolt', value: '20% Off First 5 Rides', icon: <Car size={20} /> },
  { id: 'd2', category: 'Food', partner: 'Local Restaurants', value: '15% Off Total Bill', icon: <Utensils size={20} /> },
  { id: 'd3', category: 'Stay', partner: 'Partner Hotels', value: '10% Cashback', icon: <Hotel size={20} /> },
  { id: 'd4', category: 'Travel', partner: 'LTG Railways', value: 'Student & Group Rates', icon: <Ticket size={20} /> },
  { id: 'd5', category: 'Groceries', partner: 'Maxima', value: 'Double Loyalty Points', icon: <ShoppingBag size={20} /> },
  { id: 'd6', category: 'Food Delivery', partner: 'Wolt', value: '€10 Off First Order', icon: <Utensils size={20} /> },
  { id: 'd7', category: 'Banking', partner: 'Revolut', value: 'Premium Trial', icon: <Landmark size={20} /> },
  { id: 'd8', category: 'Furniture', partner: 'IKEA', value: 'Free Delivery', icon: <Home size={20} /> },
];

const ADDONS: Addon[] = [
  {
    id: 'kaunas-bridge',
    name: 'The Kaunas Bridge',
    price: 70,
    description: 'Intercity transfer covering fuel & highway logistics.',
    icon: 'Map'
  },
  {
    id: 'financial-navigator',
    name: 'Financial Navigator',
    price: 35,
    description: 'Step-by-step help with Revolut, Banks, and Euro cash transfers.',
    icon: 'Landmark'
  },
  {
    id: 'isic-support',
    name: 'ISIC & Library Support',
    price: 25,
    description: 'Personalized guidance for your student ID and university library.',
    icon: 'Shield'
  },
  {
    id: 'ikea-run',
    name: 'IKEA/Furniture Run',
    price: 40,
    description: 'Dedicated trip for bedding, kitchenware, and room essentials.',
    icon: 'ShoppingBag'
  },
  {
    id: 'short-stay',
    name: 'One Night Stay',
    price: 30,
    description: 'Emergency one-night booking at a partner hostel or co-living space.',
    icon: 'Home'
  },
  {
    id: 'medium-stay',
    name: 'One Month Co-living',
    price: 450,
    description: 'Guaranteed one-month stay at Atlas or Shed Co-living (Subject to availability).',
    icon: 'Home'
  },
  {
    id: 'long-term',
    name: 'Long-term Housing',
    price: 150,
    description: 'Full assistance in finding and signing a long-term rental contract.',
    icon: 'Home'
  }
];

const FAQS: FAQItem[] = [
  {
    question: "What happens if my flight is delayed?",
    answer: "Don't worry! We track your flight status in real-time. Your driver will be waiting for you in the arrivals hall whenever you land, at no extra cost to you."
  },
  {
    question: "How will I recognize my LithuNative driver?",
    answer: "Your driver will be holding a clear LithuNative sign with your name on it right at the arrivals gate. You will also receive their contact details via WhatsApp/Email 24 hours before landing."
  },
  {
    question: "Is the SIM card ready to use immediately?",
    answer: "Yes. We provide pre-activated SIM cards (Ežys or Pildyk) and our assistant will help you ensure the data plan is working before you even leave the airport."
  },
  {
    question: "Which banks can you help me set up with?",
    answer: "We specialize in helping international students with Revolut (for immediate use) and local traditional banks like Swedbank or SEB, ensuring you have the correct documentation for a student account."
  },
  {
    question: "Can I pay with a card or cash on arrival?",
    answer: "We accept both! You can pay securely with any major credit/debit card, or in Euro cash directly to your driver upon reaching your destination."
  }
];

// --- COMPONENTS ---

const AccordionItem: React.FC<{ faq: FAQItem, isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => (
  <div className="border-b border-blue-50 last:border-0">
    <button 
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between text-left hover:bg-blue-50/30 transition-colors px-4 rounded-xl"
    >
      <span className="font-bold text-blue-900 text-lg">{faq.question}</span>
      <ChevronDown className={`text-blue-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
      <p className="px-4 text-blue-800/70 leading-relaxed font-medium">
        {faq.answer}
      </p>
    </div>
  </div>
);

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'ai', isError?: boolean }[]>([
    { text: "Labas! Welcome. I'm your LithuNative assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setIsLoading(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("API_KEY_MISSING");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'You are the LithuNative AI. Helpful, personal, and concise. We serve everyone: students, business travelers, and tourists. Mention our arrival tiers (Essential, Welcome Plus, Native Integration) if relevant. Highlight our partnerships with Bolt (drivers waiting at airport), LTG (Railways), Lithuanian Transport, Atlas Living, and Shed Co-living. We offer 1-night, 1-month, and long-term accommodation options. Emphasize that all our staff speak English, we cover all areas in Lithuania, and we provide detailed user guides for bank and card setup. We guide you from arrival until you leave the country.',
        },
      });
      
      const text = response.text;
      setMessages(prev => [...prev, { text: text || "I'm not sure about that, but our team can help!", sender: 'ai' }]);
    } catch (e: any) {
      console.error("Chat Error:", e);
      let errorMsg = "I'm having a little trouble connecting to my brain right now! This usually happens if the network is restricted. Please check our booking options below or email us at support@lithunative.lt.";
      
      if (e.message?.includes('refused to connect') || e.message === 'Failed to fetch') {
        errorMsg = "Connection Refused: It looks like the AI service is blocked in your region or by your network. Please use our manual booking form below!";
      }

      setMessages(prev => [...prev, { 
        text: errorMsg, 
        sender: 'ai',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] md:w-[400px] flex flex-col overflow-hidden border border-blue-100 animate-in fade-in slide-in-from-bottom-4 shadow-blue-900/10">
          <div className="bg-blue-800 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-900 font-bold">L</div>
              <h3 className="font-semibold text-sm uppercase tracking-wider">LithuNative Bot</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 rounded-full p-1 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-blue-50/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm flex gap-2 ${
                  m.sender === 'user' 
                    ? 'bg-blue-700 text-white rounded-tr-none' 
                    : m.isError 
                      ? 'bg-red-50 text-red-900 border border-red-100 rounded-tl-none'
                      : 'bg-white text-blue-900 shadow-sm border border-blue-100 rounded-tl-none'
                }`}>
                  {m.isError && <AlertCircle size={14} className="shrink-0 mt-0.5" />}
                  <span>{m.text}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm border border-blue-100 rounded-2xl rounded-tl-none p-3">
                  <Loader2 className="animate-spin text-blue-600" size={16} />
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t border-blue-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-blue-50 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-blue-900"
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-blue-700 text-white rounded-lg p-2 disabled:opacity-50 transition-opacity">
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform group">
          <MessageCircle className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 500], [0, 100]);

  const [booking, setBooking] = useState<BookingState>({
    tierId: 'mcwelcome',
    addons: [],
    landingCity: 'Vilnius',
    studyCity: 'Vilnius',
    isStudent: false
  });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showAllDiscounts, setShowAllDiscounts] = useState(false);

  const totalPrice = useMemo(() => {
    const tier = TIERS.find(t => t.id === booking.tierId);
    const addonsTotal = booking.addons.reduce((sum, id) => {
      const addon = ADDONS.find(a => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);
    const intercityFee = (booking.landingCity === 'Vilnius' && booking.studyCity === 'Kaunas') ? 70 : 0;
    const subtotal = (tier?.price || 0) + addonsTotal + intercityFee;
    return booking.isStudent ? Math.round(subtotal * 0.85) : subtotal;
  }, [booking]);

  const toggleAddon = (id: string) => {
    setBooking(prev => ({
      ...prev,
      addons: prev.addons.includes(id) 
        ? prev.addons.filter(a => a !== id)
        : [...prev.addons, id]
    }));
  };

  const getAddonIcon = (iconName: string) => {
    switch (iconName) {
      case 'Map': return <MapIcon size={20} />;
      case 'Landmark': return <Landmark size={20} />;
      case 'Shield': return <Shield size={20} />;
      case 'ShoppingBag': return <ShoppingBag size={20} />;
      case 'Home': return <Home size={20} />;
      default: return <Plus size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-blue-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-700 p-2 rounded-xl">
              <Plane className="text-white" size={24} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-blue-900 uppercase">
              LITHU <span className="text-blue-600">NATIVE</span>
            </span>
          </div>
          <div className="hidden md:flex gap-10 text-sm font-bold text-blue-800">
            <a href="#tiers" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Services</a>
            <a href="#builder" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Customise</a>
            <a href="#discounts" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Discounts</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors uppercase tracking-widest">FAQ</a>
          </div>
          <a href="#builder" className="bg-blue-700 text-white px-7 py-3 rounded-full text-sm font-black shadow-lg hover:bg-blue-800 transition-all uppercase tracking-widest">
            Book Now
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-40 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -z-10 rounded-l-[200px] hidden lg:block" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} /> Official Arrival Partner
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-blue-950 leading-[0.95]">
              Land Smart. <br />
              <span className="text-blue-600">Live Local.</span>
            </h1>
            <p className="text-xl text-blue-800/80 font-medium leading-relaxed max-w-xl">
              Safe. Reliable. Personal. Full guidance for students, business, and tourists until you leave Lithuania. English-speaking Bolt drivers waiting for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="#builder" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-blue-700 text-white font-black rounded-3xl hover:bg-blue-800 transition-all shadow-2xl shadow-blue-200 text-xl uppercase tracking-widest">
                Start Plan <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 relative group"
            style={{ y: heroImageY }}
          >
            <div className="absolute -inset-4 bg-blue-100/50 blur-3xl rounded-full" />
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img 
                src="https://picsum.photos/seed/student-arrival/1200/800" 
                alt="International Student Arrival" 
                referrerPolicy="no-referrer"
                className="rounded-[60px] shadow-3xl relative z-10 w-full object-cover h-[550px] border-8 border-white transition-transform duration-700"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section with Scrolling Marquee */}
      <section className="py-12 bg-white border-y border-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <p className="text-center text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">Official Partners & Discount Network</p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee flex items-center gap-16 md:gap-24 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-default">
            {[
              { name: 'Bolt', logo: 'https://logo.clearbit.com/bolt.eu' },
              { name: 'LTG Railways', logo: 'https://logo.clearbit.com/ltg.lt' },
              { name: 'Maxima', logo: 'https://logo.clearbit.com/maxima.lt' },
              { name: 'Wolt', logo: 'https://logo.clearbit.com/wolt.com' },
              { name: 'Revolut', logo: 'https://logo.clearbit.com/revolut.com' },
              { name: 'Swedbank', logo: 'https://logo.clearbit.com/swedbank.lt' },
              { name: 'IKEA', logo: 'https://logo.clearbit.com/ikea.com' },
              { name: 'SEB', logo: 'https://logo.clearbit.com/seb.lt' },
              { name: 'Atlas Living', logo: 'https://logo.clearbit.com/atlasliving.lt' },
              { name: 'Shed Co-living', logo: 'https://logo.clearbit.com/shedcoliving.com' }
            ].map((partner, i) => (
              <div key={i} className="flex items-center gap-4 whitespace-nowrap">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-slate-200">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${partner.name}&background=0f172a&color=fff&bold=true`;
                    }}
                  />
                </div>
                <span className="font-black text-xl tracking-tighter text-slate-900">{partner.name}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              { name: 'Bolt', logo: 'https://logo.clearbit.com/bolt.eu' },
              { name: 'LTG Railways', logo: 'https://logo.clearbit.com/ltg.lt' },
              { name: 'Maxima', logo: 'https://logo.clearbit.com/maxima.lt' },
              { name: 'Wolt', logo: 'https://logo.clearbit.com/wolt.com' },
              { name: 'Revolut', logo: 'https://logo.clearbit.com/revolut.com' },
              { name: 'Swedbank', logo: 'https://logo.clearbit.com/swedbank.lt' },
              { name: 'IKEA', logo: 'https://logo.clearbit.com/ikea.com' },
              { name: 'SEB', logo: 'https://logo.clearbit.com/seb.lt' },
              { name: 'Atlas Living', logo: 'https://logo.clearbit.com/atlasliving.lt' },
              { name: 'Shed Co-living', logo: 'https://logo.clearbit.com/shedcoliving.com' }
            ].map((partner, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-4 whitespace-nowrap">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-slate-200">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${partner.name}&background=0f172a&color=fff&bold=true`;
                    }}
                  />
                </div>
                <span className="font-black text-xl tracking-tighter text-slate-900">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section id="tiers" className="py-32 bg-blue-50/20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 space-y-6"
          >
            <h2 className="text-5xl font-black text-blue-950">Service Tiers</h2>
            <p className="text-blue-800/60 max-w-2xl mx-auto font-medium text-lg">Transparent pricing for every budget.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TIERS.map((tier, index) => (
              <motion.div 
                key={tier.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col p-10 rounded-[48px] border-4 transition-all duration-500 hover:scale-[1.02] ${
                  booking.tierId === tier.id 
                    ? 'border-blue-600 bg-white scale-105 shadow-2xl z-10' 
                    : 'border-white bg-white hover:border-blue-100 shadow-lg'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-blue-600 text-white text-xs font-black rounded-full uppercase tracking-widest">
                    {tier.badge}
                  </span>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-blue-950 mb-3">{tier.name}</h3>
                  <p className="text-blue-800/60 font-medium text-sm leading-relaxed">{tier.description}</p>
                </div>
                <div className="mb-10">
                  <span className="text-5xl font-black text-blue-950">€{tier.price}</span>
                </div>
                <ul className="space-y-4 mb-12 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex gap-4 text-blue-900 font-semibold text-sm">
                      <Check size={16} className="text-blue-700 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setBooking(prev => ({ ...prev, tierId: tier.id }))}
                  className={`w-full py-5 rounded-3xl font-black transition-all uppercase tracking-widest ${
                    booking.tierId === tier.id ? 'bg-blue-700 text-white shadow-xl' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  {booking.tierId === tier.id ? 'Selected' : 'Select Plan'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Builder Section */}
      <section id="builder" className="py-32 bg-blue-950 text-white relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-16"
            >
              <h2 className="text-5xl font-black">Customise Your Arrival</h2>
              <div className="space-y-8">
                <h3 className="text-blue-400 font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs">01</span> Route
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Landing Airport</label>
                    <select 
                      value={booking.landingCity}
                      onChange={(e) => setBooking(prev => ({ ...prev, landingCity: e.target.value as any }))}
                      className="w-full bg-blue-900/50 border-2 border-blue-800 rounded-2xl p-4 font-bold outline-none cursor-pointer focus:border-blue-500 transition-colors"
                    >
                      <option value="Vilnius">Vilnius (VNO)</option>
                      <option value="Kaunas">Kaunas (KUN)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">University City</label>
                    <select 
                      value={booking.studyCity}
                      onChange={(e) => setBooking(prev => ({ ...prev, studyCity: e.target.value as any }))}
                      className="w-full bg-blue-900/50 border-2 border-blue-800 rounded-2xl p-4 font-bold outline-none cursor-pointer focus:border-blue-500 transition-colors"
                    >
                      <option value="Vilnius">Vilnius</option>
                      <option value="Kaunas">Kaunas</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-blue-400 font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs">02</span> Extra Services
                </h3>
                <div className="grid gap-4">
                  {ADDONS.filter(a => a.id !== 'kaunas-bridge').map((addon) => (
                    <div 
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-6 ${
                        booking.addons.includes(addon.id) ? 'border-blue-500 bg-blue-500/10' : 'border-blue-900 bg-blue-900/30 hover:border-blue-700'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        booking.addons.includes(addon.id) ? 'bg-blue-500 text-white' : 'bg-blue-900 text-blue-500'
                      }`}>
                        {getAddonIcon(addon.icon || '')}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold">{addon.name}</h4>
                          <span className="text-blue-400 font-black">€{addon.price}</span>
                        </div>
                        <p className="text-xs opacity-40 leading-relaxed mt-1">{addon.description}</p>
                      </div>
                      {booking.addons.includes(addon.id) && <Check size={20} className="text-blue-500" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-blue-400 font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs">03</span> Student Discount
                </h3>
                <div 
                  onClick={() => setBooking(prev => ({ ...prev, isStudent: !prev.isStudent }))}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    booking.isStudent ? 'border-blue-500 bg-blue-500/10' : 'border-blue-900 bg-blue-900/30 hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${booking.isStudent ? 'bg-blue-500 text-white' : 'bg-blue-900 text-blue-500'}`}>
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-lg">I am a Student</p>
                      <p className="text-sm text-blue-400">Apply 15% discount on total</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${booking.isStudent ? 'border-blue-500 bg-blue-500' : 'border-blue-700'}`}>
                    {booking.isStudent && <Check size={14} className="text-white" />}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="relative h-full">
              <div className="lg:sticky lg:top-32">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="bg-white rounded-[50px] p-12 text-blue-950 shadow-2xl border border-blue-50">
                <h3 className="text-3xl font-black mb-10 text-blue-900 uppercase tracking-tighter">Your Arrival Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800/50 font-bold uppercase text-[10px] tracking-widest">{TIERS.find(t => t.id === booking.tierId)?.name}</span>
                    <span className="font-black">€{TIERS.find(t => t.id === booking.tierId)?.price}</span>
                  </div>
                  {booking.landingCity === 'Vilnius' && booking.studyCity === 'Kaunas' && (
                    <div className="flex justify-between items-center text-blue-600 font-black">
                      <span className="text-[10px] uppercase tracking-widest italic">The Kaunas Bridge (Intercity)</span>
                      <span>€70</span>
                    </div>
                  )}
                  {booking.addons.map(id => {
                    const addon = ADDONS.find(a => a.id === id);
                    return (
                      <div key={id} className="flex justify-between items-center animate-in fade-in slide-in-from-right-4">
                        <span className="text-blue-800/50 font-bold uppercase text-[10px] tracking-widest">{addon?.name}</span>
                        <span className="font-black">€{addon?.price}</span>
                      </div>
                    );
                  })}
                  {booking.isStudent && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex justify-between items-center text-green-600 font-black"
                    >
                      <span className="text-[10px] uppercase tracking-widest">Student Discount (15%)</span>
                      <span>-€{Math.round(((TIERS.find(t => t.id === booking.tierId)?.price || 0) + booking.addons.reduce((sum, id) => sum + (ADDONS.find(a => a.id === id)?.price || 0), 0) + ((booking.landingCity === 'Vilnius' && booking.studyCity === 'Kaunas') ? 70 : 0)) * 0.15)}</span>
                    </motion.div>
                  )}
                </div>
                <div className="pt-8 border-t-2 border-blue-50 mb-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Estimated Total</p>
                      <h4 className="text-6xl font-black tracking-tighter">€{totalPrice}</h4>
                    </div>
                  </div>
                </div>
                <button className="w-full py-6 bg-blue-700 text-white rounded-[32px] font-black text-xl hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest shadow-xl shadow-blue-100">
                  Confirm Booking
                </button>
                <p className="text-center text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-6">
                  No payment today • 24h Confirmation
                </p>
              </div>
            </motion.div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discounts Section */}
      <section id="discounts" className="pt-32 pb-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 space-y-6"
          >
            <h2 className="text-5xl font-black text-blue-950">Exclusive Discounts</h2>
            <p className="text-blue-800/60 max-w-2xl mx-auto font-medium text-lg">Save on food, transport, and stays with our partner network.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(showAllDiscounts ? DISCOUNTS : DISCOUNTS.slice(0, 4)).map((discount, index) => (
              <motion.div 
                key={discount.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
                className="bg-blue-50/50 p-8 rounded-[40px] border border-blue-100 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-700 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {discount.icon}
                </div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{discount.category}</p>
                <h4 className="text-xl font-black text-blue-950 mb-2">{discount.partner}</h4>
                <p className="text-blue-600 font-bold">{discount.value}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <button 
              onClick={() => setShowAllDiscounts(!showAllDiscounts)}
              className="px-10 py-4 bg-blue-50 text-blue-700 font-black rounded-2xl hover:bg-blue-100 transition-colors uppercase tracking-widest text-sm"
            >
              {showAllDiscounts ? 'Show Less' : 'View All 50+ Discounts'}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="pt-16 pb-32 bg-white scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 space-y-6"
          >
            <h2 className="text-5xl font-black text-blue-950">Got Questions?</h2>
            <p className="text-blue-800/60 font-medium text-lg">We've helped hundreds of students land safely. Here are the most common queries.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl p-4 md:p-8 shadow-xl shadow-blue-50/50 border border-blue-50"
          >
            {FAQS.map((faq, index) => (
              <AccordionItem 
                key={index} 
                faq={faq} 
                isOpen={openFaqIndex === index}
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              />
            ))}
          </motion.div>
          <div className="mt-12 text-center">
            <p className="text-blue-800/50 font-bold text-sm">
              Don't see your question? <button onClick={() => window.dispatchEvent(new CustomEvent('openChat'))} className="text-blue-600 hover:underline font-black">Chat with our AI Assistant</button>
            </p>
          </div>
        </div>
      </section>

      {/* Why Us Features */}
      <section id="about" className="py-32 bg-blue-50/20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Users size={32} />, title: 'English Speaking', desc: 'All our drivers and assistants speak fluent English for your comfort.' },
              { icon: <CreditCard size={32} />, title: 'Bank & Card Guides', desc: 'Detailed user guides for local bank accounts and card details.' },
              { icon: <Globe size={32} />, title: 'Nationwide Coverage', desc: 'We cover all areas in Lithuania, ensuring no student is left behind.' },
              { icon: <Shield size={32} />, title: 'Partner Discounts', desc: 'Exclusive discounts for Bolt, LTG, and local transport services.' }
            ].map((item, i) => (
              <div key={i} className="space-y-4 group">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-blue-700 shadow-sm transition-transform group-hover:rotate-12">{item.icon}</div>
                <h4 className="font-black text-xl uppercase tracking-tight text-blue-900">{item.title}</h4>
                <p className="text-blue-800/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-12 text-center">
          <div className="flex items-center gap-3">
            <Plane size={32} className="text-blue-400" />
            <span className="font-black text-2xl uppercase tracking-tighter">LITHU NATIVE</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-xs font-black uppercase tracking-widest text-blue-300">
            <a href="#tiers" className="hover:text-white transition-colors">Service Tiers</a>
            <a href="#builder" className="hover:text-white transition-colors">Book Now</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#about" className="hover:text-white transition-colors">Why Us</a>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 max-w-sm">
            © 2024 LITHU NATIVE | Premium Logistics for Lithuania. Safe. Reliable. Personal.
          </p>
        </div>
      </footer>

      {/* Gemini Powered Chat Assistant */}
      <ChatWidget />
    </div>
  );
};

// --- RENDERING ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
