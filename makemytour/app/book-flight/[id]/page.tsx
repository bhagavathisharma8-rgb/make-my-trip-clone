"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BookFlightPage() {
  const { id } = useParams();
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tickets, setTickets] = useState(1);

  // MATCHES EXACT VALUES FROM IMAGE 1 (₹5,373 TOTAL)
  const singleBaseFare = 3500;
  const taxes = 1374;
  const otherServices = 249;
  const discount = 250;
  
  const calculatedBase = singleBaseFare * tickets;
  const totalAmount = calculatedBase + taxes + otherServices - discount;

  const handlePaymentSubmit = () => {
    alert("Payment Successful! Your flight booking is confirmed.");
    setShowPaymentModal(false);
    router.push("/");
  };

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
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm">J</div>
        </div>
      </header>

      {/* CORE WRAPPER GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        
        {/* LEFT COLUMN: CORE FLIGHT DETAILS & POLICIES */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Content card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-3 text-gray-900">
                  Paris ➔ Tokyo
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase tracking-wide">Cancellation Fees Apply</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">📅 January 21, 2025 at 03:41 PM • Non Stop • 3h 0m</p>
              </div>
              <span className="text-xs font-medium text-blue-600 cursor-pointer hover:underline">View Fare Rules</span>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-md mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg shadow-sm">✈️</div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">SkyHigh 202</h3>
                <p className="text-xs text-slate-400">IX 2747 • Airbus A320 • Economy • MMTSPECIAL</p>
              </div>
            </div>

            {/* Airport Timelines */}
            <div className="grid grid-cols-3 text-center py-4 my-2 relative">
              <div className="text-left">
                <p className="text-base font-bold text-gray-900">January 21, 2025 at 03:41 PM</p>
                <p className="text-xs text-slate-400 mt-0.5">Paris International Airport, Terminal T2</p>
              </div>
              <div className="flex flex-col items-center justify-center px-4">
                <p className="text-xs text-slate-400 font-semibold">3h 0m</p>
                <div className="w-full h-0.5 bg-gray-200 my-1" />
                <p className="text-xs text-slate-400 font-medium">Non-stop</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-900">January 23, 2025 at 04:43 PM</p>
                <p className="text-xs text-slate-400 mt-0.5">Tokyo International Airport, Terminal T3</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 border-t border-gray-100 pt-4 mt-4">
              <p>🧳 Cabin Baggage: <span className="text-gray-700 font-semibold">7 Kgs / Adult</span></p>
              <p>🧳 Check-in Baggage: <span className="text-gray-700 font-semibold">15 Kgs (1 piece only) / Adult</span></p>
            </div>
          </div>

          {/* CANCELLATION AND DATE CHANGE POLICY SLIDER DISPLAY */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">🛡️ Cancellation & Date Change Policy</h3>
              <span className="text-xs text-blue-500 cursor-pointer font-medium hover:underline">View Policy</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-md flex items-center justify-between mb-4 text-xs">
              <span className="font-semibold flex items-center gap-1">✈️ BLR-DEL</span>
              <span className="font-bold text-gray-900">₹ 4,300</span>
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-orange-400 to-red-400 rounded-full relative my-6">
              <div className="absolute -bottom-5 left-0 text-[10px] text-slate-400">Now</div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">16 Jan, 15:55</div>
              <div className="absolute -bottom-5 right-0 text-[10px] text-slate-400">16 Jan, 17:55</div>
            </div>
          </div>

          {/* ADDED EXACTLY 3 PROMO OFFERS IMAGES */}
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

          {/* PROMO CODES */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h4 className="font-bold text-xs text-gray-900 mb-3 uppercase tracking-wider">🎁 Promo Codes</h4>
            <input type="text" placeholder="Enter promo code here" className="w-full border border-gray-200 rounded p-2.5 text-xs mb-4 outline-none uppercase font-semibold text-slate-700 bg-slate-50" />
            
            <div className="space-y-3">
              <div className="border border-dashed border-gray-200 p-3 rounded-md bg-slate-50/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" defaultChecked className="mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">MMTSECURE</span>
                    <span className="text-[11px] text-slate-400 mt-1 block leading-relaxed">Get an instant discount of ₹299 on your flight booking and Trip Secure with this coupon!</span>
                    <span className="text-[10px] text-blue-500 font-bold block mt-1 hover:underline">Terms & Conditions</span>
                  </div>
                </label>
              </div>

              <div className="border border-dashed border-gray-200 p-3 rounded-md bg-slate-50/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" className="mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">SPECIALUPI</span>
                    <span className="text-[11px] text-slate-400 mt-1 block leading-relaxed">Use this code and get ₹362 instant discount on payments via UPI only!</span>
                    <span className="text-[10px] text-blue-500 font-bold block mt-1 hover:underline">Terms & Conditions</span>
                  </div>
                </label>
              </div>
            </div>
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
                <div><label className="block text-gray-400 font-medium mb-0.5">Flight Name</label><p className="font-semibold text-gray-900">SkyHigh 202</p></div>
                <div><label className="block text-gray-400 font-medium mb-0.5">From</label><p className="font-semibold text-gray-900">Paris</p></div>
                <div><label className="block text-gray-400 font-medium mb-0.5">To</label><p className="font-semibold text-gray-900">Tokyo</p></div>
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
                    <span>Total Amount</span><span>₹ totalAmount.toLocaleString()</span>
                  </div>
                </div>
              </div>
              <button onClick={handlePaymentSubmit} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded shadow uppercase tracking-wide text-xs">
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER BLOCK ATTACHED */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 px-12 border-t border-slate-900 mt-auto">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-8">
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm">Why MakeMyTour?</h5>
            <p className="text-slate-500 leading-relaxed text-[11px]">Established in 2000, MakeMyTour has since positioned itself as one of the leading companies, providing great offers, competitive airfares, exclusive discounts, and a seamless online booking experience.</p>
          </div>
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm">Booking Flights with MakeMyTour</h5>
            <p className="text-slate-500 leading-relaxed text-[11px]">Book your flight tickets with India's leading flight booking company. Get best deals on flights, train tickets, buses, hotels and holiday packages.</p>
          </div>
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm">Domestic Flights with MakeMyTour</h5>
            <p className="text-slate-500 leading-relaxed text-[11px]">MakeMyTour is India's leading player for flight bookings. With the cheapest fare guarantee, experience great value at the lowest price.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h6 className="text-white font-bold text-[11px] uppercase tracking-wider">About The Site</h6>
              <div className="text-slate-500 space-y-0.5 text-[11px]"><p className="hover:text-slate-300">About Us</p><p className="hover:text-slate-300">Investor Relations</p><p className="hover:text-slate-300">Careers</p></div>
            </div>
            <div className="space-y-1.5">
              <h6 className="text-white font-bold text-[11px] uppercase tracking-wider">Important Links</h6>
              <div className="text-slate-500 space-y-0.5 text-[11px]"><p className="hover:text-slate-300">Privacy Policy</p><p className="hover:text-slate-300">Terms & Conditions</p><p className="hover:text-slate-300">User Agreement</p></div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl w-full mx-auto border-t border-slate-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[11px]">
          <p>© 2026 MakeMyTour PVT. LTD. All rights reserved</p>
          <span className="font-semibold tracking-widest text-slate-700 uppercase">NULCLASS EDITION</span>
        </div>
      </footer>

    </div>
  );
}