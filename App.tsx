
import React, { useState, useMemo } from 'react';
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
  Utensils,
  Hotel,
  Car,
  Ticket,
  Home
} from 'lucide-react';
import { TIERS, ADDONS } from './constants';
import { BookingState } from './types';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
  const [booking, setBooking] = useState<BookingState>({
    tierId: 'mcwelcome',
    addons: [],
    landingCity: 'Vilnius',
    studyCity: 'Vilnius',
    isStudent: false
  });

  const totalPrice = useMemo(() => {
    const tier = TIERS.find(t => t.id === booking.tierId);
    const addonsTotal = booking.addons.reduce((sum, id) => {
      const addon = ADDONS.find(a => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);
    
    // Auto-add Kaunas Bridge if cities differ
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
      case 'Map': return <Globe size={20} />;
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
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-blue-50">
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
            <a href="#tiers" className="hover:text-blue-600 transition-colors uppercase tracking-wider">Service Tiers</a>
            <a href="#addons" className="hover:text-blue-600 transition-colors uppercase tracking-wider">Add-ons</a>
            <a href="#about" className="hover:text-blue-600 transition-colors uppercase tracking-wider">Why Us</a>
          </div>
          <button className="bg-blue-700 text-white px-7 py-3 rounded-full text-sm font-black shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all uppercase tracking-widest">
            Book Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-40 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -z-10 rounded-l-[200px] hidden lg:block" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-10">
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
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-blue-100/50 blur-3xl rounded-full" />
            <img 
              src="https://picsum.photos/seed/student-arrival/1200/800" 
              alt="International Student Arrival" 
              referrerPolicy="no-referrer"
              className="rounded-[60px] shadow-3xl relative z-10 w-full object-cover h-[550px] border-8 border-white"
            />
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[40px] shadow-2xl z-20 flex gap-5 items-center border border-blue-50">
              <div className="bg-blue-100 p-4 rounded-2xl text-blue-700">
                <Check size={32} />
              </div>
              <div>
                <p className="text-lg font-black text-blue-900">SIM Activated</p>
                <p className="text-sm font-bold text-blue-500 uppercase">Immediate Connection</p>
              </div>
            </div>
          </div>
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
      <section id="tiers" className="py-32 bg-blue-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-5xl font-black text-blue-950">Core Service Tiers</h2>
            <p className="text-blue-800/60 max-w-2xl mx-auto font-medium text-lg">
              Transparent pricing. No hidden fees. Designed by former international students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TIERS.map((tier) => (
              <div 
                key={tier.id}
                className={`relative flex flex-col p-10 rounded-[48px] border-4 transition-all duration-500 ${
                  booking.tierId === tier.id 
                    ? 'border-blue-600 bg-white scale-105 shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)]' 
                    : 'border-white bg-white hover:border-blue-100 shadow-xl shadow-blue-50/50'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-blue-600 text-white text-xs font-black rounded-full uppercase tracking-[0.2em] shadow-lg">
                    {tier.badge}
                  </span>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-blue-950 mb-3">{tier.name}</h3>
                  <p className="text-blue-800/60 font-medium leading-relaxed">{tier.description}</p>
                </div>
                <div className="mb-10 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-blue-950">€{tier.price}</span>
                  <span className="text-blue-400 font-bold text-sm uppercase tracking-widest">Base</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex gap-4 text-blue-900 font-semibold">
                      <div className="shrink-0 mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <Check size={14} className="text-blue-700" strokeWidth={3} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setBooking(prev => ({ ...prev, tierId: tier.id }))}
                  className={`w-full py-5 rounded-3xl font-black text-lg transition-all uppercase tracking-widest ${
                    booking.tierId === tier.id 
                      ? 'bg-blue-700 text-white shadow-xl shadow-blue-200' 
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  {booking.tierId === tier.id ? 'Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Builder */}
      <section id="builder" className="py-32 bg-blue-950 text-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-16">
              <div>
                <h2 className="text-5xl font-black mb-6">Build Your Arrival</h2>
                <p className="text-blue-200/60 text-lg font-medium">Customise every step of your journey to your new home.</p>
              </div>

              {/* Step 1: Destination Selection */}
              <div className="space-y-8">
                <h3 className="text-xl font-black flex items-center gap-4 uppercase tracking-[0.2em] text-blue-400">
                  <span className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">01</span>
                  Route
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">Landing Airport</label>
                    <select 
                      value={booking.landingCity}
                      onChange={(e) => setBooking(prev => ({ ...prev, landingCity: e.target.value as any }))}
                      className="w-full bg-blue-900/50 border-2 border-blue-800 rounded-2xl px-5 py-4 font-bold focus:border-blue-500 focus:ring-0 outline-none transition-all cursor-pointer"
                    >
                      <option value="Vilnius">Vilnius (VNO)</option>
                      <option value="Kaunas">Kaunas (KUN)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">University City</label>
                    <select 
                      value={booking.studyCity}
                      onChange={(e) => setBooking(prev => ({ ...prev, studyCity: e.target.value as any }))}
                      className="w-full bg-blue-900/50 border-2 border-blue-800 rounded-2xl px-5 py-4 font-bold focus:border-blue-500 focus:ring-0 outline-none transition-all cursor-pointer"
                    >
                      <option value="Vilnius">Vilnius (VU/VGTU)</option>
                      <option value="Kaunas">Kaunas (KTU/LSMU)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Add-ons */}
              <div id="addons" className="space-y-8">
                <h3 className="text-xl font-black flex items-center gap-4 uppercase tracking-[0.2em] text-blue-400">
                  <span className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">02</span>
                  Extras
                </h3>
                <div className="grid gap-5">
                  {ADDONS.filter(a => a.id !== 'kaunas-bridge').map((addon) => (
                    <div 
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-6 ${
                        booking.addons.includes(addon.id) 
                          ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                          : 'border-blue-900 bg-blue-900/30 hover:border-blue-700'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        booking.addons.includes(addon.id) ? 'bg-blue-500 text-white' : 'bg-blue-900 text-blue-600'
                      }`}>
                        {getAddonIcon(addon.icon || '')}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-black text-lg">{addon.name}</h4>
                          <span className="font-black text-blue-400">€{addon.price}</span>
                        </div>
                        <p className="text-sm font-medium text-blue-200/40">{addon.description}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        booking.addons.includes(addon.id) ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/20' : 'border-blue-800'
                      }`}>
                        {booking.addons.includes(addon.id) && <Check size={18} strokeWidth={4} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Student Status */}
              <div className="space-y-8">
                <h3 className="text-xl font-black flex items-center gap-4 uppercase tracking-[0.2em] text-blue-400">
                  <span className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">03</span>
                  Student Discount
                </h3>
                <div 
                  onClick={() => setBooking(prev => ({ ...prev, isStudent: !prev.isStudent }))}
                  className={`p-8 rounded-[40px] border-2 cursor-pointer transition-all flex items-center justify-between ${
                    booking.isStudent 
                      ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                      : 'border-blue-900 bg-blue-900/30 hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      booking.isStudent ? 'bg-blue-500 text-white' : 'bg-blue-900 text-blue-600'
                    }`}>
                      <Users size={28} />
                    </div>
                    <div>
                      <h4 className="font-black text-xl">I am a Student</h4>
                      <p className="text-sm font-medium text-blue-400">Apply 15% discount on your total arrival package</p>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    booking.isStudent ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/20' : 'border-blue-800'
                  }`}>
                    {booking.isStudent && <Check size={24} strokeWidth={4} className="text-white" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="lg:sticky lg:top-32">
              <div className="bg-white rounded-[60px] p-12 text-blue-950 shadow-3xl">
                <h3 className="text-3xl font-black mb-10 text-blue-900 uppercase tracking-tighter">Your Arrival</h3>
                
                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center group">
                    <span className="text-blue-800/50 font-bold uppercase text-xs tracking-[0.2em]">{TIERS.find(t => t.id === booking.tierId)?.name}</span>
                    <span className="font-black text-lg">€{TIERS.find(t => t.id === booking.tierId)?.price}</span>
                  </div>
                  
                  {booking.landingCity === 'Vilnius' && booking.studyCity === 'Kaunas' && (
                    <div className="flex justify-between items-center text-blue-600 font-black italic">
                      <span className="uppercase text-xs tracking-[0.2em]">Intercity Transfer</span>
                      <span className="text-lg">€70</span>
                    </div>
                  )}

                  {booking.addons.map(id => {
                    const addon = ADDONS.find(a => a.id === id);
                    return (
                      <div key={id} className="flex justify-between items-center animate-in fade-in slide-in-from-right-4 duration-300">
                        <span className="text-blue-800/50 font-bold uppercase text-xs tracking-[0.2em]">{addon?.name}</span>
                        <span className="font-black text-lg">€{addon?.price}</span>
                      </div>
                    );
                  })}
                  
                  {booking.isStudent && (
                    <div className="flex justify-between items-center text-green-600 font-black animate-in zoom-in duration-300">
                      <span className="uppercase text-xs tracking-[0.2em]">Student Discount (15%)</span>
                      <span className="text-lg">-€{Math.round(((TIERS.find(t => t.id === booking.tierId)?.price || 0) + booking.addons.reduce((sum, id) => sum + (ADDONS.find(a => a.id === id)?.price || 0), 0) + ((booking.landingCity === 'Vilnius' && booking.studyCity === 'Kaunas') ? 70 : 0)) * 0.15)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-8 border-t-4 border-blue-50 mb-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.4em] mb-2">Total Payable</p>
                      <h4 className="text-6xl font-black text-blue-950 tracking-tighter">€{totalPrice}</h4>
                    </div>
                    <div className="text-right pb-2">
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Safe Arrival Guarantee</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-6 bg-blue-700 text-white rounded-[32px] font-black text-xl hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-blue-100 uppercase tracking-[0.1em]">
                  Book My Arrival
                </button>
                <p className="mt-6 text-center text-[10px] text-blue-300 font-black uppercase tracking-[0.2em]">
                  Pay on arrival • Free Cancellation • 24/7 Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Features */}
      <section id="about" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-6 group">
              <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-700 transition-transform group-hover:rotate-12">
                <Users size={32} />
              </div>
              <h4 className="font-black text-xl text-blue-900 uppercase tracking-tight">English Speaking</h4>
              <p className="text-blue-800/60 font-medium leading-relaxed">All our drivers and assistants speak fluent English for your comfort and clarity.</p>
            </div>
            <div className="space-y-6 group">
              <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-700 transition-transform group-hover:rotate-12">
                <CreditCard size={32} />
              </div>
              <h4 className="font-black text-xl text-blue-900 uppercase tracking-tight">Bank & Card Guides</h4>
              <p className="text-blue-800/60 font-medium leading-relaxed">Detailed user guides for local bank accounts, card details, and financial setup.</p>
            </div>
            <div className="space-y-6 group">
              <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-700 transition-transform group-hover:rotate-12">
                <Globe size={32} />
              </div>
              <h4 className="font-black text-xl text-blue-900 uppercase tracking-tight">Nationwide Coverage</h4>
              <p className="text-blue-800/60 font-medium leading-relaxed">We cover all areas in Lithuania, ensuring a safe arrival no matter your destination.</p>
            </div>
            <div className="space-y-6 group">
              <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-700 transition-transform group-hover:rotate-12">
                <Shield size={32} />
              </div>
              <h4 className="font-black text-xl text-blue-900 uppercase tracking-tight">Partner Discounts</h4>
              <p className="text-blue-800/60 font-medium leading-relaxed">Exclusive discounts for Bolt, LTG Railways, and local Lithuanian transport services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Discounts Section */}
      <section id="discounts" className="py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-5xl font-black text-blue-950">Exclusive Discounts</h2>
            <p className="text-blue-800/60 max-w-2xl mx-auto font-medium text-lg">Save on food, transport, and stays with our partner network.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 'd1', category: 'Transport', partner: 'Bolt', value: '20% Off First 5 Rides', icon: <Car size={20} /> },
              { id: 'd2', category: 'Food', partner: 'Local Restaurants', value: '15% Off Total Bill', icon: <Utensils size={20} /> },
              { id: 'd3', category: 'Stay', partner: 'Partner Hotels', value: '10% Cashback', icon: <Hotel size={20} /> },
              { id: 'd4', category: 'Travel', partner: 'LTG Railways', value: 'Special Group Rates', icon: <Ticket size={20} /> },
            ].map((discount) => (
              <div key={discount.id} className="bg-blue-50/50 p-8 rounded-[40px] border border-blue-100 hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-700 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {discount.icon}
                </div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{discount.category}</p>
                <h4 className="text-xl font-black text-blue-950 mb-2">{discount.partner}</h4>
                <p className="text-blue-600 font-bold">{discount.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-50/30 border-t border-blue-100 py-20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="bg-blue-700 p-2 rounded-xl">
                <Plane className="text-white" size={24} />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-blue-900 uppercase">
                LITHU NATIVE
              </span>
            </div>
            <div className="flex gap-12 text-xs font-black text-blue-800 uppercase tracking-widest">
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <p className="text-xs text-blue-400 font-black uppercase tracking-[0.3em]">© 2024 LITHU NATIVE</p>
          </div>
        </div>
      </footer>

      {/* Gemini Powered Chat Assistant */}
      <ChatWidget />
    </div>
  );
};

export default App;
