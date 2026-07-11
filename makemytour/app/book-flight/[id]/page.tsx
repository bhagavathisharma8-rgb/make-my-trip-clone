"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface FlightDetails {
  _id?: string;
  id?: string;
  name?: string;
  flightName?: string;
  from?: string;
  to?: string;
  price?: number;
  ticketPrice?: number;
  fare?: number;
  availableSeats?: number;
}

export default function BookFlightPage() {
  const { id } = useParams();
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tickets, setTickets] = useState(1);
  const [userId, setUserId] = useState("");
  
  // Dynamic Flight Inventory State
  const [flight, setFlight] = useState<FlightDetails | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Fare breakdown parameters
  const taxes = 1374;
  const otherServices = 249;
  const discount = 250;
  
  // FIXED: Defensive fallbacks to prevent ₹0 base fare bugs
  const flightPrice = flight ? (flight.price || flight.ticketPrice || flight.fare || 3500) : 3500;
  const calculatedBase = flightPrice * tickets;
  const totalAmount = calculatedBase + taxes + otherServices - discount;

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (!savedEmail) {
      alert("Please log in first to checkout flights!");
      router.push("/");
      return;
    }

    // Pipeline 1: Pull the User's Real ID Document mapping
    fetch(`https://make-my-trip-clone-qaq2.onrender.com/user/${encodeURIComponent(savedEmail)}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to resolve user details.");
      })
      .then((data) => {
        // FIXED: Checks both standard JSON id and raw Mongo _id formats to ensure session validity
        const resolvedUid = data.id || data._id;
        if (resolvedUid) {
          setUserId(resolvedUid);
        } else {
          console.error("User document parsed successfully but contains no usable ID token key.");
        }
      })
      .catch((err) => console.error("User resolve error:", err));

    // Pipeline 2: Pull flight data from database matching current routing ID parameter
    fetch("https://make-my-trip-clone-qaq2.onrender.com/admin/flights")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch flight inventory.");
      })
      .then((flights: FlightDetails[]) => {
        const matchedFlight = flights.find((f) => f._id === id || f.id === id);
        if (matchedFlight) {
          setFlight(matchedFlight);
        }
        setLoadingData(false);
      })
      .catch((err) => {
        console.error("Flight details fetch error:", err);
        setLoadingData(false);
      });
  }, [id, router]);

  const handlePaymentSubmit = async () => {
    if (!userId) {
      alert("Your user session couldn't be validated. Please log in again.");
      return;
    }

    setLoadingPayment(true);

    try {
      const response = await fetch("https://make-my-trip-clone-qaq2.onrender.com/booking/flight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          flightId: id,
          seats: tickets,
          price: totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend failed to create booking entry.");
      }

      alert("Payment Successful! Your flight booking is confirmed.");
      setShowPaymentModal(false);
      router.push("/profile"); // Instantly navigate to dashboard tracking view
    } catch (err) {
      console.error(err);
      alert("Failed to record booking with database. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-sm font-semibold text-slate-400 animate-pulse">Loading Selected Route Details...</p>
      </div>
    );
  }

  // Helper variables for dynamic formatting
  const displayFrom = flight?.from || "Paris";
  const displayTo = flight?.to || "Tokyo";
  const displayFlightName = flight?.name || flight?.flightName || "SkyHigh 202";

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
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm">U</div>
        </div>
      </header>

      {/* CORE WRAPPER GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        
        {/* LEFT COLUMN: CORE FLIGHT DETAILS & POLICIES */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-3 text-gray-900 capitalize">
                  {displayFrom} ➔ {displayTo}
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase tracking-wide">Cancellation Fees Apply</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">📅 January 21, 2025 at 03:41 PM • Non Stop • 3h 0m</p>
              </div>
              <span className="text-xs font-medium text-blue-600 cursor-pointer hover:underline">View Fare Rules</span>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-md mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg shadow-sm">✈️</div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 capitalize">{displayFlightName}</h3>
                <p className="text-xs text-slate-400">Airbus A320 • Economy • MMTSPECIAL • Available Seats: {flight?.availableSeats ?? 45}</p>
              </div>
            </div>

            {/* Airport Timelines */}
            <div className="grid grid-cols-3 text-center py-4 my-2 relative">
              <div className="text-left">
                <p className="text-base font-bold text-gray-900">January 21, 2025 at 03:41 PM</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{displayFrom} International Airport</p>
              </div>
              <div className="flex flex-col items-center justify-center px-4">
                <p className="text-xs text-slate-400 font-semibold">3h 0m</p>
                <div className="w-full h-0.5 bg-gray-200 my-1" />
                <p className="text-xs text-slate-400 font-medium">Non-stop</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-900">January 23, 2025 at 04:43 PM</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{displayTo} Airport</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 border-t border-gray-100 pt-4 mt-4">
              <p>🧳 Cabin Baggage: <span className="text-gray-700 font-semibold">7 Kgs / Adult</span></p>
              <p>🧳 Check-in Baggage: <span className="text-gray-700 font-semibold">15 Kgs / Adult</span></p>
            </div>
          </div>

          {/* CANCELLATION AND DATE CHANGE POLICY DISPLAYS */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">🛡️ Cancellation & Date Change Policy</h3>
              <span className="text-xs text-blue-500 cursor-pointer font-medium hover:underline">View Policy</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-md flex items-center justify-between mb-4 text-xs">
              <span className="font-semibold flex items-center gap-1 uppercase">✈️ {displayFrom.slice(0,3)}-{displayTo.slice(0,3)}</span>
              <span className="font-bold text-gray-900">₹ {calculatedBase.toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-orange-400 to-red-400 rounded-full relative my-6">
              <div className="absolute -bottom-5 left-0 text-[10px] text-slate-400">Now</div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">24 Hours Before</div>
              <div className="absolute -bottom-5 right-0 text-[10px] text-slate-400">Departure</div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: FARE SUMMARY COLUMN */}
        <div className="space-y-6 text-left">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-8">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4">📋 Fare Summary</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Base Fare</span>
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
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded shadow mt-6 text-xs uppercase tracking-wider transition-all"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* PAYMENT POPUP OVERLAY */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-xs text-left">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl p-6 relative">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
                <h3 className="text-base font-bold text-gray-900">✈️ Flight Booking Details</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                <div><label className="block text-gray-400 font-medium mb-0.5">Flight Name</label><p className="font-semibold text-gray-900 capitalize">{displayFlightName}</p></div>
                <div><label className="block text-gray-400 font-medium mb-0.5">From</label><p className="font-semibold text-gray-900 capitalize">{displayFrom}</p></div>
                <div><label className="block text-gray-400 font-medium mb-0.5">To</label><p className="font-semibold text-gray-900 capitalize">{displayTo}</p></div>
                <div><label className="block text-gray-400 font-medium mb-0.5">Departure Time</label><p className="font-semibold text-gray-900">1/21/2025 3:41:00 PM</p></div>
                <div><label className="block text-gray-400 font-medium mb-0.5">Arrival Time</label><p className="font-semibold text-gray-900">1/23/2025 4:43:00 PM</p></div>
                <div>
                  <label className="block text-gray-400 font-medium mb-0.5">Number of Tickets</label>
                  <input type="number" value={tickets} onChange={(e) => setTickets(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 border border-gray-300 rounded px-2 py-1 mt-0.5 bg-white font-medium text-black outline-none" />
                </div>
              </div>
              <div className="bg-slate-50 border border-gray-100 rounded-md p-4 mb-6">
                <h4 className="font-bold text-gray-900 mb-3">📋 Fare Summary</h4>
                <div className="space-y-2 text-gray-500">
                  <div className="flex justify-between"><span>Base Fare</span><span>₹ {calculatedBase.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Taxes and Surcharges</span><span>₹ {taxes.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Other Services</span><span>₹ {otherServices.toLocaleString()}</span></div>
                  <div className="flex justify-between text-emerald-600"><span>Discounts</span><span>- ₹ {discount.toLocaleString()}</span></div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-sm">
                    <span>Total Amount</span><span>₹ {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handlePaymentSubmit} 
                disabled={loadingPayment}
                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white font-bold py-3 rounded shadow uppercase tracking-wide text-xs transition-all"
              >
                {loadingPayment ? "Confirming Reservation..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 text-slate-400 text-xs py-12 px-12 border-t border-slate-900 mt-auto">
        <div className="max-w-6xl w-full mx-auto pt-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[11px]">
          <p>© 2026 MakeMyTour PVT. LTD. All rights reserved</p>
          <span className="font-semibold tracking-widest text-slate-700 uppercase">NULCLASS EDITION</span>
        </div>
      </footer>

    </div>
  );
}