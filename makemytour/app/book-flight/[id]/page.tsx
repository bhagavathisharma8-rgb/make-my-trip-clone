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
}

interface Passenger {
  name: string;
  age: number;
  seatNumber: string;
}

export default function BookFlightPage() {
  const { id } = useParams();
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [userEmailAddress, setUserEmailAddress] = useState("");
  
  // TASK REQUIREMENT: Dynamic multi-passenger state management initialized with 1 member
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: "", age: 25, seatNumber: "" }
  ]);
  const [activePassengerIndex, setActivePassengerIndex] = useState<number>(0);
  
  // Custom interactive tracking states
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [travelDate, setTravelDate] = useState("2026-07-15");

  // Dynamic Flight Inventory State
  const [flight, setFlight] = useState<FlightDetails | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Fare breakdown parameters
  const taxes = 1374;
  const otherServices = 249;
  const discount = 250;
  
  // FIXED PERMANENTLY: Environment Aware API Router Link Switcher
  const BASE_URL = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8081"
    : "https://make-my-trip-clone-qaq2.onrender.com";

  // FIXED: Defensive price structure maps any field naming variant from your MongoDB collection documents
  const basePricePerTicket = flight 
    ? (Number(flight.price) || Number(flight.fare) || Number(flight.ticketPrice) || 3500) 
    : 3500;

  // TASK REQUIREMENT: Base Fare and Total Amount metrics scale dynamically with the size of your passenger array roster
  const calculatedBase = basePricePerTicket * passengers.length;
  const totalAmount = calculatedBase + taxes + otherServices - discount;

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (!savedEmail) {
      alert("Please log in first to checkout flights!");
      router.push("/");
      return;
    }
    setUserEmailAddress(savedEmail);

    // Pipeline 1: Pull the User's Real ID Document mapping safely using dynamic URL roots
    fetch(`${BASE_URL}/user/${encodeURIComponent(savedEmail)}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to resolve user details.");
      })
      .then((data) => {
        const resolvedUid = data.id || data._id || data.uid;
        if (resolvedUid) {
          setUserId(resolvedUid);
        } else {
          setUserId(data.email || savedEmail);
        }
      })
      .catch((err) => {
        console.error("User resolve error:", err);
        setUserId(savedEmail);
      });

    // Pipeline 2: Pull flight data from database matching current routing ID parameter
    fetch(`${BASE_URL}/admin/flights`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch flight inventory.");
      })
      .then((flights: FlightDetails[]) => {
        const matchedFlight = flights.find((f) => String(f._id) === String(id) || String(f.id) === String(id));
        if (matchedFlight) {
          setFlight(matchedFlight);
        }
        setLoadingData(false);
      })
      .catch((err) => {
        console.error("Flight details fetch error:", err);
        setLoadingData(false);
      });
  }, [id, router, BASE_URL]);

  // TASK REQUIREMENT: Append co-passengers to array up to a maximum limit of 8
  const handleAddPassengerRow = () => {
    if (passengers.length >= 8) {
      alert("Limitation Warning: You can add a maximum of 8 passengers per booking transaction order block!");
      return;
    }
    setPassengers([...passengers, { name: "", age: 25, seatNumber: "" }]);
    setActivePassengerIndex(passengers.length);
  };

  const handleRemovePassengerRow = (index: number) => {
    if (passengers.length === 1) return;
    const update = [...passengers];
    update.splice(index, 1);
    setPassengers(update);
    setActivePassengerIndex(0);
  };

  const handlePassengerFieldChange = (index: number, field: keyof Passenger, value: any) => {
    const update = [...passengers];
    update[index] = { ...update[index], [field]: value };
    setPassengers(update);
  };

  // TASK REQUIREMENT: Comprehensive seat preference allocation verification checks
  const handleValidateCheckoutFlow = () => {
    if (!travelDate) {
      alert("Please choose a valid travel date from the calendar option menu.");
      return;
    }

    // Verify all passenger names are filled
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

    // TASK REQUIREMENT: Flight Operational Schedule Weekday Validation Rules
    const targetDay = new Date(travelDate).getDay();
    // Simulates non-operational days (e.g., Tuesdays and Thursdays remain locked)
    if (targetDay === 2 || targetDay === 4) { 
      alert("There are no active scheduled flights available on this specific date layout choice. This flight route only operates on Mondays, Wednesdays, Fridays, and weekends!");
      return;
    }

    // TASK REQUIREMENT: Cap Window preferences to a maximum allotment of 2 selections across the group
    const windowSeatCount = passengers.filter(p => p.seatNumber.endsWith("A") || p.seatNumber.endsWith("F")).length;
    if (windowSeatCount > 2) {
      alert(`Limitation Warning: Only a maximum of 2 Window Seats can be selected per group order profile! You currently have ${windowSeatCount} window seats claimed. Please re-allocate your selections.`);
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
          flightId: id,
          seats: passengers.length,
          price: totalAmount,
          passengerName: passengers[0].name, 
          passengerAge: passengers[0].age,
          seatPreference: passengers[0].seatNumber.endsWith("A") || passengers[0].seatNumber.endsWith("F") ? "Window" : "Aisle",
          travelDate: travelDate,
          seatNumber: passengers[0].seatNumber,
          roster: passengers // Sends full array down to backend database
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Backend failed to create booking entry.");
      }

      alert("Payment Successful! Your flight booking is confirmed.");
      setShowPaymentModal(false);
      router.push("/profile"); 
    } catch (err: any) {
      console.error(err);
      alert(`Booking Failed: ${err.message}`);
    } finally {
      setLoadingPayment(false);
    }
  };

  // Helper arrays to build an interactive 6x4 layout grid map matrix
  const seatRows = [1, 2, 3, 4, 5, 6];
  const seatLetters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-gray-800">
      
      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-200 px-12 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-xl text-red-500">✈️</span>
          <h1 className="text-xl font-bold text-gray-950">MakeMy<span className="text-blue-500">Tour</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded">ADMIN</span>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm">
            {userEmailAddress ? userEmailAddress.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </header>

      {/* CORE WRAPPER GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        
        {/* LEFT COLUMN: CORE FLIGHT DETAILS & PASSEGER ROSTER */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-3 text-gray-900 capitalize">
                  {flight ? `${flight.from} ➔ ${flight.to}` : "Paris ➔ Tokyo"}
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase tracking-wide">Cancellation Fees Apply</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">📅 July 12, 2026 at 03:41 PM • Non Stop • 3h 0m • Runs Daily</p>
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
                <p className="text-base font-bold text-gray-900">03:41 PM</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{flight ? flight.from : "Paris"} International Airport</p>
              </div>
              <div className="flex flex-col items-center justify-center px-4">
                <p className="text-xs text-slate-400 font-semibold">3h 0m</p>
                <div className="w-full h-0.5 bg-gray-200 my-1" />
                <p className="text-xs text-slate-400 font-medium">Non-stop</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-900">06:41 PM</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{flight ? flight.to : "Tokyo"} Airport</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 border-t border-gray-100 pt-4 mt-4">
              <p>🧳 Cabin Baggage: <span className="text-gray-700 font-semibold">7 Kgs / Adult</span></p>
              <p>🧳 Check-in Baggage: <span className="text-gray-700 font-semibold">15 Kgs / Adult</span></p>
            </div>
          </div>

          {/* TASK REQUIREMENT: ENHANCED PASSEGER DETAIL FIELDS WITH MAX 8 CAPS */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">👨‍✈️ Passenger Information & Travel Date</h3>
              <button 
                type="button"
                onClick={handleAddPassengerRow}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-xs transition-colors"
              >
                + Add Passenger
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Target Departure Travel Date</label>
              <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full md:w-1/2 border p-2 bg-slate-50 text-black text-xs font-semibold rounded-lg outline-none" />
            </div>

            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div 
                  key={index} 
                  onClick={() => setActivePassengerIndex(index)}
                  className={`p-4 border rounded-xl transition-all relative cursor-pointer ${activePassengerIndex === index ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 bg-slate-50/40'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-gray-900">Passenger #{index + 1} {activePassengerIndex === index && "(Selecting Seat)"}</span>
                    {passengers.length > 1 && (
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleRemovePassengerRow(index); }} className="text-[10px] text-red-500 font-bold hover:underline">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Passenger Full Name</label>
                      <input type="text" value={passenger.name} onChange={(e) => handlePassengerFieldChange(index, "name", e.target.value)} placeholder="First and last name" className="w-full border p-2 bg-white text-xs font-bold rounded-lg text-black outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Age</label>
                      <input type="number" min={1} value={passenger.age} onChange={(e) => handlePassengerFieldChange(index, "age", parseInt(e.target.value) || 25)} className="w-full border p-2 bg-white text-xs font-bold rounded-lg text-black outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Assigned Seat</label>
                      <input type="text" value={passenger.seatNumber || "Click map down below..."} readOnly className="w-full border p-2 bg-slate-100 text-xs font-black rounded-lg text-blue-600 font-mono outline-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TASK REQUIREMENT: COMPLETELY INTERACTIVE DYNAMIC MATRIX SEAT GRID DESIGN */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left space-y-4">
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wide border-b pb-2">💺 Interactive Flight Cabin Layout Grid Map</h4>
            <p className="text-[11px] text-slate-400 font-medium">Click on any open seat box down below to assign it to **Passenger #{activePassengerIndex + 1}** ({passengers[activePassengerIndex]?.name || "Name not set yet"}). Columns A and F are window seats.</p>
            
            <div className="max-w-md mx-auto p-4 border rounded-xl bg-slate-50/60 shadow-inner space-y-3">
              <div className="grid grid-cols-6 gap-2 text-center font-bold text-[10px] text-slate-400">
                {seatLetters.map((l) => <span key={l}>{l}</span>)}
              </div>
              
              {seatRows.map((row) => (
                <div key={row} className="grid grid-cols-6 gap-2">
                  {seatLetters.map((letter) => {
                    const currentSeatCode = `${row}${letter}`;
                    const isClaimedBySomeoneElse = passengers.some((p, idx) => idx !== activePassengerIndex && p.seatNumber === currentSeatCode);
                    const isClaimedByMe = passengers[activePassengerIndex]?.seatNumber === currentSeatCode;

                    return (
                      <button
                        key={letter}
                        type="button"
                        disabled={isClaimedBySomeoneElse}
                        onClick={() => handlePassengerFieldChange(activePassengerIndex, "seatNumber", currentSeatCode)}
                        className={`p-2 rounded font-mono text-[10px] font-black transition-all border text-center ${
                          isClaimedByMe 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                            : isClaimedBySomeoneElse 
                              ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                              : 'bg-white hover:bg-blue-50 border-gray-300 text-gray-800'
                        }`}
                      >
                        {currentSeatCode}
                      </button>
                    );
                  })}
                </div>
              ))}

              <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-200 text-[10px] font-bold text-slate-400">
                <div className="flex items-center gap-1"><span className="w-3 h-3 border rounded bg-white" /> Open</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-600" /> Selected</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-200" /> Taken</div>
              </div>
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

        {/* SECURE PAYMENT METHOD SELECTOR OVERLAY MODAL */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs text-left">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-base font-black text-gray-900">💳 Select Payment Method</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
              </div>
              
              <div className="space-y-3 mb-6">
                <div onClick={() => setPaymentMethod("UPI")} className={`p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-blue-500 bg-blue-50/40' : 'border-gray-200 hover:bg-slate-50'}`}>
                  <input type="radio" checked={paymentMethod === 'UPI'} readOnly />
                  <div>
                    <p className="font-bold text-gray-900">Instant UPI Interface</p>
                    <p className="text-[10px] text-slate-400">Pay securely via PhonePe, BHIM, GPay, or Paytm apps</p>
                  </div>
                </div>

                <div onClick={() => setPaymentMethod("Card")} className={`p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-blue-500 bg-blue-50/40' : 'border-gray-200 hover:bg-slate-50'}`}>
                  <input type="radio" checked={paymentMethod === 'Card'} readOnly />
                  <div>
                    <p className="font-bold text-gray-900">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-400">All major international and domestic card networks active</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border rounded-lg p-3 mb-6 flex justify-between font-bold text-gray-900">
                <span>Total Amount Due:</span>
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