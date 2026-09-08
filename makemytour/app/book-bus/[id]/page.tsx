"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookBusPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [activeSeatIndex, setActiveSeatIndex] = useState<number | null>(null);

  // Passenger list state (Supports up to 8 passengers)
  const [passengers, setPassengers] = useState([
    { name: "Raya Appa", age: 28, idType: "Aadhaar Card", idNumber: "4512-8890-3321", seat: "Lower Berth - L1", isSingleLady: false }
  ]);

  const baseTicketPrice = 1350;
  const tollFeePerPerson = 100;
  const totalAmount = (baseTicketPrice + tollFeePerPerson) * passengers.length;

  const handleAddPassenger = () => {
    if (passengers.length < 8) {
      const nextSeatNum = passengers.length + 1;
      setPassengers([
        ...passengers,
        { 
          name: `Passenger ${nextSeatNum}`, 
          age: 26, 
          idType: "Aadhaar Card", 
          idNumber: `3310-9921-${1000 + nextSeatNum}`, 
          seat: `Lower Berth - L${nextSeatNum}`, 
          isSingleLady: false 
        }
      ]);
    } else {
      alert("Maximum limit of 8 passengers reached per booking.");
    }
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    } else {
      alert("At least 1 passenger is required for bus booking.");
    }
  };

  const handleUpdatePassenger = (index: number, field: string, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    
    // If Single Lady is toggled on, auto-assign a secure lady quota seat
    if (field === "isSingleLady" && value === true) {
      updated[index].seat = `👩‍🦰 Lady Quota Sleeper - SL${index + 1}`;
    }

    setPassengers(updated);
  };

  const handleConfirmBusBooking = () => {
    const newBooking = {
      type: "Buses",
      bookingId: "bs_" + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(),
      quantity: passengers.length,
      totalPrice: totalAmount,
      cancelled: false,
      passengers: passengers,
      passengerName: passengers[0].name + (passengers.length > 1 ? ` + ${passengers.length - 1} more` : ""),
      travelDate: "2026-07-16",
      currency: "INR"
    };

    const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    localStorage.setItem("userBookings", JSON.stringify([newBooking, ...existingBookings]));

    alert("Bus Tickets Booked Successfully with Govt ID & Seat Allotment!");
    setShowModal(false);
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans text-stone-800 text-left">
      
      {/* HEADER */}
      <header className="bg-[#92400E] text-white px-10 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-xl">🚌</span>
          <h1 className="text-lg font-bold tracking-tight">MakeMyTour <span className="text-amber-200 text-xs uppercase px-2 py-0.5 bg-amber-950 rounded-md font-normal ml-2">Highway Coaches</span></h1>
        </div>
        <button onClick={() => router.push("/profile")} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow">
          My Profile & Bookings
        </button>
      </header>

      {/* TITLE BAR */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-8 pb-4 space-y-2">
        <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
          AC Sleeper Coach • Secure Single Lady Quota Available
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
          VRL Travels AC Sleeper • Bangalore to Goa
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          🌙 Departure: 09:00 PM • Arrival: 07:00 AM (Next Day) • Boarding: Majestic Circle
        </p>
      </div>

      {/* SINGLE CLEAN BUS BANNER IMAGE */}
      <div className="max-w-6xl w-full mx-auto px-6 pb-8">
        <div className="h-[380px] rounded-3xl overflow-hidden shadow-xl border-2 border-amber-200 relative bg-black">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80" 
            alt="VRL Bus Coach View" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl shadow">
            🚌 AC Sleeper Highway Coach & Passenger Fleet
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl w-full mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: MULTI-PASSENGER DETAILS & GOVT ID */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-black text-sm text-stone-900 uppercase tracking-wide">🎫 Passenger Details & Govt ID ({passengers.length} / 8)</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Enter passenger age, govt identification, and seat preferences</p>
              </div>
              {passengers.length < 8 && (
                <button
                  type="button"
                  onClick={handleAddPassenger}
                  className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-all"
                >
                  + Add Passenger
                </button>
              )}
            </div>

            <div className="space-y-6">
              {passengers.map((passenger, index) => (
                <div key={index} className="p-4 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
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
                        className="w-full border p-2.5 rounded-xl font-bold text-stone-900 bg-white outline-none focus:border-amber-600" 
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
                        className="w-full border p-2.5 rounded-xl font-bold text-stone-900 bg-white outline-none focus:border-amber-600" 
                      />
                    </div>
                  </div>

                  {/* GOVT ID DETAILS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                    <div>
                      <label className="block text-stone-500 uppercase text-[10px] mb-1">Govt ID Type</label>
                      <select 
                        value={passenger.idType}
                        onChange={(e) => handleUpdatePassenger(index, "idType", e.target.value)}
                        className="w-full border p-2.5 rounded-xl font-bold text-stone-900 bg-white outline-none focus:border-amber-600"
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Passport">Passport</option>
                        <option value="Voter ID">Voter ID</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-500 uppercase text-[10px] mb-1">Govt ID Number</label>
                      <input 
                        type="text" 
                        value={passenger.idNumber} 
                        onChange={(e) => handleUpdatePassenger(index, "idNumber", e.target.value)} 
                        className="w-full border p-2.5 rounded-xl font-bold text-stone-900 bg-white outline-none focus:border-amber-600" 
                      />
                    </div>
                  </div>

                  {/* SINGLE LADY OPTION & SEAT SELECTION */}
                  <div className="pt-2 border-t border-amber-200/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-900">
                        <input 
                          type="checkbox" 
                          checked={passenger.isSingleLady} 
                          onChange={(e) => handleUpdatePassenger(index, "isSingleLady", e.target.checked)} 
                          className="w-4 h-4 text-amber-700 rounded accent-amber-700"
                        />
                        <span>👩‍🦰 Single Lady Quota (Secure Reserved Seating)</span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl text-xs font-bold">
                      <span className="text-amber-900 font-black">{passenger.seat}</span>
                      <button 
                        type="button"
                        onClick={() => setActiveSeatIndex(index)}
                        className="bg-amber-100 hover:bg-amber-700 hover:text-white text-amber-900 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-xs"
                      >
                        {passenger.isSingleLady ? "Change Lady Quota Seat" : "Choose Available Seat"}
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
                <span className="text-2xl font-black text-stone-900">₹ {totalAmount.toLocaleString()}</span>
                <span className="text-xs text-stone-500 ml-1">({passengers.length} traveler{passengers.length > 1 ? 's' : ''})</span>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">AC Sleeper</span>
            </div>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between"><span>Coach Ticket Fare (₹ {baseTicketPrice} × {passengers.length})</span><span>₹ {baseTicketPrice * passengers.length}</span></div>
              <div className="flex justify-between"><span>Highway Toll & Taxes (₹ {tollFeePerPerson} × {passengers.length})</span><span>₹ {tollFeePerPerson * passengers.length}</span></div>
              <div className="border-t pt-3 flex justify-between font-black text-stone-950 text-sm">
                <span>Total Amount Payable</span><span>₹ {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full bg-[#92400E] hover:bg-black text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
            >
              Confirm Bus Ticket Payment
            </button>
          </div>
        </div>
      </main>

      {/* INTERACTIVE SEAT ALLOTMENT MODAL */}
      {activeSeatIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 relative space-y-4 text-stone-800">
            <h3 className="text-base font-black text-stone-950">💺 Select Sleeper Berth for Passenger #{activeSeatIndex + 1}</h3>
            
            {passengers[activeSeatIndex]?.isSingleLady ? (
              <div className="space-y-3">
                <p className="text-amber-800 font-bold bg-amber-50 p-3 rounded-xl border border-amber-200">
                  👩‍🦰 Single Lady Quota Active: You are restricted to secure pre-allocated lady sleeper berths.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {["👩‍🦰 Lady Quota Sleeper - SL1", "👩‍🦰 Lady Quota Sleeper - SL2", "👩‍🦰 Lady Quota Sleeper - SL3", "👩‍🦰 Lady Quota Sleeper - SL4"].map((seat) => (
                    <button
                      type="button"
                      key={seat}
                      onClick={() => {
                        handleUpdatePassenger(activeSeatIndex, "seat", seat);
                        setActiveSeatIndex(null);
                      }}
                      className={`p-3 rounded-xl border font-bold text-left transition-all ${passengers[activeSeatIndex]?.seat === seat ? 'bg-amber-700 text-white border-amber-700 shadow' : 'bg-stone-50 hover:bg-amber-50'}`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-stone-500">Choose from available lower and upper sleeper berths:</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    "Lower Berth - L1", 
                    "Lower Berth - L2", 
                    "Lower Berth - L3", 
                    "Upper Berth - U1", 
                    "Upper Berth - U2", 
                    "Upper Berth - U3",
                    "Single Cabin - SC1"
                  ].map((seat) => (
                    <button
                      type="button"
                      key={seat}
                      onClick={() => {
                        handleUpdatePassenger(activeSeatIndex, "seat", seat);
                        setActiveSeatIndex(null);
                      }}
                      className={`p-3 rounded-xl border font-bold text-left transition-all ${passengers[activeSeatIndex]?.seat === seat ? 'bg-amber-700 text-white border-amber-700 shadow' : 'bg-stone-50 hover:bg-amber-50'}`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="button" onClick={() => setActiveSeatIndex(null)} className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl mt-2">Close</button>
          </div>
        </div>
      )}

      {/* FINAL PAYMENT CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative space-y-4 text-stone-800">
            <h3 className="text-base font-black text-stone-950">🚌 Confirm Bus Group Reservation</h3>
            <p className="text-stone-500">Booking VRL Travels AC Sleeper for **{passengers.length} passenger(s)**.</p>
            
            <div className="bg-stone-50 p-4 rounded-2xl border space-y-2 max-h-40 overflow-y-auto">
              {passengers.map((p, idx) => (
                <div key={idx} className="flex justify-between text-[11px] font-bold border-b pb-1">
                  <span>{idx + 1}. {p.name} ({p.age} yrs) - {p.idType}</span>
                  <span className="text-amber-800">{p.seat}</span>
                </div>
              ))}
            </div>

            <div className="bg-stone-100 p-3 rounded-xl flex justify-between font-black text-stone-950">
              <span>Total Payable:</span>
              <span className="text-amber-800">₹ {totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-stone-100 text-stone-700 font-bold py-3 rounded-xl">Go Back</button>
              <button type="button" onClick={handleConfirmBusBooking} className="flex-1 bg-[#92400E] text-white font-bold py-3 rounded-xl shadow">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}