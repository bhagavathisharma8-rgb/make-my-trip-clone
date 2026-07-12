"use client";

import React, { useState, useEffect, useRef } from "react";
import AuthModals from "@/components/ui/AuthModals";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("signup");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Anti-Hydration Error Mismatch Mounting Check
  const [mounted, setMounted] = useState(false);
  
  // Dynamic Tab Switcher ("flights" or "hotels")
  const [currentTab, setCurrentTab] = useState<"flights" | "hotels">("flights");

  // Dynamic Search Engine Values
  const [fromCity, setFromCity] = useState("Paris");
  const [toCity, setToCity] = useState("");
  const [travelDate, setTravelDate] = useState("2026-07-11");
  const [travelers, setTravelers] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);

  // Dropdown Toggles
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fromCityRef = useRef<HTMLDivElement>(null);
  const toCityRef = useRef<HTMLDivElement>(null);

  const cities = ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Goa", "Shimla", "Paris", "Tokyo", "Davangere", "Bali", "New York", "London", "Dubai", "Singapore", "Sydney", "Indonesia", "France"];

  const [carouselIndex, setCarouselIndex] = useState(0);
  const websiteFacilitiesSlides = [
    {
      url: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1600&q=80",
      title: "✈️ Jet off to Your Next Dream Destination",
      facilities: "Global Flight Interconnections • Premium On-Board Hot Catering • Instant 100% Secure Checkout Protocols"
    },
    {
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80",
      title: "🏨 Unlock Breathtaking Luxury Resorts & Stays",
      facilities: "Handpicked 5-Star Properties • Complimentary Room Upgrades • All-Inclusive Poolside & Spa Retreat Credits"
    },
    {
      url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
      title: "🚌 Experience Scenic Road Trips & Highway Coaches",
      facilities: "Ultra-Comfortable Sleeper Berths • Individual Power Outlets • Real-Time Live GPS Journey Mapping Systems"
    },
    {
      url: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80",
      title: "🚂 High-Speed Rail Networks Bullet Express",
      facilities: "Vista-Dome Panoramic Window Suites • Gourmet Lounge Cabins • Priority Express Station Boarding Gates"
    },
    {
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
      title: "🗺️ Wander Often: Curated Guided Excursions & Tourism",
      facilities: "Expert Local Travel Planners • Tailor-Made Sightseeing Agendas • Skip-the-Line Monument Entry Passes"
    },
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      title: "🏠 Escape to Beautiful Luxury White Villas & Homestays",
      facilities: "Authentic Cultural Living Escapes • Remote Workspace High-Speed Connectivity • Guided Outdoor Eco-Trails"
    }
  ];

  const staysSections = [
    { title: "Stays in & Around Delhi", img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=400&q=80" },
    { title: "Stays in & Around Mumbai", img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80" },
    { title: "Stays in & Around Bangalore", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80" },
    { title: "Beach Destinations", img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80" }
  ];

  const wondersOfIndia = [
    { title: "Shimla's Best Kept Secret", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80" },
    { title: "Tamil Nadu's Charming Hill Town", img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=400&q=80" },
    { title: "Quaint Little Hill Station in Gujarat", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80" },
    { title: "A pleasant summer retreat", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80" }
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % websiteFacilitiesSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [websiteFacilitiesSlides.length]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
    } else {
      setIsLoggedIn(false); 
      setUserEmail("");
    }
  }, [modalOpen]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setDropdownOpen(false);
      if (fromCityRef.current && !fromCityRef.current.contains(event.target as Node)) setShowFromDropdown(false);
      if (toCityRef.current && !toCityRef.current.contains(event.target as Node)) setShowToDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarketingBookNow = (tab: "flights" | "hotels", destination: string) => {
    setCurrentTab(tab);
    setToCity(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserEmail("");
    setDropdownOpen(false);
    window.location.reload();
  };

  const handleSearchExecute = async () => {
    if (!isLoggedIn) {
      alert("Please login or sign up first to search and book travel routes!");
      setAuthView("login");
      setModalOpen(true);
      return;
    }
    if (!toCity) {
      alert("Please select a destination city first!");
      return;
    }

    setSearchLoading(true);
    try {
      if (currentTab === "flights") {
        const res = await fetch("https://make-my-trip-clone-qaq2.onrender.com/admin/flights");
        const flights = await res.json();
        const matched = flights.find((f: any) => f.from?.toLowerCase() === fromCity.toLowerCase() && f.to?.toLowerCase() === toCity.toLowerCase());
        
        if (matched) {
          router.push(`/book-flight/${matched._id || matched.id}`);
        } else {
          alert(`There is no active operational flight map for ${fromCity} to ${toCity}.`);
        }
      } else {
        const res = await fetch("https://make-my-trip-clone-qaq2.onrender.com/admin/hotels");
        const hotels = await res.json();
        const matched = hotels.find((h: any) => h.location?.toLowerCase() === toCity.toLowerCase());
        
        if (matched) {
          router.push(`/book-hotel/${matched._id || matched.id}`);
        } else {
          alert(`No active hotel listings found inside ${toCity}.`);
        }
      }
    } catch (err) {
      alert("Server sync failure.");
    } finally {
      setSearchLoading(false);
    }
  };

  const filteredFromCollection = cities.filter(c => c.toLowerCase().startsWith(fromCity.toLowerCase().trim()) && c !== toCity);
  const filteredToCollection = cities.filter(c => c.toLowerCase().startsWith(toCity.toLowerCase().trim()) && c !== fromCity);

  if (!mounted) return <div className="min-h-screen bg-slate-100" />;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans overflow-x-hidden text-slate-800">
      
      {/* BACKGROUND IMAGE LAYER */}
      <div className="absolute top-0 left-0 w-full h-[540px] z-0 overflow-hidden">
        <img src="/my-plane.jpg" alt="MakeMyTour Horizon" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-slate-900/5 to-slate-100" />
      </div>

      {/* HEADER BAR */}
      <header className="relative w-full flex items-center justify-between px-12 py-4 bg-transparent z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <span className="text-2xl text-red-500">✈️</span>
          <h1 className="text-xl font-bold tracking-tight text-white">MakeMy<span className="text-blue-400">Tour</span></h1>
        </div>
        
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {isLoggedIn ? (
            <>
              <Link href="/admin" className="text-xs bg-black text-slate-200 border border-slate-700/50 px-4 py-2 rounded font-bold hover:bg-slate-900 transition-all uppercase tracking-wider backdrop-blur-sm shadow-sm">
                ADMIN PORTAL
              </Link>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-9 h-9 rounded-full bg-white text-emerald-800 font-bold flex items-center justify-center shadow-md text-base border border-slate-200">
                {userEmail ? userEmail.charAt(0).toUpperCase() : "S"}
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 top-[45px] w-64 bg-white rounded-xl shadow-2xl border py-3 z-50 text-left">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-extrabold text-slate-900">My Account</p>
                    <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{userEmail}</p>
                  </div>
                  <button onClick={() => { setDropdownOpen(false); router.push("/profile"); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 mt-1">👤 Profile Dashboard</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t mt-1 pt-2">🚪 Log out Account</button>
                </div>
              )}
            </>
          ) : (
            <button onClick={() => { setAuthView("login"); setModalOpen(true); }} className="bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-lg shadow-md uppercase">Instant Login</button>
          )}
        </div>
      </header>

      {/* CORE HERO SEARCH COMPONENT PANEL CONTAINER */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 pt-4 pb-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl border p-6 space-y-6">
          <nav className="flex items-center justify-between border-b pb-4 overflow-x-auto gap-6 text-slate-400 font-medium text-xs">
            <div className="flex items-center gap-8 text-sm">
              <span onClick={() => setCurrentTab("flights")} className={`pb-4 px-1 flex flex-col items-center gap-1 cursor-pointer border-b-2 transition-all ${currentTab === "flights" ? "text-blue-600 border-blue-600 font-bold" : "border-transparent hover:text-slate-700"}`}><span className="text-base">✈️</span>Flights</span>
              <span onClick={() => setCurrentTab("hotels")} className={`pb-4 px-1 flex flex-col items-center gap-1 cursor-pointer border-b-2 transition-all ${currentTab === "hotels" ? "text-blue-600 border-blue-600 font-bold" : "border-transparent hover:text-slate-700"}`}><span className="text-base">🏨</span>Hotels</span>
              <span className="flex flex-col items-center gap-1 opacity-60 cursor-pointer text-slate-400 hover:text-slate-700"><span className="text-base">🏠</span>Homestays</span>
              <span className="flex flex-col items-center gap-1 opacity-60 cursor-pointer text-slate-400 hover:text-slate-700"><span className="text-base">🏖️</span>Holiday</span>
              <span className="flex flex-col items-center gap-1 opacity-60 cursor-pointer text-slate-400 hover:text-slate-700"><span className="text-base">🚂</span>Trains</span>
              <span className="flex flex-col items-center gap-1 opacity-60 cursor-pointer text-slate-400 hover:text-slate-700"><span className="text-base">🚌</span>Buses</span>
              <span className="flex flex-col items-center gap-1 opacity-60 cursor-pointer text-slate-400 hover:text-slate-700"><span className="text-base">🗺️</span>Tourism</span>
            </div>
          </nav>

          {/* DYNAMIC AUTOCOMPLETE INPUT MATRIX INTERFACES */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white relative">
            <div className="md:col-span-3 border border-slate-200 rounded-xl p-3 text-left hover:bg-slate-50 relative" ref={fromCityRef}>
              <div onClick={() => { setShowFromDropdown(true); setShowToDropdown(false); }}>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">From City Source</span>
                <input type="text" value={fromCity} onChange={(e) => setFromCity(e.target.value)} className="text-sm font-black text-slate-900 bg-transparent outline-none w-full border-none focus:ring-0 p-0" />
                <span className="text-xs text-slate-400 truncate block mt-1">Change departure city faster</span>
              </div>
              {showFromDropdown && (
                <div className="absolute left-0 right-0 top-16 bg-white border rounded-lg shadow-2xl z-50 max-h-40 overflow-y-auto font-bold">
                  {filteredFromCollection.map(city => (
                    <button type="button" key={city} onMouseDown={() => { setFromCity(city); setShowFromDropdown(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer block">{city}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-3 border border-slate-200 rounded-xl p-3 text-left hover:bg-slate-50 relative" ref={toCityRef}>
              <div onClick={() => { setShowToDropdown(true); setShowFromDropdown(false); }}>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">To Destination</span>
                <input type="text" value={toCity} placeholder="Where to?" onChange={(e) => setToCity(e.target.value)} className="text-sm font-black text-slate-900 bg-transparent outline-none w-full border-none focus:ring-0 p-0 placeholder:italic placeholder:font-normal placeholder:text-slate-300" />
                <span className="text-xs text-slate-400 truncate block mt-1">Select destination place faster</span>
              </div>
              {showToDropdown && (
                <div className="absolute left-0 right-0 top-16 bg-white border rounded-lg shadow-2xl z-50 max-h-40 overflow-y-auto font-bold">
                  {filteredToCollection.map(city => (
                    <button type="button" key={city} onMouseDown={() => { setToCity(city); setShowToDropdown(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer block">{city}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 border border-slate-200 rounded-xl p-3 text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">Date</span>
              <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="text-xs font-bold text-slate-900 bg-transparent outline-none w-full border-none p-0 focus:ring-0" />
            </div>

            <div className="md:col-span-2 border border-slate-200 rounded-xl p-3 text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">Travelers Volume</span>
              <input type="number" min={1} value={travelers} onChange={(e) => setTravelers(parseInt(e.target.value) || 1)} className="text-xs font-bold text-slate-900 bg-transparent outline-none w-full border-none p-0 focus:ring-0" />
            </div>

            <button onClick={handleSearchExecute} disabled={searchLoading} className="md:col-span-2 rounded-xl bg-black hover:bg-slate-900 text-white font-bold uppercase tracking-wide text-xs">
              {searchLoading ? "Verifying..." : "Search"}
            </button>
          </div>
        </div>
      </main>

      {/* FIXED: Thick white padding frame (p-6) with a slightly shorter, optimized image height (h-[340px]) */}
      <div className="w-full bg-white p-6 border-y border-slate-200 shadow-sm z-10 mb-12">
        <div className="w-full h-[340px] overflow-hidden relative group shadow-inner">
          <img src={websiteFacilitiesSlides[carouselIndex].url} alt="Travel Hub Slider" className="w-full h-full object-cover transition-all duration-700 ease-in-out" />
          
          {/* Overlay Layout Labels */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-10 text-white text-left space-y-1">
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-2 block shadow-md">MakeMyTour Facilities Hub</span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight drop-shadow-md">{websiteFacilitiesSlides[carouselIndex].title}</h2>
            <p className="text-xs md:text-sm text-slate-200 font-semibold tracking-wide drop-shadow-sm">{websiteFacilitiesSlides[carouselIndex].facilities}</p>
          </div>
          
          {/* Slider Pagination Nodes */}
          <div className="absolute bottom-6 right-8 flex gap-2 z-20">
            {websiteFacilitiesSlides.map((_, i) => (
              <span key={i} onClick={() => setCarouselIndex(i)} className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${carouselIndex === i ? 'w-5 bg-blue-500' : 'w-1.5 bg-white/60 hover:bg-white'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* MARKETING OFFERS & SECTION CONTENT GRIDS */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 pb-12 space-y-12">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 text-left tracking-tight">Best Offers for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden"><img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80" alt="Domestic Flights" className="w-full h-full object-cover" /></div>
              <div className="p-5 text-left space-y-1.5">
                <h4 className="font-extrabold text-base text-slate-900">Domestic Flights</h4>
                <p className="text-xs text-slate-400 font-medium">Get up to 20% off on domestic flights booking codes instantly.</p>
              </div>
              <div className="p-5 pt-0 text-left">
                <button onClick={() => handleMarketingBookNow("flights", "Goa")} className="bg-black hover:bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors">Book Now</button>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden"><img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80" alt="International Hotels" className="w-full h-full object-cover" /></div>
              <div className="p-5 text-left space-y-1.5">
                <h4 className="font-extrabold text-base text-slate-900">International Hotels</h4>
                <p className="text-xs text-slate-400 font-medium">Book luxury premium hotels worldwide with exclusive promo credits.</p>
              </div>
              <div className="p-5 pt-0 text-left">
                <button onClick={() => handleMarketingBookNow("hotels", "Paris")} className="bg-black hover:bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors">Book Now</button>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden"><img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80" alt="Holiday Packages" className="w-full h-full object-cover" /></div>
              <div className="p-5 text-left space-y-1.5">
                <h4 className="font-extrabold text-base text-slate-900">Holiday Packages</h4>
                <p className="text-xs text-slate-400 font-medium">Exclusive flash deals on premium customized tropical holiday packages.</p>
              </div>
              <div className="p-5 pt-0 text-left">
                <button onClick={() => handleMarketingBookNow("flights", "Tokyo")} className="bg-black hover:bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors">Book Now</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 text-left tracking-tight">Popular Stay Escapes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {staysSections.map((item, idx) => (
              <div key={idx} onClick={() => handleMarketingBookNow("hotels", item.title.split("Around ")[1] || "Goa")} className="group h-40 rounded-xl overflow-hidden relative shadow-md cursor-pointer border border-slate-200 bg-white hover:shadow-xl transition-all">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-3 text-left">
                  <span className="text-white text-xs font-bold leading-tight group-hover:text-blue-300 transition-colors">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 text-left tracking-tight">Unlock Lesser-Known Wonders of India</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {wondersOfIndia.map((item, idx) => (
              <div key={idx} onClick={() => handleMarketingBookNow("flights", item.title.includes("Shimla") ? "Shimla" : "Delhi")} className="group h-40 rounded-xl overflow-hidden relative shadow-md cursor-pointer border border-slate-200 bg-white hover:shadow-xl transition-all">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-3 text-left">
                  <span className="text-white text-xs font-bold leading-tight group-hover:text-blue-300 transition-colors">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: DOWNLOAD APP BANNER */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-left space-y-1 flex-1">
            <h4 className="text-base font-bold text-slate-900">Download App Now!</h4>
            <p className="text-xs text-slate-400 font-medium">Get India's #1 travel super app with best deals on flights and dynamic reservation records.</p>
            <div className="flex gap-2 pt-2">
              <span className="bg-slate-900 text-white px-3 py-1.5 text-[10px] font-bold rounded cursor-pointer border border-slate-800 hover:bg-black transition-colors">App Store</span>
              <span className="bg-slate-900 text-white px-3 py-1.5 text-[10px] font-bold rounded cursor-pointer border border-slate-800 hover:bg-black transition-colors">Google Play</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white p-1 border border-slate-200 rounded flex items-center justify-center shadow-sm">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.makemytrip.com/" alt="MakeMyTour QR Code" className="w-full h-full object-contain" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium text-left max-w-[120px] leading-tight">Scan QR code to download the application instantly.</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 px-12 border-t border-slate-900 mt-auto">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-8 border-b border-slate-900 pb-8">
          <div className="space-y-2">
            <h5 className="text-white font-bold text-xs">Why MakeMyTour?</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">Established in 2000, MakeMyTour has since positioned itself as one of the leading companies, providing great offers, competitive airfares, exclusive discounts, and a seamless online booking experience.</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-white font-bold text-xs">Booking Flights with MakeMyTour</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">Book your flight tickets with India's leading flight booking company. Get best deals on flights, train tickets, buses, hotels and holiday packages.</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-white font-bold text-xs">Domestic Flights with MakeMyTour</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">MakeMyTour is India's leading player for flight bookings. With the cheapest fare guarantee, experience great value at the lowest price.</p>
          </div>
        </div>

        <div className="max-w-6xl w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left text-[11px] text-slate-500">
          <div>
            <h6 className="text-white font-bold mb-2">ABOUT THE SITE</h6>
            <div className="space-y-1"><p className="hover:text-slate-200 cursor-pointer">About Us</p><p className="hover:text-slate-200 cursor-pointer">Investor Relations</p><p className="hover:text-slate-200 cursor-pointer">Careers</p></div>
          </div>
          <div>
            <h6 className="text-white font-bold mb-2">POPULAR HOTELS</h6>
            <div className="space-y-1"><p className="hover:text-slate-200 cursor-pointer">Hotels in Delhi</p><p className="hover:text-slate-200 cursor-pointer">Hotels in Mumbai</p><p className="hover:text-slate-200 cursor-pointer">Hotels in Goa</p></div>
          </div>
          <div>
            <h6 className="text-white font-bold mb-2">QUICK LINKS</h6>
            <div className="space-y-1"><p className="hover:text-slate-200 cursor-pointer">COVID-19 Update</p><p className="hover:text-slate-200 cursor-pointer">Flight Schedule</p><p className="hover:text-slate-200 cursor-pointer">Train Schedule</p></div>
          </div>
          <div>
            <h6 className="text-white font-bold mb-2">IMPORTANT LINKS</h6>
            <div className="space-y-1"><p className="hover:text-slate-200 cursor-pointer">Privacy Policy</p><p className="hover:text-slate-200 cursor-pointer">Terms & Conditions</p><p className="hover:text-slate-200 cursor-pointer">User Agreement</p></div>
          </div>
        </div>
        
        <div className="max-w-6xl w-full mx-auto pt-6 mt-6 flex justify-between items-center text-slate-600 text-[11px]">
          <p>© 2026 MakeMyTour PVT. LTD. All rights reserved</p>
          <span className="font-semibold text-slate-800 tracking-wider">NULCLASS</span>
        </div>
      </footer>
      <AuthModals isOpen={modalOpen} onClose={() => setModalOpen(false)} initialView={authView} />
    </div>
  );
}