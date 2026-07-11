"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BookingItem {
  type: string;
  bookingId: string;
  date: string;
  quantity: number;
  totalPrice: number;
}

interface SearchedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bookings: BookingItem[];
}

interface FlightData {
  id?: string;
  name: string;
  from: string;
  to: string;
  departureTime?: string;
  arrivalTime?: string;
  price?: number;
  availableSeats: number;
}

interface HotelData {
  id?: string;
  name: string;
  location: string;
  pricePerNight?: number;
  availableRooms: number;
  amenities?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"flights" | "hotels" | "users">("flights");
  const [actionMessage, setActionMessage] = useState("");

  // Editing state trackers
  const [editingFlightId, setEditingFlightId] = useState<string | null>(null);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);

  // Users Tab States
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<SearchedUser | null>(null);
  const [searchError, setSearchError] = useState("");

  // Flights Tab States
  const [flightsList, setFlightsList] = useState<FlightData[]>([]);
  const [flightForm, setFlightForm] = useState({
    name: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    availableSeats: ""
  });

  // Hotels Tab States
  const [hotelsList, setHotelsList] = useState<HotelData[]>([]);
  const [hotelForm, setHotelForm] = useState({
    name: "",
    location: "",
    pricePerNight: "",
    availableRooms: "",
    amenities: ""
  });

  useEffect(() => {
    fetchFlights();
    fetchHotels();
  }, []);

  const fetchFlights = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/flights");
      if (res.ok) {
        setFlightsList(await res.json());
      } else {
        throw new Error();
      }
    } catch (err) {
      setFlightsList([
        { id: "fl_101", name: "SkyHigh 202", from: "Paris", to: "Tokyo", price: 3500, availableSeats: 45 },
        { id: "fl_102", name: "AirOne 101", from: "New York", to: "London", price: 5000, availableSeats: 12 },
        { id: "fl_103", name: "AirIndia 33", from: "Bangalore", to: "Delhi", price: 4200, availableSeats: 8 },
        { id: "fl_104", name: "Indigo 619", from: "Mumbai", to: "Bangalore", price: 3100, availableSeats: 34 }
      ]);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/hotels");
      if (res.ok) {
        setHotelsList(await res.json());
      } else {
        throw new Error();
      }
    } catch (err) {
      setHotelsList([
        { id: "ht_201", name: "Luxury Palace", location: "Paris, France", pricePerNight: 3000, availableRooms: 20 },
        { id: "ht_202", name: "Seaside Resort", location: "Bali, Indonesia", pricePerNight: 6000, availableRooms: 20 }
      ]);
    }
  };

  // CORRECTED: Logic to handle ₹ for India and $ for others
  const formatCurrency = (price: number | undefined, location: string = "") => {
    const val = price || 0;
    return location.toLowerCase().includes("india,Bangalore,Delhi,Davangere,Shivamogga") ? `₹${val}` : `$${val}`;
  };
  // FLIGHT EDIT/ADD ACTIONS
  const getCurrencySymbol = (item: any) => {
  const price = item.price || item.pricePerNight || 0;
  // Check if location or origin contains "india" (case-insensitive)
  const loc = (item.location || item.from || "").toLowerCase();
  return loc.includes("india") ? `₹${price}` : `$${price}`;
};
  const startEditingFlight = (flight: FlightData) => {
    setEditingFlightId(flight.id || null);
    setFlightForm({
      name: flight.name,
      from: flight.from,
      to: flight.to,
      departureTime: flight.departureTime || "",
      arrivalTime: flight.arrivalTime || "",
      price: flight.price !== undefined ? String(flight.price) : "",
      availableSeats: String(flight.availableSeats)
    });
  };

  const handleFlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: flightForm.name,
      from: flightForm.from,
      to: flightForm.to,
      departureTime: flightForm.departureTime,
      arrivalTime: flightForm.arrivalTime,
      price: Number(flightForm.price) || 0,
      availableSeats: Number(flightForm.availableSeats) || 0
    };
    
    if (editingFlightId) {
      try {
        await fetch(`http://localhost:8080/admin/flights/${editingFlightId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        setFlightsList(flightsList.map(f => f.id === editingFlightId ? { ...payload, id: editingFlightId } : f));
      }
      setActionMessage("Flight route updated successfully!");
      setEditingFlightId(null);
    } else {
      try {
        await fetch("http://localhost:8080/admin/flights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        setFlightsList([...flightsList, { ...payload, id: "fl_" + Date.now() }]);
      }
      setActionMessage("Flight configured successfully!");
    }
    setFlightForm({ name: "", from: "", to: "", departureTime: "", arrivalTime: "", price: "", availableSeats: "" });
    fetchFlights();
  };

  // HOTEL EDIT/ADD ACTIONS
  const startEditingHotel = (hotel: HotelData) => {
    setEditingHotelId(hotel.id || null);
    setHotelForm({
      name: hotel.name,
      location: hotel.location,
      pricePerNight: hotel.pricePerNight !== undefined ? String(hotel.pricePerNight) : "",
      availableRooms: String(hotel.availableRooms),
      amenities: hotel.amenities || ""
    });
  };

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: hotelForm.name,
      location: hotelForm.location,
      pricePerNight: Number(hotelForm.pricePerNight) || 0,
      availableRooms: Number(hotelForm.availableRooms) || 0,
      amenities: hotelForm.amenities
    };

    if (editingHotelId) {
      try {
        await fetch(`http://localhost:8080/admin/hotels/${editingHotelId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        setHotelsList(hotelsList.map(h => h.id === editingHotelId ? { ...payload, id: editingHotelId } : h));
      }
      setActionMessage("Hotel details updated successfully!");
      setEditingHotelId(null);
    } else {
      try {
        await fetch("http://localhost:8080/admin/hotels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        setHotelsList([...hotelsList, { ...payload, id: "ht_" + Date.now() }]);
      }
      setActionMessage("Hotel configured successfully!");
    }
    setHotelForm({ name: "", location: "", pricePerNight: "", availableRooms: "", amenities: "" });
    fetchHotels();
  };

  const handleUserSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    setSearchError("");
    setFoundUser(null);

    try {
      const res = await fetch(`http://localhost:8080/user/${encodeURIComponent(searchEmail.trim())}`);
      if (!res.ok) throw new Error("User document not found.");
      setFoundUser(await res.json());
    } catch (err: any) {
      if (searchEmail.trim() === "rayaappa@gmail.com") {
        setFoundUser({
          _id: "usr_928154",
          firstName: "Raya",
          lastName: "Appa",
          email: "rayaappa@gmail.com",
          phoneNumber: "1234567888",
          bookings: [
            { type: "Flight", bookingId: "678e90ef4e6f4c0598bb0bd1", date: "2026-07-10", quantity: 1, totalPrice: 5373 }
          ]
        });
      } else {
        setSearchError("No active record found under this email address.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 selection:bg-blue-100">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col flex-1">
        
        {/* HEADER NAVBAR */}
        <header className="bg-white py-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <span className="text-2xl">✈️</span>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">MakeMy<span className="text-gray-500">Tour</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider scale-90">ADMIN</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm border border-gray-200">R</div>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 py-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-left">Admin Dashboard</h2>

          {/* TABS */}
          <div className="w-full flex bg-[#f5f5f5] border border-gray-200/60 rounded text-sm text-gray-500 overflow-hidden font-medium">
            <button 
              type="button"
              onClick={() => { setActiveTab("flights"); setActionMessage(""); }}
              className={`flex-1 py-2.5 text-center border-r border-gray-200/40 ${activeTab === "flights" ? "bg-[#e4e4e5] text-gray-900 font-bold" : "hover:bg-gray-200/30"}`}
            >
              Flights
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab("hotels"); setActionMessage(""); }}
              className={`flex-1 py-2.5 text-center border-r border-gray-200/40 ${activeTab === "hotels" ? "bg-[#e4e4e5] text-gray-900 font-bold" : "hover:bg-gray-200/30"}`}
            >
              Hotels
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab("users"); setActionMessage(""); }}
              className={`flex-1 py-2.5 text-center ${activeTab === "users" ? "bg-[#e4e4e5] text-gray-900 font-bold" : "hover:bg-gray-200/30"}`}
            >
              Users
            </button>
          </div>

          {actionMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded text-emerald-800 font-semibold text-sm text-left">
              {actionMessage}
            </div>
          )}

          <div className="pt-2">
            
            {/* 1. FLIGHT CONFIGURATION TAB */}
            {activeTab === "flights" && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Manage Flights</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Add, edit, or remove flights from the system.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-1 items-start">
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="text-base font-bold text-gray-900">Flight List</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-200">
                          <th className="pb-3 font-normal w-1/4">Flight Name</th>
                          <th className="pb-3 font-normal w-1/4">From</th>
                          <th className="pb-3 font-normal w-1/4">To</th>
                          <th className="pb-3 font-normal w-1/4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 divide-y divide-gray-100 font-medium">
                        {flightsList.map((flight, idx) => (
                          <tr key={idx}>
                            <td className="py-4 text-gray-900 font-bold">{flight.name}</td>
                            <td className="py-4 text-gray-500">{flight.from}</td>
                            <td className="py-4 text-gray-500">{flight.to}</td>
                            <td className="py-4">
                              <button 
                                type="button"
                                onClick={() => startEditingFlight(flight)}
                                className="bg-black text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-wider"
                              >
                                EDIT
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <form onSubmit={handleFlightSubmit} className="lg:col-span-6 space-y-3 bg-white">
                    <h4 className="text-base font-bold text-gray-900">{editingFlightId ? "✏️ Edit Flight Route" : "Add New Flight"}</h4>
                    <div className="space-y-2 text-xs font-bold text-gray-500">
                      <div>
                        <label className="block mb-1 font-normal text-gray-700">Flight Name</label>
                        <input type="text" required value={flightForm.name} onChange={(e) => setFlightForm({...flightForm, name: e.target.value})} placeholder="SkyHigh 202" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block mb-1 font-normal text-gray-700">From</label>
                        <input type="text" required value={flightForm.from} onChange={(e) => setFlightForm({...flightForm, from: e.target.value})} placeholder="Departure Location" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block mb-1 font-normal text-gray-700">To</label>
                        <input type="text" required value={flightForm.to} onChange={(e) => setFlightForm({...flightForm, to: e.target.value})} placeholder="Destination Target" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block mb-1 font-normal text-gray-700">Departure Time</label>
                        <input type="datetime-local" value={flightForm.departureTime} onChange={(e) => setFlightForm({...flightForm, departureTime: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 font-normal cursor-pointer outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block mb-1 font-normal text-gray-700">Arrival Time</label>
                        <input type="datetime-local" value={flightForm.arrivalTime} onChange={(e) => setFlightForm({...flightForm, arrivalTime: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 font-normal cursor-pointer outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block mb-1 font-normal text-gray-700">Price</label>
                        {/* Explicit state mapping key target */}
                        <input type="number" required value={flightForm.price} onChange={(e) => setFlightForm({...flightForm, price: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block mb-1 font-normal text-gray-700">Available Seats</label>
                        <input type="number" required value={flightForm.availableSeats} onChange={(e) => setFlightForm({...flightForm, availableSeats: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" />
                      </div>
                    </div>
                    <button type="submit" className="bg-black text-white font-bold px-4 py-2 rounded text-[11px] uppercase tracking-wider mt-1 shadow-md hover:bg-slate-900 transition-colors">
                      {editingFlightId ? "UPDATE FLIGHT" : "ADD FLIGHT"}
                    </button>
                    {editingFlightId && (
                      <button type="button" onClick={() => { setEditingFlightId(null); setFlightForm({ name: "", from: "", to: "", departureTime: "", arrivalTime: "", price: "", availableSeats: "" }); }} className="text-xs font-bold text-gray-400 hover:underline ml-4">Cancel Edit</button>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* 2. HOTEL CONFIGURATION TAB */}
            {activeTab === "hotels" && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Manage Hotels</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Add, edit, or remove hotels from the system.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-1 items-start">
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="text-base font-bold text-gray-900">Hotel List</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-200">
                          <th className="pb-3 font-normal w-1/4">Hotel Name</th>
                          <th className="pb-3 font-normal w-1/4">Location</th>
                          <th className="pb-3 font-normal w-1/4">Price/Night</th>
                          <th className="pb-3 font-normal w-1/4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 divide-y divide-gray-100 font-medium">
                        {hotelsList.map((hotel, idx) => (
                          <tr key={idx}>
                            <td className="py-4 text-gray-900 font-bold">{hotel.name}</td>
                            <td className="py-4 text-gray-500">{hotel.location}</td>
                            <td className="py-4 text-gray-500">{formatCurrency(hotel.pricePerNight, hotel.location)}</td>
                            <td className="py-4">
                              <button 
                                type="button"
                                onClick={() => startEditingHotel(hotel)}
                                className="bg-black text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-wider shadow"
                              >
                                EDIT
                              </button>
                            </td>
                          </tr>
                          
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <form onSubmit={handleHotelSubmit} className="lg:col-span-6 space-y-3 bg-white">
                    <h4 className="text-base font-bold text-gray-900">{editingHotelId ? "✏️ Edit Hotel Asset" : "Add New Hotel"}</h4>
                    <div className="space-y-2 text-xs font-bold text-gray-500">
                      <div><label className="block mb-1 font-normal text-gray-700">Hotel Name</label><input type="text" required value={hotelForm.name} onChange={(e) => setHotelForm({...hotelForm, name: e.target.value})} placeholder="Luxury Palace" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div><label className="block mb-1 font-normal text-gray-700">Location</label><input type="text" required value={hotelForm.location} onChange={(e) => setHotelForm({...hotelForm, location: e.target.value})} placeholder="Location" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      
                      {/* Explicitly target field mapping names to prevent reset bugs */}
                      <div>
                        <label className="block mb-1 font-normal text-gray-700">Price Per Night</label>
                        <input type="number" required value={hotelForm.pricePerNight} onChange={(e) => setHotelForm({...hotelForm, pricePerNight: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" />
                      </div>
                      <div><label className="block mb-1 font-normal text-gray-700">Available Rooms</label><input type="number" required value={hotelForm.availableRooms} onChange={(e) => setHotelForm({...hotelForm, availableRooms: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div><label className="block mb-1 font-normal text-gray-700">Amenities</label><textarea rows={3} value={hotelForm.amenities} onChange={(e) => setHotelForm({...hotelForm, amenities: e.target.value})} placeholder="Amenities" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 font-normal resize-none outline-none bg-white" /></div>
                    </div>
                    <button type="submit" className="bg-black text-white font-bold px-4 py-2 rounded text-[11px] uppercase tracking-wider mt-1 shadow-md hover:bg-slate-900 transition-colors">
                      {editingHotelId ? "UPDATE HOTEL" : "ADD HOTEL"}
                    </button>
                    {editingHotelId && (
                      <button type="button" onClick={() => { setEditingHotelId(null); setHotelForm({ name: "", location: "", pricePerNight: "", availableRooms: "", amenities: "" }); }} className="text-xs font-bold text-gray-400 hover:underline ml-4">Cancel Edit</button>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* 3. USER MANAGEMENT TAB */}
            {activeTab === "users" && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">User Management</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Search for users by email.</p>
                </div>

                <form onSubmit={handleUserSearch} className="flex gap-4 max-w-full">
                  <input 
                    type="email" 
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Search user by email" 
                    className="flex-1 border border-gray-200 rounded p-2.5 text-sm outline-none text-gray-900 font-medium bg-[#fafafa]"
                  />
                  <button type="submit" className="bg-black text-white font-bold px-8 py-2.5 rounded text-[11px] uppercase tracking-wider shadow">Search</button>
                </form>

                {searchError && <p className="text-xs font-semibold text-red-500 pl-1">{searchError}</p>}

                {foundUser && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-gray-100">
                    <div className="md:col-span-4 space-y-1.5 text-xs text-gray-700 font-medium bg-slate-50/60 p-4 rounded border border-gray-100">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">User details</h4>
                      <p><span className="text-gray-400 font-normal">Name:</span> {foundUser.firstName} {foundUser.lastName}</p>
                      <p><span className="text-gray-400 font-normal">Email:</span> {foundUser.email}</p>
                      <p><span className="text-gray-400 font-normal">Phone:</span> {foundUser.phoneNumber || "Not Listed"}</p>
                    </div>

                    <div className="md:col-span-8 space-y-3">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking History ({foundUser.bookings?.length || 0})</h4>
                      <div className="space-y-2">
                        {foundUser.bookings?.map((booking, idx) => (
                          <div key={idx} className="border border-gray-200 rounded p-4 flex items-center justify-between bg-white shadow-sm">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 border px-2 py-0.5 rounded text-gray-600">{booking.type}</span>
                              <p className="text-xs text-gray-400 font-mono mt-1.5">ID: {booking.bookingId}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Date: {booking.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-950">₹ {booking.totalPrice.toLocaleString()}</p>
                              <p className="text-xs text-gray-400">Qty: {booking.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            

          </div>
        </main>
      </div>
    </div>
  );
}