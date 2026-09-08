"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookHomestayPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("Raya Appa");

  const nightlyRate = 3500;
  const estateFee = 600;
  const totalAmount = (nightlyRate * nights) + estateFee;

  const handleConfirmBooking = () => {
    const newBooking = {
      type: "Homestay",
      bookingId: "hm_" + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(),
      quantity: nights,
      totalPrice: totalAmount,
      cancelled: false,
      passengerName: guestName,
      travelDate: "2026-07-15",
      currency: "INR"
    };

    const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    localStorage.setItem("userBookings", JSON.stringify([newBooking, ...existingBookings]));

    alert("Homestay Estate Booking Confirmed Successfully!");
    setShowModal(false);
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-stone-800 text-left">
      
      {/* DISTINCT ESTATE NAVBAR */}
      <header className="bg-[#1B3022] text-white px-10 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-xl">🏡</span>
          <h1 className="text-lg font-bold tracking-tight">MakeMyTour <span className="text-emerald-300 text-xs uppercase px-2 py-0.5 bg-[#2B4C38] rounded-md font-normal ml-2">Private Villas & Homestays</span></h1>
        </div>
        <button onClick={() => router.push("/profile")} className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow">
          My Bookings & Profile
        </button>
      </header>

      {/* ESTATE TITLE & HOST BADGE */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-8 pb-4 space-y-2">
        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
          Verified Private Property • Entire Villa Rental
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
          Whispering Pines Heritage Cottage & Coffee Estate
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          ⭐ 4.98 (96 reviews) • 🌿 Coorg Plantations, Karnataka, India
        </p>
      </div>

      {/* DISTINCT ESTATE PHOTO SHOWCASE (WIDE VILLA COLLAGE) */}
      <div className="max-w-6xl w-full mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[380px] rounded-3xl overflow-hidden shadow-lg border border-stone-200">
          <div className="md:col-span-2 h-full relative group">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80" alt="Villa Exterior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md">🌿 Private Lawn & Veranda View</span>
            </div>
          </div>
          <div className="grid grid-rows-2 gap-3 h-full">
            <div className="rounded-2xl overflow-hidden relative shadow-sm">
              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80" alt="Bedroom" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden relative shadow-sm">
              <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=500&q=80" alt="Living Room" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <main className="max-w-6xl w-full mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: HOST & ESTATE EXPERIENCE DETAILS */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* HOST CARD */}
          <div className="bg-white border border-stone-200 p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <h3 className="font-black text-sm text-stone-900">Hosted by Muthappa (Plantation Owner)</h3>
              <p className="text-xs text-stone-500 mt-0.5">Entire home • 4 guests max • 2 bedrooms • 2 private baths</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#1B3022] text-white font-black text-base flex items-center justify-center shadow">
              M
            </div>
          </div>

          {/* VILLA FEATURES */}
          <div className="space-y-4 border-y border-stone-200 py-6">
            <h3 className="font-black text-sm text-stone-900">Estate Highlights & Experiences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-stone-700">
              <div className="p-3 bg-white border rounded-xl flex items-center gap-3 shadow-xs"><span>🍳</span> Organic Farm Breakfast Included</div>
              <div className="p-3 bg-white border rounded-xl flex items-center gap-3 shadow-xs"><span>🔥</span> Private Evening Bonfire Setup</div>
              <div className="p-3 bg-white border rounded-xl flex items-center gap-3 shadow-xs"><span>☕</span> Guided Coffee Plantation Walk</div>
              <div className="p-3 bg-white border rounded-xl flex items-center gap-3 shadow-xs"><span>📶</span> High-Speed Wi-Fi for Remote Work</div>
            </div>
          </div>

          {/* HOUSE RULES */}
          <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
            <h3 className="font-black text-sm text-stone-900">House Rules & Policies</h3>
            <p>• Check-in is anytime after 2:00 PM and check-out by 11:00 AM.</p>
            <p>• Smoking is permitted only in designated outdoor garden gazebos.</p>
            <p>• Quiet hours are observed after 10:00 PM to respect plantation wildlife and neighbors.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: DISTINCT HOMESTAY CHECKOUT WIDGET */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-stone-200 rounded-3xl shadow-xl p-6 space-y-6 sticky top-6">
            <div className="flex justify-between items-baseline border-b pb-4">
              <div>
                <span className="text-2xl font-black text-stone-900">₹ {nightlyRate.toLocaleString()}</span>
                <span className="text-xs text-stone-500 ml-1">/ night</span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">⭐ 4.98 Rating</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-500 font-bold uppercase text-[10px] mb-1">Primary Guest Full Name</label>
                <input 
                  type="text" 
                  value={guestName} 
                  onChange={(e) => setGuestName(e.target.value)} 
                  className="w-full border border-stone-300 p-3 rounded-xl font-bold text-stone-900 bg-stone-50 outline-none focus:border-emerald-800" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 font-bold uppercase text-[10px] mb-1">Stay Duration (Nights)</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={nights} 
                    onChange={(e) => setNights(Number(e.target.value) || 1)} 
                    className="w-full border border-stone-300 p-3 rounded-xl font-bold text-stone-900 bg-stone-50 outline-none focus:border-emerald-800" 
                  />
                </div>
                <div>
                  <label className="block text-stone-500 font-bold uppercase text-[10px] mb-1">Guests</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={6} 
                    value={guests} 
                    onChange={(e) => setGuests(Number(e.target.value) || 1)} 
                    className="w-full border border-stone-300 p-3 rounded-xl font-bold text-stone-900 bg-stone-50 outline-none focus:border-emerald-800" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-600 border-t pt-4">
              <div className="flex justify-between"><span>₹ {nightlyRate} × {nights} nights</span><span>₹ {(nightlyRate * nights).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Estate maintenance & upkeep fee</span><span>₹ {estateFee}</span></div>
              <div className="border-t pt-3 flex justify-between font-black text-stone-950 text-sm">
                <span>Total Amount Payable</span><span>₹ {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="w-full bg-[#1B3022] hover:bg-black text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
            >
              Reserve Homestay Estate
            </button>
            <p className="text-center text-[10px] text-stone-400">Instant reservation confirmation</p>
          </div>
        </div>
      </main>

      {/* CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative space-y-4 text-stone-800">
            <h3 className="text-base font-black text-stone-950">🏡 Confirm Homestay Reservation</h3>
            <p className="text-stone-500">You are reserving **Whispering Pines Heritage Cottage** for {nights} nights under guest **{guestName}**.</p>
            
            <div className="bg-stone-50 p-4 rounded-2xl border space-y-1 font-bold">
              <div className="flex justify-between"><span>Total Payable:</span><span className="text-emerald-900 text-sm">₹ {totalAmount.toLocaleString()}</span></div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3 rounded-xl">Go Back</button>
              <button onClick={handleConfirmBooking} className="flex-1 bg-[#1B3022] hover:bg-black text-white font-bold py-3 rounded-xl shadow">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}