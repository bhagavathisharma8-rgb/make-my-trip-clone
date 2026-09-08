"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookTourismPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [participants, setParticipants] = useState(2);
  const [guestName, setGuestName] = useState("Raya Appa");

  // Distinct landmark images
  const touristImages = [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80", // Seine River
    "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?auto=format&fit=crop&w=1200&q=80"  // Arc de Triomphe
  ];

  const [selectedImage, setSelectedImage] = useState(touristImages[0]);

  const ticketPricePerPerson = 4500;
  const totalAmount = ticketPricePerPerson * participants;

  const handleConfirmTourism = () => {
    const newBooking = {
      type: "Tourism",
      bookingId: "ts_" + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(),
      quantity: participants,
      totalPrice: totalAmount,
      cancelled: false,
      passengerName: guestName,
      travelDate: "2026-07-16",
      currency: "INR"
    };

    const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    localStorage.setItem("userBookings", JSON.stringify([newBooking, ...existingBookings]));

    alert("Tourism Excursion Pass Booked Successfully!");
    setShowModal(false);
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col font-sans text-stone-800 text-left">
      
      {/* TOURISM TOP NAV */}
      <header className="bg-[#0369A1] text-white px-10 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-xl">🗺️</span>
          <h1 className="text-lg font-bold tracking-tight">MakeMyTour <span className="text-sky-200 text-xs uppercase px-2 py-0.5 bg-sky-900/60 rounded-md font-normal ml-2">Guided Excursions</span></h1>
        </div>
        <button onClick={() => router.push("/profile")} className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow">
          My Profile & Bookings
        </button>
      </header>

      {/* HEADER TITLE */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-8 pb-4 space-y-2">
        <span className="bg-sky-100 text-sky-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
          Skip-the-Line Monument Pass • Expert Local Historian Guide
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
          Eiffel Tower Summit Access & Seine River Sunset Cruise
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          🗼 Duration: 4 Hours • Paris, France • Instant Mobile Voucher
        </p>
      </div>

      {/* INTERACTIVE PHOTO VIEWER */}
      <div className="max-w-6xl w-full mx-auto px-6 pb-8 space-y-4">
        {/* Main Active Banner */}
        <div className="h-[380px] rounded-3xl overflow-hidden shadow-xl border-2 border-sky-200 relative bg-black">
          <img 
            src={selectedImage} 
            alt="Active Tourist Landmark" 
            className="w-full h-full object-cover opacity-95 transition-opacity duration-300" 
          />
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl shadow">
            ✨ Click any thumbnail below to change landmark view
          </div>
        </div>

        {/* Clickable Thumbnails Grid */}
        <div className="grid grid-cols-4 gap-4">
          {touristImages.map((imgUrl, idx) => (
            <button
              type="button"
              key={idx} 
              onClick={() => setSelectedImage(imgUrl)}
              className={`h-24 rounded-2xl overflow-hidden cursor-pointer border-4 transition-all shadow-md text-left ${selectedImage === imgUrl ? 'border-sky-600 ring-4 ring-sky-300 scale-105' : 'border-white opacity-70 hover:opacity-100'}`}
            >
              <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />
            </button>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <main className="max-w-6xl w-full mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-black text-sm text-stone-900 uppercase tracking-wide">🌟 Excursion Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-stone-700">
              <div className="p-3 bg-stone-50 rounded-xl border">⚡ Skip the long general queues</div>
              <div className="p-3 bg-stone-50 rounded-xl border">🎙️ Live English-speaking historian guide</div>
              <div className="p-3 bg-stone-50 rounded-xl border">🚢 1-hour scenic Seine River cruise pass</div>
              <div className="p-3 bg-stone-50 rounded-xl border">📱 Instant smartphone voucher entry</div>
            </div>
          </div>

          <div className="space-y-3 text-xs text-stone-600 leading-relaxed bg-white border p-6 rounded-3xl shadow-xs">
            <h3 className="font-black text-sm text-stone-900 uppercase tracking-wide">What to Expect</h3>
            <p>
              Meet your expert guide right outside the Eiffel Tower base pillars. Bypass the hours-long ticket lines and enjoy direct elevator access straight to the top summit deck for panoramic views across Paris. Conclude your evening with an open-air glass boat cruise down the River Seine.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-stone-200 rounded-3xl shadow-xl p-6 space-y-6 sticky top-6">
            <div className="flex justify-between items-baseline border-b pb-4">
              <div>
                <span className="text-2xl font-black text-stone-900">₹ {ticketPricePerPerson.toLocaleString()}</span>
                <span className="text-xs text-stone-500 ml-1">/ person</span>
              </div>
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">⚡ Instant Pass</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-500 font-bold uppercase text-[10px] mb-1">Lead Guest Name</label>
                <input 
                  type="text" 
                  value={guestName} 
                  onChange={(e) => setGuestName(e.target.value)} 
                  className="w-full border border-stone-300 p-3 rounded-xl font-bold text-stone-900 bg-stone-50 outline-none focus:border-sky-600" 
                />
              </div>

              <div>
                <label className="block text-stone-500 font-bold uppercase text-[10px] mb-1">Number of Participants</label>
                <input 
                  type="number" 
                  min={1} 
                  value={participants} 
                  onChange={(e) => setParticipants(Number(e.target.value) || 1)} 
                  className="w-full border border-stone-300 p-3 rounded-xl font-bold text-stone-900 bg-stone-50 outline-none focus:border-sky-600" 
                />
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-600 border-t pt-4">
              <div className="flex justify-between"><span>₹ {ticketPricePerPerson} × {participants} participants</span><span>₹ {(ticketPricePerPerson * participants).toLocaleString()}</span></div>
              <div className="border-t pt-3 flex justify-between font-black text-stone-950 text-sm">
                <span>Total Pass Amount</span><span>₹ {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="w-full bg-[#0369A1] hover:bg-black text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
            >
              Book Tourism Excursion Pass
            </button>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative space-y-4 text-stone-800">
            <h3 className="text-base font-black text-stone-950">🗺️ Confirm Tourism Pass</h3>
            <p className="text-stone-500">Booking **Eiffel Tower Summit Access** for {participants} participants under **{guestName}**.</p>
            
            <div className="bg-stone-50 p-4 rounded-2xl border space-y-1 font-bold">
              <div className="flex justify-between"><span>Total Payable:</span><span className="text-sky-800 text-sm">₹ {totalAmount.toLocaleString()}</span></div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-stone-100 text-stone-700 font-bold py-3 rounded-xl">Go Back</button>
              <button onClick={handleConfirmTourism} className="flex-1 bg-[#0369A1] text-white font-bold py-3 rounded-xl shadow">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}