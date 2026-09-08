"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookTrainPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [activeSeatIndex, setActiveSeatIndex] = useState<number | null>(null);
  
  const [travelClass, setTravelClass] = useState("AC 2-Tier");
  
  // Passenger list state (Supports up to 8 passengers)
  const [passengers, setPassengers] = useState([
    { name: "Raya Appa", age: 28, berth: "Coach B3 - 24 Lower Berth" }
  ]);

  // Dynamic pricing based on selected train class
  const classPrices: Record<string, number> = {
    "Sleeper": 850,
    "AC 3-Tier": 1450,
    "AC 2-Tier": 2150,
    "AC 1-Tier": 3450
  };

  const baseTicketPrice = classPrices[travelClass] || 2150;
  const reservationFeePerPerson = 150;
  
  const totalTicketPrice = (baseTicketPrice + reservationFeePerPerson) * passengers.length;

  const handleAddPassenger = () => {
    if (passengers.length < 8) {
      setPassengers([
        ...passengers,
        { name: `Passenger ${passengers.length + 1}`, age: 25, berth: `Coach B3 - ${25 + passengers.length} Middle Berth` }
      ]);
    } else {
      alert("Maximum limit of 8 passengers reached per booking.");
    }
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    } else {
      alert("At least 1 passenger is required for booking.");
    }
  };

  const handleUpdatePassenger = (index: number, field: string, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleConfirmTrainBooking = () => {
    const newBooking = {
      type: "Trains",
      bookingId: "tr_" + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(),
      quantity: passengers.length,
      totalPrice: totalTicketPrice,
      cancelled: false,
      passengers: passengers,
      passengerName: passengers[0].name + (passengers.length > 1 ? ` + ${passengers.length - 1} more` : ""),
      travelClass: travelClass,
      travelDate: "2026-07-18",
      currency: "INR"
    };

    const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    localStorage.setItem("userBookings", JSON.stringify([newBooking, ...existingBookings]));

    alert(`Train Tickets Booked Successfully for ${passengers.length} Passenger(s)!`);
    setShowModal(false);
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-stone-800 text-left">
      
      {/* HEADER */}
      <header className="bg-[#1E293B] text-white px-10 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-xl">🚂</span>
          <h1 className="text-lg font-bold tracking-tight">MakeMyTour <span className="text-blue-400 text-xs uppercase px-2 py-0.5 bg-blue-950 rounded-md font-normal ml-2">Railways & Express</span></h1>
        </div>
        <button onClick={() => router.push("/profile")} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow">
          My Profile & Bookings
        </button>
      </header>

      {/* TITLE BAR */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-8 pb-4 space-y-2">
        <span className="bg-blue-100 text-blue-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
          Express Rail Network • Up to 8 Passengers Group Booking
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
          Rajdhani Express (12951) • Bangalore to New Delhi
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          ⏱️ Departure: 06:15 PM • Arrival: 10:30 AM (Next Day) • Distance: 2,280 km
        </p>
      </div>

      {/* SINGLE CLEAN TRAIN BANNER IMAGE */}
      <div className="max-w-6xl w-full mx-auto px-6 pb-8">
        <div className="h-[380px] rounded-3xl overflow-hidden shadow-xl border-2 border-blue-200 relative bg-black">
          <img 
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80" 
            alt="Train Express View" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl shadow">
            🚂 Express Rail Locomotive & Passenger Coach Network
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl w-full mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: CLASS SELECTOR & MULTI-PASSENGER LIST */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* CLASS SELECTION CARDS */}
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-black text-sm text-stone-900 uppercase tracking-wide">🏷️ Select Travel Class</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(classPrices).map(([cls, prc]) => (
                <button
                  type="button"
                  key={cls}
                  onClick={() => setTravelClass(cls)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${travelClass === cls ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : 'bg-stone-50 hover:bg-blue-50 text-stone-800 border-stone-200'}`}
                >
                  <p className="font-black text-xs">{cls}</p>
                  <p className={`text-[11px] font-bold mt-1 ${travelClass === cls ? 'text-blue-100' : 'text-blue-600'}`}>₹ {prc} / person</p>
                </button>
              ))}
            </div>
          </div>

          {/* PASSENGERS LIST SECTION */}
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-black text-sm text-stone-900 uppercase tracking-wide">🎫 Passenger Details ({passengers.length} / 8)</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Add up to 8 passengers for this train journey</p>
              </div>
              {passengers.length < 8 && (
                <button
                  type="button"
                  onClick={handleAddPassenger}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-all"
                >
                  + Add Passenger
                </button>
              )}
            </div>

            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                      Passenger #{index + 1}
                    </span>
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePassenger(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >
                        Remove ✕
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
                    <div className="sm:col-span-2">
                      <label className="block text-stone-500 uppercase text-[10px] mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={passenger.name} 
                        onChange={(e) => handleUpdatePassenger(index, "name", e.target.value)} 
                        className="w-full border p-2.5 rounded-xl font-bold text-stone-900 bg-white outline-none focus:border-blue-600" 
                      />
                    </div>

                    <div>
                      <label className="block text-stone-500 uppercase text-[10px] mb-1">Age</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={120} 
                        value={passenger.age} 
                        onChange={(e) => handleUpdatePassenger(index, "age", parseInt(e.target.value) || 1)} 
                        className="w-full border p-2.5 rounded-xl font-bold text-stone-900 bg-white outline-none focus:border-blue-600" 
                      />
                    </div>
                  </div>

                  <div className="text-xs font-bold">
                    <label className="block text-stone-500 uppercase text-[10px] mb-1">Assigned Berth / Seat</label>
                    <div className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl">
                      <span className="text-blue-900 font-black">{passenger.berth}</span>
                      <button 
                        type="button"
                        onClick={() => setActiveSeatIndex(index)}
                        className="bg-slate-200 hover:bg-blue-600 hover:text-white text-stone-800 px-3 py-1 rounded-lg text-[11px] font-bold transition-all"
                      >
                        Change Berth
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHECKOUT SUMMARY */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-stone-200 rounded-3xl shadow-xl p-6 space-y-6 sticky top-6">
            <div className="flex justify-between items-baseline border-b pb-4">
              <div>
                <span className="text-2xl font-black text-stone-900">₹ {totalTicketPrice.toLocaleString()}</span>
                <span className="text-xs text-stone-500 ml-1">({passengers.length} traveler{passengers.length > 1 ? 's' : ''})</span>
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">{travelClass}</span>
            </div>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between"><span>Base Fare (₹ {baseTicketPrice} × {passengers.length})</span><span>₹ {baseTicketPrice * passengers.length}</span></div>
              <div className="flex justify-between"><span>Reservation Surcharge (₹ {reservationFeePerPerson} × {passengers.length})</span><span>₹ {reservationFeePerPerson * passengers.length}</span></div>
              <div className="border-t pt-3 flex justify-between font-black text-stone-950 text-sm">
                <span>Total Amount Payable</span><span>₹ {totalTicketPrice.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full bg-[#1E293B] hover:bg-black text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
            >
              Confirm Train Ticket Payment
            </button>
          </div>
        </div>
      </main>

      {/* SEAT ALLOTMENT SELECTOR MODAL */}
      {activeSeatIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative space-y-4 text-stone-800">
            <h3 className="text-base font-black text-stone-950">💺 Select Berth for Passenger #{activeSeatIndex + 1}</h3>
            <p className="text-stone-500">Choose preferred sleeping berth in Coach B3:</p>
            
            <div className="grid grid-cols-2 gap-2.5">
              {[
                "Coach B3 - 21 Lower", 
                "Coach B3 - 22 Upper", 
                "Coach B3 - 23 Middle", 
                "Coach B3 - 24 Lower", 
                "Coach B3 - 25 Side Lower", 
                "Coach B3 - 26 Side Upper",
                "Coach B4 - 12 Lower",
                "Coach B4 - 15 Upper"
              ].map((berth) => (
                <button
                  type="button"
                  key={berth}
                  onClick={() => {
                    handleUpdatePassenger(activeSeatIndex, "berth", berth);
                    setActiveSeatIndex(null);
                  }}
                  className={`p-3 rounded-xl border font-bold text-left transition-all ${passengers[activeSeatIndex]?.berth === berth ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-stone-50 hover:bg-blue-50'}`}
                >
                  {berth}
                </button>
              ))}
            </div>

            <button type="button" onClick={() => setActiveSeatIndex(null)} className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl mt-2">Close</button>
          </div>
        </div>
      )}

      {/* FINAL PAYMENT CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative space-y-4 text-stone-800">
            <h3 className="text-base font-black text-stone-950">🚂 Confirm Group Rail Reservation</h3>
            <p className="text-stone-500">Booking Rajdhani Express ({travelClass}) for **{passengers.length} passenger(s)**.</p>
            
            <div className="bg-stone-50 p-4 rounded-2xl border space-y-2 max-h-40 overflow-y-auto">
              {passengers.map((p, idx) => (
                <div key={idx} className="flex justify-between text-[11px] font-bold border-b pb-1">
                  <span>{idx + 1}. {p.name} ({p.age} yrs)</span>
                  <span className="text-blue-800">{p.berth}</span>
                </div>
              ))}
            </div>

            <div className="bg-stone-100 p-3 rounded-xl flex justify-between font-black text-stone-950">
              <span>Total Payable:</span>
              <span className="text-blue-800">₹ {totalTicketPrice.toLocaleString()}</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-stone-100 text-stone-700 font-bold py-3 rounded-xl">Go Back</button>
              <button type="button" onClick={handleConfirmTrainBooking} className="flex-1 bg-[#1E293B] text-white font-bold py-3 rounded-xl shadow">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}