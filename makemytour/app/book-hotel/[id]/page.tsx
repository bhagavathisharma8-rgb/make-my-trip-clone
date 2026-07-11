"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BookHotelPage() {
  const { id } = useParams();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState(2);

  const pricePerNight = 3000;
  const taxesAndFees = 1054;
  const discount = 1328;
  const totalAmount = (pricePerNight * rooms) + taxesAndFees - discount;

  const handleConfirmPayment = () => {
    alert("Hotel Reservation Confirmed successfully!");
    setShowModal(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-gray-800">
      
      {/* HEADER */}
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

      {/* BREADCRUMBS */}
      <div className="bg-white px-12 py-2.5 text-xs text-gray-400 border-b border-gray-100 text-left">
        Home ➔ Paris, France ➔ <span className="text-gray-700 font-medium">Luxury Palace</span>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900">Luxury Palace</h2>
            <div className="flex items-center gap-1 text-amber-400 text-sm mt-1">⭐⭐⭐<span className="text-gray-300">⭐⭐</span></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-72 rounded-lg overflow-hidden relative shadow-sm">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" alt="Hotel Pool View" className="w-full h-full object-cover" />
              <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-medium">+91 Property Photos</span>
            </div>
            <div className="grid grid-rows-2 gap-4 h-72">
              <div className="rounded-lg overflow-hidden shadow-sm"><img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80" alt="Bed Suite View" className="w-full h-full object-cover" /></div>
              <div className="rounded-lg overflow-hidden relative shadow-sm">
                <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80" alt="Gateway View" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-medium">+386 Guest Photos</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed text-left">
            One of the best hotels in North Goa, operating since 2001 catering to international and domestic individual and group travelers. <span className="text-blue-500 font-medium cursor-pointer">Read more</span>
          </p>

          <div className="border-t border-gray-200 pt-6 text-left">
            <h4 className="font-bold text-sm text-gray-900 mb-4">Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-gray-600">
              <div>🏊 Swimming Pool</div>
              <div>🍽️ Restaurant</div>
              <div>🍸 Bar</div>
              <div>🔌 Power Backup</div>
            </div>
            <span className="text-xs text-blue-500 font-bold block mt-4 cursor-pointer hover:underline">+ 31 Amenities</span>
          </div>
        </div>

        {/* SIDEBAR BOOKING CARD */}
        <div className="space-y-6 text-left">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-base text-gray-900 mb-1">Standard Room</h3>
            <p className="text-xs text-gray-400 mb-4">Fits 2 Adults</p>
            
            <ul className="space-y-2 text-xs text-gray-500 border-b border-gray-100 pb-4 mb-4">
              <li>❌ No meals included</li>
              <li>🏷️ 10% off on food & beverage services</li>
              <li>🍹 Complimentary welcome drinks on arrival</li>
              <li className="text-emerald-600 font-medium">✔️ Non-Refundable</li>
            </ul>

            <div className="space-y-1 mb-6">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400 font-semibold">Price Per Night:</span>
                <span className="text-sm font-bold text-gray-900">₹ {pricePerNight}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400 font-semibold">Available Rooms:</span>
                <span className="text-sm font-bold text-gray-900">20</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-gray-100 p-4 rounded-md mb-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-400 line-through block">₹ 3680</span>
                <span className="text-lg font-extrabold text-gray-950">₹ 2863</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">+ ₹ 527 taxes & fees</span>
            </div>

            <button onClick={() => setShowModal(true)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded shadow text-xs uppercase tracking-wider">
              Book This Now
            </button>
          </div>
        </div>

        {/* CONFIRMATION POPUP MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-xs text-left">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl p-6 relative">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
                <h3 className="text-base font-bold text-gray-900">🏨 Hotel Booking Details</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                <div><label className="block text-gray-400 font-medium mb-0.5">Hotel Name</label><p className="font-semibold text-gray-900 bg-slate-50 border border-gray-200 px-3 py-2 rounded">Luxury Palace</p></div>
                <div><label className="block text-gray-400 font-medium mb-0.5">Location</label><p className="font-semibold text-gray-900 bg-slate-50 border border-gray-200 px-3 py-2 rounded">Paris, France</p></div>
                <div><label className="block text-gray-400 font-medium mb-0.5">Price Per Night</label><p className="font-semibold text-gray-900 bg-slate-50 border border-gray-200 px-3 py-2 rounded">₹ {pricePerNight}</p></div>
                <div><label className="block text-gray-400 font-medium mb-0.5">Available Rooms</label><p className="font-semibold text-gray-900 bg-slate-50 border border-gray-200 px-3 py-2 rounded">20</p></div>
                <div>
                  <label className="block text-gray-400 font-medium mb-0.5">Number of Rooms to Book</label>
                  <input type="number" value={rooms} onChange={(e) => setRooms(Math.max(1, parseInt(e.target.value) || 1))} className="w-full border border-gray-300 rounded px-3 py-2 mt-0.5 bg-white font-semibold text-black outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="bg-slate-50 border border-gray-100 rounded-md p-4 mb-6">
                <h4 className="font-bold text-gray-900 mb-3">📋 Fare Summary</h4>
                <div className="space-y-2 text-gray-500">
                  <div className="flex justify-between"><span>Base Fare</span><span>₹ {(pricePerNight * rooms).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Taxes and Extracharges</span><span>₹ {taxesAndFees.toLocaleString()}</span></div>
                  <div className="flex justify-between text-emerald-600"><span>Discounts</span><span>- ₹ {discount.toLocaleString()}</span></div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-sm">
                    <span>Total Amount</span><span>₹ {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleConfirmPayment} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded shadow uppercase tracking-wide text-xs">
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER BLOCK ATTACHED */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 px-12 border-t border-slate-900 mt-auto">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-8 border-b border-slate-900 pb-8">
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm">Why MakeMyTour?</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">Established in 2000, MakeMyTour has since positioned itself as one of the leading companies, providing great offers, competitive airfares, exclusive discounts, and a seamless online booking experience.</p>
          </div>
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm">Booking Flights with MakeMyTour</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">Book your flight tickets with India's leading flight booking company. Get best deals on flights, train tickets, buses, hotels and holiday packages.</p>
          </div>
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm">Domestic Flights with MakeMyTour</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">MakeMyTour is India's leading player for flight bookings. With the cheapest fare guarantee, experience great value at the lowest price.</p>
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
          <span className="font-semibold text-slate-800 tracking-wider">NULCLASS</span>
        </div>
      </footer>

    </div>
  );
}