"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface FlightDetails {
  _id: string;
  id?: string;
  name: string;
  from: string;
  to: string;
  price: number;
  availableSeats: number;
  ticketPrice?: number;
  fare?: number;
  imageUrl?: string;
  timings?: string;
}

interface Passenger {
  name: string;
  age: number;
  seatNumber: string;
}

interface Reply {
  user: string;
  text: string;
  timestamp: string;
}

interface Review {
  id: string;
  targetId: string;
  reviewType: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  photos: string[];
  helpfulCount: number;
  flagged: boolean;
  createdAt: string;
  replies: Reply[];
}

export default function BookFlightPage() {
  const { id: initialId } = useParams();
  const router = useRouter();
  
  // Dynamic flight selection state tracking keys
  const [activeFlightId, setActiveFlightId] = useState<string>(String(initialId));
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [userEmailAddress, setUserEmailAddress] = useState("");
  
  // Passenger Group Allocation States
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: "", age: 25, seatNumber: "" }
  ]);
  const [activePassengerIndex, setActivePassengerIndex] = useState<number>(0);
  
  // FIXED PERMANENTLY: Interactive popover controller toggles a calendar-style box context per row index
  const [showSeatPickerIndex, setShowSeatPickerIndex] = useState<number | null>(null);
  
  // TOP IN-LINE SEARCH HEADER COMPONENT STATES
  const [searchFrom, setSearchFrom] = useState("Paris");
  const [searchTo, setSearchTo] = useState("Tokyo");
  const [searchDate, setSearchDate] = useState("2026-07-15");
  const [allFlightsInventory, setAllFlightsInventory] = useState<FlightDetails[]>([]);
  const [filteredSearchResults, setFilteredSearchResults] = useState<FlightDetails[]>([]);
  const [hasSearchedInPage, setHasSearchedInPage] = useState(false);

  // INTEGRATED REVIEWS ENGINE SYSTEM DATA WORKFLOW STATES
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [inputRating, setInputRating] = useState(5);
  const [inputComment, setInputComment] = useState("");
  const [inputPhotoUrl, setInputPhotoUrl] = useState("");
  const [reviewSortBy, setSortBy] = useState("newest");
  const [activeReplyBoxId, setActiveReplyBoxId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Checkout pricing variables parameters
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [flight, setFlight] = useState<FlightDetails | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const taxes = 1374;
  const otherServices = 249;
  const discount = 250;
  
  const BASE_URL = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8081"
    : "https://make-my-trip-clone-qaq2.onrender.com";

  const basePricePerTicket = flight 
    ? (Number(flight.price) || Number(flight.fare) || Number(flight.ticketPrice) || 3500) 
    : 3500;

  const calculatedBase = basePricePerTicket * passengers.length;
  const totalAmount = calculatedBase + taxes + otherServices - discount;

  // PIPELINE 1: Pull authentication strings safely from local caches
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (!savedEmail) {
      alert("Please log in first to checkout flights!");
      router.push("/");
      return;
    }
    setUserEmailAddress(savedEmail);

    fetch(`${BASE_URL}/user/${encodeURIComponent(savedEmail)}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          setUserId(data.id || data._id || savedEmail);
        } else {
          setUserId(savedEmail);
        }
      })
      .catch(() => setUserId(savedEmail));
  }, [router, BASE_URL]);

  // PIPELINE 2: Re-fetch core flight objects and connected review histories whenever flight targets change
  useEffect(() => {
    setLoadingData(true);
    fetch(`${BASE_URL}/admin/flights`)
      .then((res) => res.ok ? res.json() : [])
      .then((flights: FlightDetails[]) => {
        const enriched = flights.map((f, i) => ({
          ...f,
          imageUrl: f.imageUrl || [
            "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1483450388369-9ed95738483c?auto=format&fit=crop&w=600&q=80"
          ][i % 3],
          timings: f.timings || "03:41 PM ➔ 06:41 PM"
        }));
        
        setAllFlightsInventory(enriched);
        const matched = enriched.find((f) => String(f._id) === String(activeFlightId) || String(f.id) === String(activeFlightId));
        if (matched) {
          setFlight(matched);
        }
        setLoadingData(false);
      })
      .catch(() => setLoadingData(false));

    // Fetch related review lists
    fetch(`${BASE_URL}/api/reviews/FLIGHT/${activeFlightId}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setReviewsList(data))
      .catch((err) => console.error(err));
  }, [activeFlightId, BASE_URL]);

  // SEARCH DISPATCH ACTION
  const handleInPageFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = allFlightsInventory.filter(f => 
      f.from.toLowerCase().includes(searchFrom.toLowerCase().trim()) &&
      f.to.toLowerCase().includes(searchTo.toLowerCase().trim())
    );
    setFilteredSearchResults(results);
    setHasSearchedInPage(true);
  };

  // REVIEWS INTERACTION HANDLERS
  const handleAddNewReviewRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputComment.trim()) return;

    const payload = {
      targetId: activeFlightId,
      reviewType: "FLIGHT",
      userEmail: userEmailAddress,
      userName: userEmailAddress.split("@")[0],
      rating: inputRating,
      comment: inputComment,
      photos: inputPhotoUrl ? [inputPhotoUrl] : []
    };

    try {
      const res = await fetch(`${BASE_URL}/api/reviews/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setInputComment("");
        setInputPhotoUrl("");
        fetch(`${BASE_URL}/api/reviews/FLIGHT/${activeFlightId}`).then((r) => r.json()).then((d) => setReviewsList(d));
        alert("Thank you! Your feedback has been permanently published.");
      }
    } catch (err) {
      alert("Failed to submit review data.");
    }
  };

  const handlePostReplySubmission = async (reviewId: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userEmailAddress.split("@")[0], text: replyText }),
      });
      if (res.ok) {
        setReplyText("");
        setActiveReplyBoxId(null);
        fetch(`${BASE_URL}/api/reviews/FLIGHT/${activeFlightId}`).then((r) => r.json()).then((d) => setReviewsList(d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvoteHelpfulCount = async (reviewId: string) => {
    await fetch(`${BASE_URL}/api/reviews/${reviewId}/helpful`, { method: "POST" });
    fetch(`${BASE_URL}/api/reviews/FLIGHT/${activeFlightId}`).then((r) => r.json()).then((d) => setReviewsList(d));
  };

  const handleFlagContentInappropriate = async (reviewId: string) => {
    await fetch(`${BASE_URL}/api/reviews/${reviewId}/flag`, { method: "POST" });
    alert("Content flagged successfully for moderation screening checks.");
    fetch(`${BASE_URL}/api/reviews/FLIGHT/${activeFlightId}`).then((r) => r.json()).then((d) => setReviewsList(d));
  };

  const handleAddPassengerRow = () => {
    if (passengers.length >= 8) {
      alert("Limitation Warning: You can add a maximum of 8 passengers per booking transaction order block!");
      return;
    }
    setPassengers([...passengers, { name: "", age: 25, seatNumber: "" }]);
    setActivePassengerIndex(passengers.length);
    setShowSeatPickerIndex(passengers.length);
  };

  const handleRemovePassengerRow = (index: number) => {
    if (passengers.length === 1) return;
    const update = [...passengers];
    update.splice(index, 1);
    setPassengers(update);
    setActivePassengerIndex(0);
    setShowSeatPickerIndex(null);
  };

  const handlePassengerFieldChange = (index: number, field: keyof Passenger, value: any) => {
    const update = [...passengers];
    update[index] = { ...update[index], [field]: value };
    setPassengers(update);
  };

  const handleValidateCheckoutFlow = () => {
    if (!searchDate) {
      alert("Please choose a valid travel departure calendar date.");
      return;
    }
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        alert(`Please input a valid Full Name for Passenger #${i + 1}.`);
        return;
      }
      if (!passengers[i].seatNumber) {
        alert(`Please select an assigned seat number from the visual matrix grid for Passenger #${i + 1}.`);
        return;
      }
    }

    const targetDay = new Date(searchDate).getDay();
    if (targetDay === 2 || targetDay === 4) { 
      alert("There are no active scheduled flights available on this specific date choice layout option. This flight route only operates on Mondays, Wednesdays, Fridays, and weekends!");
      return;
    }

    const windowSeatCount = passengers.filter(p => p.seatNumber.endsWith("A") || p.seatNumber.endsWith("F")).length;
    if (windowSeatCount > 2) {
      alert(`Limitation Warning: Only a maximum of 2 Window Seats can be selected per group order profile! Please re-allocate your selections.`);
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    const targetUserId = userId || localStorage.getItem("email") || "guest_user";
    setLoadingPayment(true);

    try {
      const response = await fetch(`${BASE_URL}/booking/flight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUserId,
          flightId: activeFlightId,
          seats: passengers.length,
          price: totalAmount,
          passengerName: passengers[0].name, 
          passengerAge: passengers[0].age,
          seatPreference: passengers[0].seatNumber.endsWith("A") || passengers[0].seatNumber.endsWith("F") ? "Window" : "Aisle",
          travelDate: searchDate,
          seatNumber: passengers[0].seatNumber,
          roster: passengers 
        }),
      });

      if (!response.ok) throw new Error("Backend transaction rejected.");
      alert("Payment Successful! Your flight booking is confirmed.");
      setShowPaymentModal(false);
      router.push("/profile"); 
    } catch (err: any) {
      alert(`Booking Failed: ${err.message}`);
    } finally {
      setLoadingPayment(false);
    }
  };

  const seatRows = [1, 2, 3, 4, 5, 6];
  const seatLetters = ["A", "B", "C", "D", "E", "F"];

  const sortedReviews = [...reviewsList].sort((a, b) => {
    if (reviewSortBy === "highest") return b.rating - a.rating;
    if (reviewSortBy === "helpful") return b.helpfulCount - a.helpfulCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-sm font-semibold text-slate-400 animate-pulse">Loading Flight Checkout Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-gray-800 text-xs text-left">
      
      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-200 px-12 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-xl text-red-500">✈️</span>
          <h1 className="text-xl font-bold text-gray-950">MakeMy<span className="text-blue-500">Tour</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded">ADMIN</span>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm border">
            {userEmailAddress ? userEmailAddress.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </header>

      {/* TASK REQUIREMENT: IN-LINE SEARCH FORM PANEL DISPLAY BOX AT TOP OF WORKSPACE */}
      <div className="w-full bg-slate-900 text-white py-5 px-12 shadow-md">
        <form onSubmit={handleInPageFlightSearch} className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">From Source City</label>
            <input type="text" value={searchFrom} onChange={(e) => setSearchFrom(e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white outline-none font-bold text-xs" placeholder="e.g. Paris" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">To Destination City</label>
            <input type="text" value={searchTo} onChange={(e) => setSearchTo(e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white outline-none font-bold text-xs" placeholder="e.g. Tokyo" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Departure Calendar Date</label>
            <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white outline-none font-bold text-xs" />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded text-xs uppercase tracking-wider transition-all">
            Find Available Flights
          </button>
        </form>

        {/* TASK REQUIREMENT: BOX-STYLE SEARCH INTERFACE SHOWING RICH FLIGHT CARD RESULTS DETAILS */}
        {hasSearchedInPage && (
          <div className="max-w-6xl w-full mx-auto mt-4 pt-4 border-t border-slate-800 space-y-2 animate-in fade-in duration-200">
            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wide mb-1">Operational Routes Found Inside Search Engine</h4>
            {filteredSearchResults.length === 0 ? (
              <p className="text-slate-500 text-xs py-2 font-medium">There are no operational flights matching this target city path array. Please try searching for "Paris" or "Tokyo".</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredSearchResults.map((item) => (
                  <div 
                    key={item._id} 
                    onClick={() => {
                      setActiveFlightId(item._id || String(item.id));
                      setHasSearchedInPage(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center gap-4 cursor-pointer transition-all bg-slate-800/80 ${activeFlightId === item._id ? 'border-blue-500 bg-slate-800 shadow-md ring-1 ring-blue-500' : 'border-slate-700 hover:border-slate-500'}`}
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 shadow-inner flex-shrink-0"><img src={item.imageUrl} alt="Flight thumb" className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white text-xs truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 capitalize font-semibold">{item.from} ➔ {item.to}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.timings}</p>
                    </div>
                    <div className="text-right flex-shrink-0"><p className="text-emerald-400 font-black text-xs">₹ {item.price?.toLocaleString() || "3,500"}</p><span className="text-[9px] bg-slate-700 px-1.5 py-0.2 rounded font-bold text-slate-300 uppercase block mt-1">Select</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CORE WRAPPER GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        
        {/* LEFT COLUMN: CORE CHECKOUT SEGMENTS & COMPLETE REVIEWS SYSTEM */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
              <div>
                {/* TASK REQUIREMENT: EXPLICIT GOLDEN STAR SYMBOL RATING ATTACHMENT */}
                <h2 className="text-lg font-bold flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-900 capitalize">
                  <span>{flight ? `${flight.from} ➔ ${flight.to}` : "Paris ➔ Tokyo"}</span>
                  <div className="flex items-center text-sm tracking-tighter" style={{ color: "#FFD700" }}>
                    <span>★★★★★</span>
                    <span className="text-slate-400 font-black text-[10px] tracking-normal ml-1">(4.8 Overall Score)</span>
                  </div>
                </h2>
                <p className="text-xs text-slate-400 mt-1">📅 Expected Travel Window • Non Stop • 3h 0m • Runs Daily</p>
              </div>
              <span className="text-xs font-medium text-blue-600 cursor-pointer hover:underline">View Fare Rules</span>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-md mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg shadow-sm">✈️</div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{flight ? flight.name : "SkyHigh 202"}</h3>
                <p className="text-xs text-slate-400">Airbus A320 • Economy • MMTSPECIAL • Available Seats: {flight ? flight.availableSeats : 32}</p>
              </div>
            </div>

            {/* Airport Timelines */}
            <div className="grid grid-cols-3 text-center py-4 my-2 relative">
              <div className="text-left">
                <p className="text-base font-bold text-gray-900">{flight?.timings ? flight.timings.split("➔")[0] : "03:41 PM"}</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{flight ? flight.from : "Paris"} Airport</p>
              </div>
              <div className="flex flex-col items-center justify-center px-4">
                <p className="text-xs text-slate-400 font-semibold">3h 0m</p>
                <div className="w-full h-0.5 bg-gray-200 my-1" />
                <p className="text-xs text-slate-400 font-medium">Non-stop</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-900">{flight?.timings ? flight.timings.split("➔")[1] : "06:41 PM"}</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{flight ? flight.to : "Tokyo"} Airport</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 border-t border-gray-100 pt-4 mt-4">
              <p>🧳 Cabin Baggage: <span className="text-gray-700 font-semibold">7 Kgs / Adult</span></p>
              <p>🧳 Check-in Baggage: <span className="text-gray-700 font-semibold">15 Kgs / Adult</span></p>
            </div>
          </div>

          {/* PASSENGER INDEXING FIELDSET LISTS */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">👨‍✈️ Passenger Profile Indexing</h3>
              <button type="button" onClick={handleAddPassengerRow} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-xs transition-colors">+ Add Passenger</button>
            </div>

            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} onClick={() => setActivePassengerIndex(index)} className={`p-4 border rounded-xl transition-all relative ${activePassengerIndex === index ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 bg-slate-50/40'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-gray-900">Passenger #{index + 1} {activePassengerIndex === index && "(Modifying Form)"}</span>
                    {passengers.length > 1 && (
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleRemovePassengerRow(index); }} className="text-[10px] text-red-500 font-bold hover:underline">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Passenger Name</label>
                      <input type="text" value={passenger.name} onChange={(e) => handlePassengerFieldChange(index, "name", e.target.value)} placeholder="First and last name" className="w-full border p-2 bg-white text-xs font-bold rounded-lg text-black outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Age Profile</label>
                      <input type="number" min={1} value={passenger.age} onChange={(e) => handlePassengerFieldChange(index, "age", parseInt(e.target.value) || 25)} className="w-full border p-2 bg-white text-xs font-bold rounded-lg text-black outline-none" />
                    </div>
                    
                    {/* TASK REQUIREMENT: THE ASSIGNED SEAT INPUT FIELD TRIGGERS A CALENDAR-STYLE POPUP SEAT PICKER BOX */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Assigned Flight Seat</label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePassengerIndex(index);
                          setShowSeatPickerIndex(showSeatPickerIndex === index ? null : index);
                        }}
                        className="w-full border p-2 bg-white text-xs font-black rounded-lg text-blue-600 font-mono text-left flex justify-between items-center shadow-sm border-gray-300"
                      >
                        <span>{passenger.seatNumber || "Select Allocation ➔"}</span>
                        <span>💺</span>
                      </button>

                      {showSeatPickerIndex === index && (
                        <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl p-4 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
                          <div className="flex justify-between items-center border-b pb-2 mb-3">
                            <span className="text-[10px] font-black uppercase text-gray-900">Choose Row Preference (#{index + 1})</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setShowSeatPickerIndex(null); }} className="text-gray-400 text-xs hover:text-black">✕</button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="grid grid-cols-6 gap-1 text-center font-bold text-[9px] text-slate-400 mb-1">
                              {seatLetters.map((l) => <span key={l}>{l}</span>)}
                            </div>
                            
                            {seatRows.map((row) => (
                              <div key={row} className="grid grid-cols-6 gap-1">
                                {seatLetters.map((letter) => {
                                  const currentSeatCode = `${row}${letter}`;
                                  const isClaimedBySomeoneElse = passengers.some((p, idx) => idx !== index && p.seatNumber === currentSeatCode);
                                  const isClaimedByMe = passenger.seatNumber === currentSeatCode;

                                  return (
                                    <button
                                      key={letter}
                                      type="button"
                                      disabled={isClaimedBySomeoneElse}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePassengerFieldChange(index, "seatNumber", currentSeatCode);
                                        setShowSeatPickerIndex(null); 
                                      }}
                                      className={`p-1.5 rounded font-mono text-[9px] font-black border text-center transition-all ${
                                        isClaimedByMe 
                                          ? 'bg-blue-600 text-white border-blue-600 shadow' 
                                          : isClaimedBySomeoneElse 
                                            ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed' 
                                            : 'bg-white hover:bg-blue-50 border-gray-200 text-gray-800'
                                      }`}
                                    >
                                      {currentSeatCode}
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CANCELLATION AND DATE CHANGE POLICY DISPLAYS */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">🛡️ Cancellation & Date Change Policy</h3>
              <span className="text-xs text-blue-500 cursor-pointer font-medium hover:underline">View Policy</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-md flex items-center justify-between mb-4 text-xs">
              <span className="font-semibold flex items-center gap-1 uppercase">✈️ {flight ? `${flight.from.slice(0,3)}-${flight.to.slice(0,3)}` : "PAR-TOK"}</span>
              <span className="font-bold text-gray-900">₹ {calculatedBase.toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-orange-400 to-red-400 rounded-full relative my-6">
              <div className="absolute -bottom-5 left-0 text-[10px] text-slate-400">Now</div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">24 Hours Before</div>
              <div className="absolute -bottom-5 right-0 text-[10px] text-slate-400">Departure</div>
            </div>
          </div>

          {/* PROMO MARKETING OFFERS */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-gray-900">🎁 Book a Flight & unlock these offers</h3>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">Flyer Exclusive Deal</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-28 rounded-lg overflow-hidden relative border border-gray-100 shadow-sm">
                <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=80" alt="Offer 1" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] px-2 py-0.5 rounded font-bold">Best Seller</span>
              </div>
              <div className="h-28 rounded-lg overflow-hidden relative border border-gray-100 shadow-sm">
                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80" alt="Offer 2" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] px-2 py-0.5 rounded font-bold">Resort Credits</span>
              </div>
              <div className="h-28 rounded-lg overflow-hidden relative border border-gray-100 shadow-sm">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" alt="Offer 3" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] px-2 py-0.5 rounded font-bold">Exclusive Deal</span>
              </div>
            </div>
          </div>

          {/* TASK REQUIREMENT: TASK 2 COMPREHENSIVE EMBEDDED REVIEWS & RATINGS SYSTEM */}
          <div className="w-full bg-white border rounded-xl p-6 shadow-sm text-left space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-wide">💬 Customer Reviews for {flight ? flight.name : "This Flight"}</h3>
                <p className="text-[10px] text-slate-400 font-medium">Read true traveler perspectives or contribute your review pass</p>
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-500">
                <span>Filter Sort:</span>
                <select value={reviewSortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-1 rounded bg-slate-50 font-bold text-black outline-none">
                  <option value="newest">📅 Newest First</option>
                  <option value="highest">⭐ Highest Stars</option>
                  <option value="helpful">👍 Most Helpful</option>
                </select>
              </div>
            </div>

            {/* REVIEW INPUT SUBMISSION BOX ROW */}
            <form onSubmit={handleAddNewReviewRecord} className="p-4 rounded-xl bg-slate-50 border space-y-3 shadow-inner">
              <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider">Leave your travel score review</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Select Rating Allotment</label>
                  <div className="flex gap-0.5 text-base">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setInputRating(s)} className={`transition-transform active:scale-90 ${s <= inputRating ? 'text-amber-400' : 'text-slate-300'}`}>★</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Optional Image URL Link</label>
                  <input type="text" placeholder="Paste verification picture link..." value={inputPhotoUrl} onChange={(e) => setInputPhotoUrl(e.target.value)} className="w-full border p-1 rounded bg-white font-medium outline-none text-black" />
                </div>
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Detailed Feedback Comments</label>
                <textarea rows={2} placeholder="Type your experience regarding seating comfort, crew response, legroom spaces..." value={inputComment} onChange={(e) => setInputComment(e.target.value)} className="w-full border p-2 bg-white rounded-lg text-black outline-none font-medium resize-none" />
              </div>
              <button type="submit" className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 font-bold uppercase rounded text-[10px] tracking-wide shadow-sm transition-all">Submit Feedback</button>
            </form>

            {/* LIST ACTIVE REVIEWS DOCS */}
            <div className="space-y-4 pt-1">
              {sortedReviews.length === 0 ? (
                <p className="text-center font-medium text-slate-400 py-4 border border-dashed rounded-lg">No customer review documentation posted for this flight reference index yet.</p>
              ) : (
                sortedReviews.map((rev) => (
                  <div key={rev.id} className={`p-4 border rounded-xl bg-white space-y-2 ${rev.flagged ? 'border-orange-200 bg-orange-50/10' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-black text-gray-900 capitalize">{rev.userName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-amber-400 font-bold font-mono">{"★".repeat(rev.rating)}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 font-bold text-[9px] text-slate-400">
                        <button type="button" onClick={() => handleUpvoteHelpfulCount(rev.id)} className="hover:text-blue-600">👍 Upvote ({rev.helpfulCount})</button>
                        <span>•</span>
                        <button type="button" onClick={() => handleFlagContentInappropriate(rev.id)} className="hover:text-red-500">🚩 Flag Review</button>
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium leading-relaxed">{rev.comment}</p>
                    
                    {rev.photos && rev.photos[0] && (
                      <div className="w-24 h-16 border rounded overflow-hidden mt-1 shadow-inner"><img src={rev.photos[0]} alt="attach" className="w-full h-full object-cover" /></div>
                    )}

                    {/* CONVERSATIONAL THREADS SECTION REPLIES */}
                    <div className="pl-3 border-l-2 border-slate-100 space-y-1.5 mt-2">
                      {rev.replies && rev.replies.map((rep, rIdx) => (
                        <div key={rIdx} className="p-2 rounded bg-slate-50 text-slate-600 font-medium">
                          <span className="font-bold text-gray-900 capitalize block">{rep.user}:</span>
                          <span>{rep.text}</span>
                        </div>
                      ))}

                      {activeReplyBoxId === rev.id ? (
                        <div className="flex gap-1.5 pt-1">
                          <input type="text" placeholder="Type reply text..." value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 border p-1 rounded font-medium text-black bg-white outline-none" />
                          <button type="button" onClick={() => handlePostReplySubmission(rev.id)} className="bg-slate-800 text-white font-bold px-2 rounded uppercase text-[9px]">Post</button>
                          <button type="button" onClick={() => setActiveReplyBoxId(null)} className="text-slate-400 hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setActiveReplyBoxId(rev.id)} className="text-[10px] text-blue-500 font-bold hover:underline block pt-0.5">💬 Reply to Thread</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: FARE SUMMARY COLUMN */}
        <div className="space-y-6 text-left">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-8">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4">📋 Fare Summary</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Base Fare ({passengers.length} Tickets)</span>
                <span className="font-semibold text-gray-900">₹ {calculatedBase.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Taxes and Surcharges</span>
                <span className="font-semibold text-gray-900">₹ {taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Other Services</span>
                <span className="font-semibold text-gray-900">₹ {otherServices.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discounts</span>
                <span className="font-bold">- ₹ {discount.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-base text-gray-950 font-black">₹ {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleValidateCheckoutFlow}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded shadow mt-6 text-xs uppercase tracking-wider transition-all"
            >
              Proceed to Payment
            </button>
          </div>

          {/* PROMO CODES */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h4 className="font-bold text-xs text-gray-900 mb-3 uppercase tracking-wider">🎁 Promo Codes</h4>
            <input type="text" placeholder="Enter promo code here" className="w-full border border-gray-200 rounded p-2.5 text-xs mb-4 outline-none uppercase font-semibold text-slate-700 bg-slate-50" />
            <div className="space-y-3 text-left">
              
              <div className="border border-dashed border-gray-200 p-3 rounded-md bg-slate-50/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="promoGroup" defaultChecked className="mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">MMTSECURE</span>
                    <span className="text-[11px] text-slate-400 mt-1 block leading-relaxed">Get an instant discount of ₹299 on your flight booking and Trip Secure with this coupon!</span>
                  </div>
                </label>
              </div>

              <div className="border border-dashed border-gray-200 p-3 rounded-md bg-slate-50/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="promoGroup" className="mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">SPECIALUPI</span>
                    <span className="text-[11px] text-slate-400 mt-1 block leading-relaxed">Use this code and get ₹362 instant discount on payments via UPI only!</span>
                  </div>
                </label>
              </div>

            </div>
          </div>
        </div>

        {/* SECURE PAYMENT POPUP OVERLAY */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-xs text-left">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
                <h3 className="text-base font-bold text-gray-900">💳 Select Payment Method</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
              </div>
              
              <div className="space-y-3 mb-6">
                <div onClick={() => setPaymentMethod("UPI")} className={`p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-blue-500 bg-blue-50/40' : 'border-gray-200 hover:bg-slate-50'}`}>
                  <input type="radio" checked={paymentMethod === 'UPI'} readOnly />
                  <div>
                    <p className="font-bold text-gray-900">Instant UPI Interface</p>
                    <p className="text-[10px] text-slate-400">Pay securely via PhonePe, GPay, or NetBanking systems</p>
                  </div>
                </div>

                <div onClick={() => setPaymentMethod("Card")} className={`p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-blue-500 bg-blue-50/40' : 'border-gray-200 hover:bg-slate-50'}`}>
                  <input type="radio" checked={paymentMethod === 'Card'} readOnly />
                  <div>
                    <p className="font-bold text-gray-900">Credit / Debit Card Security</p>
                    <p className="text-[10px] text-slate-400">All global card payment processors accepted</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border rounded-lg p-3 mb-6 flex justify-between font-bold text-gray-900">
                <span>Payable Amount Due:</span>
                <span className="text-blue-600">₹ {totalAmount.toLocaleString()}</span>
              </div>

              <button 
                onClick={handlePaymentSubmit} 
                disabled={loadingPayment}
                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white font-bold py-3 rounded shadow uppercase tracking-wide text-xs transition-all"
              >
                {loadingPayment ? "Authorizing Funds..." : `Pay via ${paymentMethod}`}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* DYNAMIC TRAINING SPECIFICATION FOOTER HUB */}
      <footer className="bg-[#0b122c] text-slate-400 text-xs py-12 px-12 mt-auto border-t border-slate-900/60">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-8 border-b border-slate-800/60 pb-8">
          <div className="space-y-2">
            <h5 className="text-white font-bold text-sm">Why MakeMyTour?</h5>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Established in 2000, MakeMyTour has since positioned itself as one of the leading companies, providing great offers, competitive airfares, exclusive discounts, and a seamless online booking experience.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="text-white font-bold text-sm">Booking Flights with MakeMyTour</h5>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Book your flight tickets with India's leading flight booking company. Get best deals on flights, train tickets, buses, hotels and holiday packages.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="text-white font-bold text-sm">Domestic Flights with MakeMyTour</h5>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              MakeMyTour is India's leading player for flight bookings. With the cheapest fare guarantee, experience great value at the lowest price.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-[11px]">
            <div>
              <h6 className="text-white font-bold mb-1.5 uppercase tracking-wider">ABOUT THE SITE</h6>
              <div className="space-y-0.5 text-slate-400">
                <p className="hover:text-white cursor-pointer transition-colors">About Us</p>
                <p className="hover:text-white cursor-pointer transition-colors">Investor Relations</p>
                <p className="hover:text-white cursor-pointer transition-colors">Careers</p>
              </div>
            </div>
            <div>
              <h6 className="text-white font-bold mb-1.5 uppercase tracking-wider">IMPORTANT LINKS</h6>
              <div className="space-y-0.5 text-slate-400">
                <p className="hover:text-white cursor-pointer transition-colors">Privacy Policy</p>
                <p className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</p>
                <p className="hover:text-white cursor-pointer transition-colors">User Agreement</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center text-slate-500 text-[11px]">
          <p>© 2026 MakeMyTour PVT. LTD. All rights reserved</p>
          <span className="font-bold text-slate-600 tracking-wider">NULCLASS EDITION</span>
        </div>
      </footer>

    </div>
  );
}