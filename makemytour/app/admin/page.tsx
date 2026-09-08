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
  _id?: string;
  name: string;
  from: string;
  to: string;
  departureTime?: string;
  arrivalTime?: string;
  price?: number;
  availableSeats: number;
  daysOfRun?: string; 
  nation?: string;    
}

interface HotelData {
  id?: string;
  _id?: string;
  name: string;
  location: string;
  pricePerNight?: number;
  availableRooms: number;
  amenities?: string;
  nation?: string;    
}

interface HomestayData {
  id?: string;
  _id?: string;
  name: string;
  location: string;
  pricePerNight?: number;
  availableRooms: number;
  nation?: string;
}

interface HolidayData {
  id?: string;
  _id?: string;
  packageName: string;
  destination: string;
  duration: string;
  price?: number;
  availableSlots: number;
  nation?: string;
}

interface TrainData {
  id?: string;
  _id?: string;
  trainName: string;
  from: string;
  to: string;
  price?: number;
  availableSeats: number;
  daysOfRun?: string;
  nation?: string;
}

interface BusData {
  id?: string;
  _id?: string;
  operatorName: string;
  from: string;
  to: string;
  price?: number;
  availableSeats: number;
  busType?: string;
  nation?: string;
}

interface TourismData {
  id?: string;
  _id?: string;
  tourName: string;
  location: string;
  duration: string;
  price?: number;
  availableSlots: number;
  nation?: string;
}

interface FoodData {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  category?: string;
  nation?: string;
}

type AdminTab = "flights" | "hotels" | "homestays" | "holiday" | "trains" | "buses" | "tourism" | "food" | "users";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("flights");
  const [actionMessage, setActionMessage] = useState("");
  
  // Loading button states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editing state trackers
  const [editingFlightId, setEditingFlightId] = useState<string | null>(null);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
  const [editingHomestayId, setEditingHomestayId] = useState<string | null>(null);
  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);
  const [editingTrainId, setEditingTrainId] = useState<string | null>(null);
  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  const [editingTourismId, setEditingTourismId] = useState<string | null>(null);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);

  // Users Tab States
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<SearchedUser | null>(null);
  const [searchError, setSearchError] = useState("");

  // Forms and Lists States
  const [flightsList, setFlightsList] = useState<FlightData[]>([]);
  const [flightForm, setFlightForm] = useState({ name: "", from: "", to: "", departureTime: "", arrivalTime: "", price: "", availableSeats: "", daysOfRun: "", nation: "India" });

  const [hotelsList, setHotelsList] = useState<HotelData[]>([]);
  const [hotelForm, setHotelForm] = useState({ name: "", location: "", pricePerNight: "", availableRooms: "", amenities: "", nation: "India" });

  const [homestaysList, setHomestaysList] = useState<HomestayData[]>([]);
  const [homestayForm, setHomestayForm] = useState({ name: "", location: "", pricePerNight: "", availableRooms: "", nation: "India" });

  const [holidayList, setHolidayList] = useState<HolidayData[]>([]);
  const [holidayForm, setHolidayForm] = useState({ packageName: "", destination: "", duration: "", price: "", availableSlots: "", nation: "India" });

  const [trainsList, setTrainsList] = useState<TrainData[]>([]);
  const [trainForm, setTrainForm] = useState({ trainName: "", from: "", to: "", price: "", availableSeats: "", daysOfRun: "", nation: "India" });

  const [busesList, setBusesList] = useState<BusData[]>([]);
  const [busForm, setBusForm] = useState({ operatorName: "", from: "", to: "", price: "", availableSeats: "", busType: "AC Sleeper", nation: "India" });

  const [tourismList, setTourismList] = useState<TourismData[]>([]);
  const [tourismForm, setTourismForm] = useState({ tourName: "", location: "", duration: "", price: "", availableSlots: "", nation: "India" });

  const [foodList, setFoodList] = useState<FoodData[]>([]);
  const [foodForm, setFoodForm] = useState({ name: "", price: "", category: "Main Course", nation: "India" });

  useEffect(() => {
    fetchFlights();
    fetchHotels();
    fetchHomestays();
    fetchHolidays();
    fetchTrains();
    fetchBuses();
    fetchTourism();
    fetchFood();
  }, []);

  const fetchFlights = () => {
    const deletedIds = JSON.parse(localStorage.getItem("deletedFlightIds") || "[]");
    const localCustom = JSON.parse(localStorage.getItem("customFlights") || "[]");
    const defaults = [
      { id: "fl_101", name: "SkyHigh 202", from: "Paris", to: "Tokyo", price: 3500, availableSeats: 45, daysOfRun: "Mon, Wed, Fri", nation: "International" },
      { id: "fl_102", name: "AirOne 101", from: "New York", to: "London", price: 5000, availableSeats: 12, daysOfRun: "Daily", nation: "International" },
      { id: "fl_103", name: "AirIndia 33", from: "Bangalore", to: "Delhi", price: 4200, availableSeats: 8, daysOfRun: "Tue, Thu", nation: "India" }
    ];
    const combined = [...localCustom, ...defaults].filter(f => !deletedIds.includes(f.id || f._id));
    setFlightsList(combined);
  };

  const fetchHotels = () => {
    const deletedIds = JSON.parse(localStorage.getItem("deletedHotelIds") || "[]");
    const localCustom = JSON.parse(localStorage.getItem("customHotels") || "[]");
    const defaults = [
      { id: "ht_201", name: "Luxury Palace", location: "Paris, France", pricePerNight: 3000, availableRooms: 20, nation: "International" }
    ];
    setHotelsList([...localCustom, ...defaults].filter(h => !deletedIds.includes(h.id || h._id)));
  };

  const fetchHomestays = () => {
    const deletedIds = JSON.parse(localStorage.getItem("deletedHomestayIds") || "[]");
    const localCustom = JSON.parse(localStorage.getItem("customHomestays") || "[]");
    const defaults = [
      { id: "hm_301", name: "Green Valley Villa", location: "Coorg, Karnataka", pricePerNight: 2500, availableRooms: 5, nation: "India" }
    ];
    setHomestaysList([...localCustom, ...defaults].filter(x => !deletedIds.includes(x.id || x._id)));
  };

  const fetchHolidays = () => {
    const deletedIds = JSON.parse(localStorage.getItem("deletedHolidayIds") || "[]");
    const localCustom = JSON.parse(localStorage.getItem("customHolidays") || "[]");
    const defaults = [
      { id: "hd_401", packageName: "Tropical Bali Getaway", destination: "Bali, Indonesia", duration: "5 Days / 4 Nights", price: 24000, availableSlots: 15, nation: "International" }
    ];
    setHolidayList([...localCustom, ...defaults].filter(x => !deletedIds.includes(x.id || x._id)));
  };

  const fetchTrains = () => {
    const deletedIds = JSON.parse(localStorage.getItem("deletedTrainIds") || "[]");
    const localCustom = JSON.parse(localStorage.getItem("customTrains") || "[]");
    const defaults = [
      { id: "tr_501", trainName: "Rajdhani Express", from: "Bangalore", to: "Delhi", price: 1800, availableSeats: 60, daysOfRun: "Daily", nation: "India" }
    ];
    setTrainsList([...localCustom, ...defaults].filter(x => !deletedIds.includes(x.id || x._id)));
  };

  const fetchBuses = () => {
    const deletedIds = JSON.parse(localStorage.getItem("deletedBusIds") || "[]");
    const localCustom = JSON.parse(localStorage.getItem("customBuses") || "[]");
    const defaults = [
      { id: "bs_601", operatorName: "VRL Travels AC Sleeper", from: "Bangalore", to: "Goa", price: 1200, availableSeats: 24, busType: "AC Sleeper", nation: "India" }
    ];
    setBusesList([...localCustom, ...defaults].filter(x => !deletedIds.includes(x.id || x._id)));
  };

  const fetchTourism = () => {
    const deletedIds = JSON.parse(localStorage.getItem("deletedTourismIds") || "[]");
    const localCustom = JSON.parse(localStorage.getItem("customTourism") || "[]");
    const defaults = [
      { id: "ts_701", tourName: "Eiffel Tower Skip-the-Line Tour", location: "Paris, France", duration: "4 Hours", price: 4500, availableSlots: 30, nation: "International" }
    ];
    setTourismList([...localCustom, ...defaults].filter(x => !deletedIds.includes(x.id || x._id)));
  };

  const fetchFood = () => {
    const deletedIds = JSON.parse(localStorage.getItem("deletedFoodIds") || "[]");
    const localCustom = JSON.parse(localStorage.getItem("adminFoodMenu") || "[]");
    const defaults = [
      { id: "fd_801", name: "Gourmet Chicken Biryani", price: 350, category: "Main Course", nation: "India" },
      { id: "fd_802", name: "Tandoori Paneer Wrap", price: 220, category: "Snacks", nation: "India" },
      { id: "fd_803", name: "Crispy Veggie Burger & Fries", price: 280, category: "Fast Food", nation: "India" },
      { id: "fd_804", name: "Fresh Tropical Fruit Smoothie", price: 180, category: "Beverages", nation: "India" }
    ];
    const combined = [...localCustom, ...defaults].filter(f => !deletedIds.includes(f.id || f._id));
    setFoodList(combined);
  };

  const formatCurrency = (price: number | undefined, nation: string = "") => {
    const val = price || 0;
    return (nation || "").toLowerCase().includes("india") ? `₹${val.toLocaleString()}` : `$${val.toLocaleString()}`;
  };

  // SUBMIT HANDLERS
  const handleFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      id: editingFlightId || ("fl_" + Date.now()),
      _id: editingFlightId || ("fl_" + Date.now()),
      name: flightForm.name,
      from: flightForm.from,
      to: flightForm.to,
      departureTime: flightForm.departureTime,
      arrivalTime: flightForm.arrivalTime,
      price: Number(flightForm.price) || 0,
      availableSeats: Number(flightForm.availableSeats) || 0,
      daysOfRun: flightForm.daysOfRun,
      nation: flightForm.nation
    };
    const updated = editingFlightId ? flightsList.map(f => (f.id === editingFlightId || f._id === editingFlightId) ? payload : f) : [payload, ...flightsList];
    setFlightsList(updated);
    localStorage.setItem("customFlights", JSON.stringify(updated.filter(f => String(f.id || f._id).startsWith("fl_"))));
    setActionMessage(editingFlightId ? "Flight route updated successfully!" : "Flight configured successfully!");
    setEditingFlightId(null);
    setFlightForm({ name: "", from: "", to: "", departureTime: "", arrivalTime: "", price: "", availableSeats: "", daysOfRun: "", nation: "India" });
    setIsSubmitting(false);
  };

  const handleHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      id: editingHotelId || ("ht_" + Date.now()),
      _id: editingHotelId || ("ht_" + Date.now()),
      name: hotelForm.name,
      location: hotelForm.location,
      pricePerNight: Number(hotelForm.pricePerNight) || 0,
      availableRooms: Number(hotelForm.availableRooms) || 0,
      amenities: hotelForm.amenities,
      nation: hotelForm.nation
    };
    const updated = editingHotelId ? hotelsList.map(h => (h.id === editingHotelId || h._id === editingHotelId) ? payload : h) : [payload, ...hotelsList];
    setHotelsList(updated);
    localStorage.setItem("customHotels", JSON.stringify(updated.filter(h => String(h.id || h._id).startsWith("ht_"))));
    setActionMessage(editingHotelId ? "Hotel updated successfully!" : "Hotel configured successfully!");
    setEditingHotelId(null);
    setHotelForm({ name: "", location: "", pricePerNight: "", availableRooms: "", amenities: "", nation: "India" });
    setIsSubmitting(false);
  };

  const handleHomestaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      id: editingHomestayId || ("hm_" + Date.now()),
      _id: editingHomestayId || ("hm_" + Date.now()),
      name: homestayForm.name,
      location: homestayForm.location,
      pricePerNight: Number(homestayForm.pricePerNight) || 0,
      availableRooms: Number(homestayForm.availableRooms) || 0,
      nation: homestayForm.nation
    };
    const updated = editingHomestayId ? homestaysList.map(x => (x.id === editingHomestayId || x._id === editingHomestayId) ? payload : x) : [payload, ...homestaysList];
    setHomestaysList(updated);
    localStorage.setItem("customHomestays", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("hm_"))));
    setActionMessage(editingHomestayId ? "Homestay updated successfully!" : "Homestay configured successfully!");
    setEditingHomestayId(null);
    setHomestayForm({ name: "", location: "", pricePerNight: "", availableRooms: "", nation: "India" });
    setIsSubmitting(false);
  };

  const handleHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      id: editingHolidayId || ("hd_" + Date.now()),
      _id: editingHolidayId || ("hd_" + Date.now()),
      packageName: holidayForm.packageName,
      destination: holidayForm.destination,
      duration: holidayForm.duration,
      price: Number(holidayForm.price) || 0,
      availableSlots: Number(holidayForm.availableSlots) || 0,
      nation: holidayForm.nation
    };
    const updated = editingHolidayId ? holidayList.map(x => (x.id === editingHolidayId || x._id === editingHolidayId) ? payload : x) : [payload, ...holidayList];
    setHolidayList(updated);
    localStorage.setItem("customHolidays", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("hd_"))));
    setActionMessage(editingHolidayId ? "Holiday package updated successfully!" : "Holiday package configured successfully!");
    setEditingHolidayId(null);
    setHolidayForm({ packageName: "", destination: "", duration: "", price: "", availableSlots: "", nation: "India" });
    setIsSubmitting(false);
  };

  const handleTrainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      id: editingTrainId || ("tr_" + Date.now()),
      _id: editingTrainId || ("tr_" + Date.now()),
      trainName: trainForm.trainName,
      from: trainForm.from,
      to: trainForm.to,
      price: Number(trainForm.price) || 0,
      availableSeats: Number(trainForm.availableSeats) || 0,
      daysOfRun: trainForm.daysOfRun,
      nation: trainForm.nation
    };
    const updated = editingTrainId ? trainsList.map(x => (x.id === editingTrainId || x._id === editingTrainId) ? payload : x) : [payload, ...trainsList];
    setTrainsList(updated);
    localStorage.setItem("customTrains", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("tr_"))));
    setActionMessage(editingTrainId ? "Train updated successfully!" : "Train route configured successfully!");
    setEditingTrainId(null);
    setTrainForm({ trainName: "", from: "", to: "", price: "", availableSeats: "", daysOfRun: "", nation: "India" });
    setIsSubmitting(false);
  };

  const handleBusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      id: editingBusId || ("bs_" + Date.now()),
      _id: editingBusId || ("bs_" + Date.now()),
      operatorName: busForm.operatorName,
      from: busForm.from,
      to: busForm.to,
      price: Number(busForm.price) || 0,
      availableSeats: Number(busForm.availableSeats) || 0,
      busType: busForm.busType,
      nation: busForm.nation
    };
    const updated = editingBusId ? busesList.map(x => (x.id === editingBusId || x._id === editingBusId) ? payload : x) : [payload, ...busesList];
    setBusesList(updated);
    localStorage.setItem("customBuses", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("bs_"))));
    setActionMessage(editingBusId ? "Bus route updated successfully!" : "Bus route configured successfully!");
    setEditingBusId(null);
    setBusForm({ operatorName: "", from: "", to: "", price: "", availableSeats: "", busType: "AC Sleeper", nation: "India" });
    setIsSubmitting(false);
  };

  const handleTourismSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      id: editingTourismId || ("ts_" + Date.now()),
      _id: editingTourismId || ("ts_" + Date.now()),
      tourName: tourismForm.tourName,
      location: tourismForm.location,
      duration: tourismForm.duration,
      price: Number(tourismForm.price) || 0,
      availableSlots: Number(tourismForm.availableSlots) || 0,
      nation: tourismForm.nation
    };
    const updated = editingTourismId ? tourismList.map(x => (x.id === editingTourismId || x._id === editingTourismId) ? payload : x) : [payload, ...tourismList];
    setTourismList(updated);
    localStorage.setItem("customTourism", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("ts_"))));
    setActionMessage(editingTourismId ? "Tourism package updated successfully!" : "Tourism package configured successfully!");
    setEditingTourismId(null);
    setTourismForm({ tourName: "", location: "", duration: "", price: "", availableSlots: "", nation: "India" });
    setIsSubmitting(false);
  };

  const handleFoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      id: editingFoodId || ("fd_" + Date.now()),
      _id: editingFoodId || ("fd_" + Date.now()),
      name: foodForm.name,
      price: Number(foodForm.price) || 0,
      category: foodForm.category,
      nation: foodForm.nation
    };
    const updated = editingFoodId ? foodList.map(x => (x.id === editingFoodId || x._id === editingFoodId) ? payload : x) : [payload, ...foodList];
    setFoodList(updated);
    localStorage.setItem("adminFoodMenu", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("fd_"))));
    setActionMessage(editingFoodId ? "Food item updated successfully!" : "Food item added to menu successfully!");
    setEditingFoodId(null);
    setFoodForm({ name: "", price: "", category: "Main Course", nation: "India" });
    setIsSubmitting(false);
  };

  // DELETE HANDLERS
  const handleDelete = (type: string, id: string | undefined) => {
    if (!id) return;
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    if (type === "flight") {
      const deletedIds = JSON.parse(localStorage.getItem("deletedFlightIds") || "[]");
      localStorage.setItem("deletedFlightIds", JSON.stringify([...deletedIds, id]));
      const updated = flightsList.filter(f => (f.id !== id && f._id !== id));
      setFlightsList(updated);
      localStorage.setItem("customFlights", JSON.stringify(updated.filter(f => String(f.id || f._id).startsWith("fl_"))));
    } else if (type === "hotel") {
      const deletedIds = JSON.parse(localStorage.getItem("deletedHotelIds") || "[]");
      localStorage.setItem("deletedHotelIds", JSON.stringify([...deletedIds, id]));
      const updated = hotelsList.filter(h => (h.id !== id && h._id !== id));
      setHotelsList(updated);
      localStorage.setItem("customHotels", JSON.stringify(updated.filter(h => String(h.id || h._id).startsWith("ht_"))));
    } else if (type === "homestay") {
      const deletedIds = JSON.parse(localStorage.getItem("deletedHomestayIds") || "[]");
      localStorage.setItem("deletedHomestayIds", JSON.stringify([...deletedIds, id]));
      const updated = homestaysList.filter(x => (x.id !== id && x._id !== id));
      setHomestaysList(updated);
      localStorage.setItem("customHomestays", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("hm_"))));
    } else if (type === "holiday") {
      const deletedIds = JSON.parse(localStorage.getItem("deletedHolidayIds") || "[]");
      localStorage.setItem("deletedHolidayIds", JSON.stringify([...deletedIds, id]));
      const updated = holidayList.filter(x => (x.id !== id && x._id !== id));
      setHolidayList(updated);
      localStorage.setItem("customHolidays", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("hd_"))));
    } else if (type === "train") {
      const deletedIds = JSON.parse(localStorage.getItem("deletedTrainIds") || "[]");
      localStorage.setItem("deletedTrainIds", JSON.stringify([...deletedIds, id]));
      const updated = trainsList.filter(x => (x.id !== id && x._id !== id));
      setTrainsList(updated);
      localStorage.setItem("customTrains", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("tr_"))));
    } else if (type === "bus") {
      const deletedIds = JSON.parse(localStorage.getItem("deletedBusIds") || "[]");
      localStorage.setItem("deletedBusIds", JSON.stringify([...deletedIds, id]));
      const updated = busesList.filter(x => (x.id !== id && x._id !== id));
      setBusesList(updated);
      localStorage.setItem("customBuses", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("bs_"))));
    } else if (type === "tourism") {
      const deletedIds = JSON.parse(localStorage.getItem("deletedTourismIds") || "[]");
      localStorage.setItem("deletedTourismIds", JSON.stringify([...deletedIds, id]));
      const updated = tourismList.filter(x => (x.id !== id && x._id !== id));
      setTourismList(updated);
      localStorage.setItem("customTourism", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("ts_"))));
    } else if (type === "food") {
      const deletedIds = JSON.parse(localStorage.getItem("deletedFoodIds") || "[]");
      localStorage.setItem("deletedFoodIds", JSON.stringify([...deletedIds, id]));
      const updated = foodList.filter(x => (x.id !== id && x._id !== id));
      setFoodList(updated);
      localStorage.setItem("adminFoodMenu", JSON.stringify(updated.filter(x => String(x.id || x._id).startsWith("fd_"))));
    }
    setActionMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
  };

  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    setSearchError("");
    setFoundUser(null);
    if (searchEmail.trim().toLowerCase() === "rayaappa@gmail.com") {
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

          {/* EXTENDED NAVIGATION TABS BAR */}
          <div className="w-full flex bg-[#f5f5f5] border border-gray-200/60 rounded text-xs text-gray-600 overflow-x-auto font-medium whitespace-nowrap">
            {(["flights", "hotels", "homestays", "holiday", "trains", "buses", "tourism", "food", "users"] as AdminTab[]).map((tab) => (
              <button 
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); setActionMessage(""); }}
                className={`flex-1 py-3 px-4 text-center border-r border-gray-200/40 uppercase tracking-wider ${activeTab === tab ? "bg-[#e4e4e5] text-gray-900 font-bold" : "hover:bg-gray-200/30"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {actionMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded text-emerald-800 font-semibold text-sm text-left">
              {actionMessage}
            </div>
          )}

          <div className="pt-2">
            
            {/* 1. FLIGHTS TAB */}
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
                          <th className="pb-3 font-normal w-1/4">Name</th>
                          <th className="pb-3 font-normal w-1/5">From</th>
                          <th className="pb-3 font-normal w-1/5">To</th>
                          <th className="pb-3 font-normal w-1/5">Price</th>
                          <th className="pb-3 font-normal w-1/4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 divide-y divide-gray-100 font-medium">
                        {flightsList.map((flight, idx) => (
                          <tr key={idx}>
                            <td className="py-4 text-gray-900 font-bold">{flight.name}</td>
                            <td className="py-4 text-gray-500">{flight.from}</td>
                            <td className="py-4 text-gray-500">{flight.to}</td>
                            <td className="py-4 text-gray-900 font-semibold">{formatCurrency(flight.price, flight.nation)}</td>
                            <td className="py-4 flex gap-1 items-center">
                              <button onClick={() => { setEditingFlightId(flight.id || flight._id || null); setFlightForm({ name: flight.name, from: flight.from, to: flight.to, departureTime: flight.departureTime || "", arrivalTime: flight.arrivalTime || "", price: String(flight.price || ""), availableSeats: String(flight.availableSeats), daysOfRun: flight.daysOfRun || "", nation: flight.nation || "India" }); }} className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">EDIT</button>
                              <button onClick={() => handleDelete("flight", flight.id || flight._id)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">DEL</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <form onSubmit={handleFlightSubmit} className="lg:col-span-6 space-y-3 bg-white">
                    <h4 className="text-base font-bold text-gray-900">{editingFlightId ? "✏️ Edit Flight" : "Add New Flight"}</h4>
                    <div className="space-y-2 text-xs font-bold text-gray-500">
                      <div><label className="block mb-1 font-normal text-gray-700">Flight Name</label><input type="text" required value={flightForm.name} onChange={(e) => setFlightForm({...flightForm, name: e.target.value})} placeholder="SkyHigh 202" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">From</label><input type="text" required value={flightForm.from} onChange={(e) => setFlightForm({...flightForm, from: e.target.value})} placeholder="Departure" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                        <div><label className="block mb-1 font-normal text-gray-700">To</label><input type="text" required value={flightForm.to} onChange={(e) => setFlightForm({...flightForm, to: e.target.value})} placeholder="Destination" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Nation</label><select value={flightForm.nation} onChange={(e) => setFlightForm({...flightForm, nation: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal"><option value="India">India (₹)</option><option value="International">International ($)</option></select></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Days of Run</label><input type="text" value={flightForm.daysOfRun} onChange={(e) => setFlightForm({...flightForm, daysOfRun: e.target.value})} placeholder="Daily, Mon-Fri" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Price</label><input type="number" required value={flightForm.price} onChange={(e) => setFlightForm({...flightForm, price: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Available Seats</label><input type="number" required value={flightForm.availableSeats} onChange={(e) => setFlightForm({...flightForm, availableSeats: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-black text-white font-bold px-4 py-2.5 rounded text-[11px] uppercase tracking-wider mt-1 active:scale-95 transition-all shadow">{editingFlightId ? "UPDATE FLIGHT" : "ADD FLIGHT"}</button>
                    {editingFlightId && <button type="button" onClick={() => { setEditingFlightId(null); setFlightForm({ name: "", from: "", to: "", departureTime: "", arrivalTime: "", price: "", availableSeats: "", daysOfRun: "", nation: "India" }); }} className="text-xs font-bold text-gray-400 hover:underline ml-4">Cancel Edit</button>}
                  </form>
                </div>
              </div>
            )}

            {/* 2. HOTELS TAB */}
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
                          <th className="pb-3 font-normal w-1/3">Name</th>
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
                            <td className="py-4 text-gray-500">{formatCurrency(hotel.pricePerNight, hotel.nation)}</td>
                            <td className="py-4 flex gap-1 items-center">
                              <button onClick={() => { setEditingHotelId(hotel.id || hotel._id || null); setHotelForm({ name: hotel.name, location: hotel.location, pricePerNight: String(hotel.pricePerNight || ""), availableRooms: String(hotel.availableRooms), amenities: hotel.amenities || "", nation: hotel.nation || "India" }); }} className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">EDIT</button>
                              <button onClick={() => handleDelete("hotel", hotel.id || hotel._id)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">DEL</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <form onSubmit={handleHotelSubmit} className="lg:col-span-6 space-y-3 bg-white">
                    <h4 className="text-base font-bold text-gray-900">{editingHotelId ? "✏️ Edit Hotel" : "Add New Hotel"}</h4>
                    <div className="space-y-2 text-xs font-bold text-gray-500">
                      <div><label className="block mb-1 font-normal text-gray-700">Hotel Name</label><input type="text" required value={hotelForm.name} onChange={(e) => setHotelForm({...hotelForm, name: e.target.value})} placeholder="Luxury Palace" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div><label className="block mb-1 font-normal text-gray-700">Location</label><input type="text" required value={hotelForm.location} onChange={(e) => setHotelForm({...hotelForm, location: e.target.value})} placeholder="Paris, France" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Nation</label><select value={hotelForm.nation} onChange={(e) => setHotelForm({...hotelForm, nation: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal"><option value="India">India (₹)</option><option value="International">International ($)</option></select></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Price/Night</label><input type="number" required value={hotelForm.pricePerNight} onChange={(e) => setHotelForm({...hotelForm, pricePerNight: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      </div>
                      <div><label className="block mb-1 font-normal text-gray-700">Available Rooms</label><input type="number" required value={hotelForm.availableRooms} onChange={(e) => setHotelForm({...hotelForm, availableRooms: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-black text-white font-bold px-4 py-2.5 rounded text-[11px] uppercase tracking-wider mt-1 active:scale-95 transition-all shadow">{editingHotelId ? "UPDATE HOTEL" : "ADD HOTEL"}</button>
                    {editingHotelId && <button type="button" onClick={() => { setEditingHotelId(null); setHotelForm({ name: "", location: "", pricePerNight: "", availableRooms: "", amenities: "", nation: "India" }); }} className="text-xs font-bold text-gray-400 hover:underline ml-4">Cancel Edit</button>}
                  </form>
                </div>
              </div>
            )}

            {/* 3. HOMESTAYS TAB */}
            {activeTab === "homestays" && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Manage Homestays</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Add, edit, or remove homestays from the system.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-1 items-start">
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="text-base font-bold text-gray-900">Homestay List</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-200">
                          <th className="pb-3 font-normal w-1/3">Name</th>
                          <th className="pb-3 font-normal w-1/4">Location</th>
                          <th className="pb-3 font-normal w-1/4">Price/Night</th>
                          <th className="pb-3 font-normal w-1/4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 divide-y divide-gray-100 font-medium">
                        {homestaysList.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-4 text-gray-900 font-bold">{item.name}</td>
                            <td className="py-4 text-gray-500">{item.location}</td>
                            <td className="py-4 text-gray-500">{formatCurrency(item.pricePerNight, item.nation)}</td>
                            <td className="py-4 flex gap-1 items-center">
                              <button onClick={() => { setEditingHomestayId(item.id || item._id || null); setHomestayForm({ name: item.name, location: item.location, pricePerNight: String(item.pricePerNight || ""), availableRooms: String(item.availableRooms), nation: item.nation || "India" }); }} className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">EDIT</button>
                              <button onClick={() => handleDelete("homestay", item.id || item._id)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">DEL</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <form onSubmit={handleHomestaySubmit} className="lg:col-span-6 space-y-3 bg-white">
                    <h4 className="text-base font-bold text-gray-900">{editingHomestayId ? "✏️ Edit Homestay" : "Add New Homestay"}</h4>
                    <div className="space-y-2 text-xs font-bold text-gray-500">
                      <div><label className="block mb-1 font-normal text-gray-700">Homestay Name</label><input type="text" required value={homestayForm.name} onChange={(e) => setHomestayForm({...homestayForm, name: e.target.value})} placeholder="Green Valley Villa" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div><label className="block mb-1 font-normal text-gray-700">Location</label><input type="text" required value={homestayForm.location} onChange={(e) => setHomestayForm({...homestayForm, location: e.target.value})} placeholder="Coorg, Karnataka" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Nation</label><select value={homestayForm.nation} onChange={(e) => setHomestayForm({...homestayForm, nation: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal"><option value="India">India (₹)</option><option value="International">International ($)</option></select></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Price/Night</label><input type="number" required value={homestayForm.pricePerNight} onChange={(e) => setHomestayForm({...homestayForm, pricePerNight: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      </div>
                      <div><label className="block mb-1 font-normal text-gray-700">Available Rooms</label><input type="number" required value={homestayForm.availableRooms} onChange={(e) => setHomestayForm({...homestayForm, availableRooms: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-black text-white font-bold px-4 py-2.5 rounded text-[11px] uppercase tracking-wider mt-1 active:scale-95 transition-all shadow">{editingHomestayId ? "UPDATE HOMESTAY" : "ADD HOMESTAY"}</button>
                    {editingHomestayId && <button type="button" onClick={() => { setEditingHomestayId(null); setHomestayForm({ name: "", location: "", pricePerNight: "", availableRooms: "", nation: "India" }); }} className="text-xs font-bold text-gray-400 hover:underline ml-4">Cancel Edit</button>}
                  </form>
                </div>
              </div>
            )}

            {/* 4. HOLIDAY PACKAGES TAB */}
            {activeTab === "holiday" && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Manage Holiday Packages</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Add, edit, or remove holiday packages.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-1 items-start">
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="text-base font-bold text-gray-900">Holiday List</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-200">
                          <th className="pb-3 font-normal w-1/3">Package</th>
                          <th className="pb-3 font-normal w-1/4">Destination</th>
                          <th className="pb-3 font-normal w-1/4">Price</th>
                          <th className="pb-3 font-normal w-1/4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 divide-y divide-gray-100 font-medium">
                        {holidayList.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-4 text-gray-900 font-bold">{item.packageName}</td>
                            <td className="py-4 text-gray-500">{item.destination}</td>
                            <td className="py-4 text-gray-500">{formatCurrency(item.price, item.nation)}</td>
                            <td className="py-4 flex gap-1 items-center">
                              <button onClick={() => { setEditingHolidayId(item.id || item._id || null); setHolidayForm({ packageName: item.packageName, destination: item.destination, duration: item.duration, price: String(item.price || ""), availableSlots: String(item.availableSlots), nation: item.nation || "India" }); }} className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">EDIT</button>
                              <button onClick={() => handleDelete("holiday", item.id || item._id)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">DEL</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <form onSubmit={handleHolidaySubmit} className="lg:col-span-6 space-y-3 bg-white">
                    <h4 className="text-base font-bold text-gray-900">{editingHolidayId ? "✏️ Edit Holiday" : "Add New Holiday"}</h4>
                    <div className="space-y-2 text-xs font-bold text-gray-500">
                      <div><label className="block mb-1 font-normal text-gray-700">Package Name</label><input type="text" required value={holidayForm.packageName} onChange={(e) => setHolidayForm({...holidayForm, packageName: e.target.value})} placeholder="Tropical Bali Getaway" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Destination</label><input type="text" required value={holidayForm.destination} onChange={(e) => setHolidayForm({...holidayForm, destination: e.target.value})} placeholder="Bali, Indonesia" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Duration</label><input type="text" required value={holidayForm.duration} onChange={(e) => setHolidayForm({...holidayForm, duration: e.target.value})} placeholder="5 Days / 4 Nights" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Nation</label><select value={holidayForm.nation} onChange={(e) => setHolidayForm({...holidayForm, nation: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal"><option value="India">India (₹)</option><option value="International">International ($)</option></select></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Price</label><input type="number" required value={holidayForm.price} onChange={(e) => setHolidayForm({...holidayForm, price: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      </div>
                      <div><label className="block mb-1 font-normal text-gray-700">Available Slots</label><input type="number" required value={holidayForm.availableSlots} onChange={(e) => setHolidayForm({...holidayForm, availableSlots: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-black text-white font-bold px-4 py-2.5 rounded text-[11px] uppercase tracking-wider mt-1 active:scale-95 transition-all shadow">{editingHolidayId ? "UPDATE HOLIDAY" : "ADD HOLIDAY"}</button>
                    {editingHolidayId && <button type="button" onClick={() => { setEditingHolidayId(null); setHolidayForm({ packageName: "", destination: "", duration: "", price: "", availableSlots: "", nation: "India" }); }} className="text-xs font-bold text-gray-400 hover:underline ml-4">Cancel Edit</button>}
                  </form>
                </div>
              </div>
            )}

            {/* 5. TRAINS TAB */}
            {activeTab === "trains" && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Manage Trains</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Add, edit, or remove rail routes.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-1 items-start">
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="text-base font-bold text-gray-900">Train List</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-200">
                          <th className="pb-3 font-normal w-1/3">Train Name</th>
                          <th className="pb-3 font-normal w-1/5">From</th>
                          <th className="pb-3 font-normal w-1/5">To</th>
                          <th className="pb-3 font-normal w-1/5">Price</th>
                          <th className="pb-3 font-normal w-1/4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 divide-y divide-gray-100 font-medium">
                        {trainsList.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-4 text-gray-900 font-bold">{item.trainName}</td>
                            <td className="py-4 text-gray-500">{item.from}</td>
                            <td className="py-4 text-gray-500">{item.to}</td>
                            <td className="py-4 text-gray-500">{formatCurrency(item.price, item.nation)}</td>
                            <td className="py-4 flex gap-1 items-center">
                              <button onClick={() => { setEditingTrainId(item.id || item._id || null); setTrainForm({ trainName: item.trainName, from: item.from, to: item.to, price: String(item.price || ""), availableSeats: String(item.availableSeats), daysOfRun: item.daysOfRun || "", nation: item.nation || "India" }); }} className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">EDIT</button>
                              <button onClick={() => handleDelete("train", item.id || item._id)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">DEL</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <form onSubmit={handleTrainSubmit} className="lg:col-span-6 space-y-3 bg-white">
                    <h4 className="text-base font-bold text-gray-900">{editingTrainId ? "✏️ Edit Train" : "Add New Train Route"}</h4>
                    <div className="space-y-2 text-xs font-bold text-gray-500">
                      <div><label className="block mb-1 font-normal text-gray-700">Train Name / Number</label><input type="text" required value={trainForm.trainName} onChange={(e) => setTrainForm({...trainForm, trainName: e.target.value})} placeholder="Rajdhani Express" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">From</label><input type="text" required value={trainForm.from} onChange={(e) => setTrainForm({...trainForm, from: e.target.value})} placeholder="Departure Station" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                        <div><label className="block mb-1 font-normal text-gray-700">To</label><input type="text" required value={trainForm.to} onChange={(e) => setTrainForm({...trainForm, to: e.target.value})} placeholder="Arrival Station" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Nation</label><select value={trainForm.nation} onChange={(e) => setTrainForm({...trainForm, nation: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal"><option value="India">India (₹)</option><option value="International">International ($)</option></select></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Days of Run</label><input type="text" value={trainForm.daysOfRun} onChange={(e) => setTrainForm({...trainForm, daysOfRun: e.target.value})} placeholder="Daily, Mon, Wed" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Price</label><input type="number" required value={trainForm.price} onChange={(e) => setTrainForm({...trainForm, price: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Available Seats</label><input type="number" required value={trainForm.availableSeats} onChange={(e) => setTrainForm({...trainForm, availableSeats: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-black text-white font-bold px-4 py-2.5 rounded text-[11px] uppercase tracking-wider mt-1 active:scale-95 transition-all shadow">{editingTrainId ? "UPDATE TRAIN" : "ADD TRAIN"}</button>
                    {editingTrainId && <button type="button" onClick={() => { setEditingTrainId(null); setTrainForm({ trainName: "", from: "", to: "", price: "", availableSeats: "", daysOfRun: "", nation: "India" }); }} className="text-xs font-bold text-gray-400 hover:underline ml-4">Cancel Edit</button>}
                  </form>
                </div>
              </div>
            )}

            {/* 6. BUSES TAB */}
            {activeTab === "buses" && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Manage Buses</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Add, edit, or remove bus travel operators.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-1 items-start">
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="text-base font-bold text-gray-900">Bus List</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-200">
                          <th className="pb-3 font-normal w-1/3">Operator</th>
                          <th className="pb-3 font-normal w-1/5">From</th>
                          <th className="pb-3 font-normal w-1/5">To</th>
                          <th className="pb-3 font-normal w-1/5">Price</th>
                          <th className="pb-3 font-normal w-1/4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 divide-y divide-gray-100 font-medium">
                        {busesList.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-4 text-gray-900 font-bold">{item.operatorName}</td>
                            <td className="py-4 text-gray-500">{item.from}</td>
                            <td className="py-4 text-gray-500">{item.to}</td>
                            <td className="py-4 text-gray-500">{formatCurrency(item.price, item.nation)}</td>
                            <td className="py-4 flex gap-1 items-center">
                              <button onClick={() => { setEditingBusId(item.id || item._id || null); setBusForm({ operatorName: item.operatorName, from: item.from, to: item.to, price: String(item.price || ""), availableSeats: String(item.availableSeats), busType: item.busType || "AC Sleeper", nation: item.nation || "India" }); }} className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">EDIT</button>
                              <button onClick={() => handleDelete("bus", item.id || item._id)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">DEL</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <form onSubmit={handleBusSubmit} className="lg:col-span-6 space-y-3 bg-white">
                    <h4 className="text-base font-bold text-gray-900">{editingBusId ? "✏️ Edit Bus" : "Add New Bus Route"}</h4>
                    <div className="space-y-2 text-xs font-bold text-gray-500">
                      <div><label className="block mb-1 font-normal text-gray-700">Operator Name</label><input type="text" required value={busForm.operatorName} onChange={(e) => setBusForm({...busForm, operatorName: e.target.value})} placeholder="VRL Travels" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">From</label><input type="text" required value={busForm.from} onChange={(e) => setBusForm({...busForm, from: e.target.value})} placeholder="Departure City" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                        <div><label className="block mb-1 font-normal text-gray-700">To</label><input type="text" required value={busForm.to} onChange={(e) => setBusForm({...busForm, to: e.target.value})} placeholder="Destination City" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Nation</label><select value={busForm.nation} onChange={(e) => setBusForm({...busForm, nation: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal"><option value="India">India (₹)</option><option value="International">International ($)</option></select></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Bus Type</label><input type="text" value={busForm.busType} onChange={(e) => setBusForm({...busForm, busType: e.target.value})} placeholder="AC Sleeper / Seater" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Price</label><input type="number" required value={busForm.price} onChange={(e) => setBusForm({...busForm, price: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Available Seats</label><input type="number" required value={busForm.availableSeats} onChange={(e) => setBusForm({...busForm, availableSeats: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-black text-white font-bold px-4 py-2.5 rounded text-[11px] uppercase tracking-wider mt-1 active:scale-95 transition-all shadow">{editingBusId ? "UPDATE BUS" : "ADD BUS"}</button>
                    {editingBusId && <button type="button" onClick={() => { setEditingBusId(null); setBusForm({ operatorName: "", from: "", to: "", price: "", availableSeats: "", busType: "AC Sleeper", nation: "India" }); }} className="text-xs font-bold text-gray-400 hover:underline ml-4">Cancel Edit</button>}
                  </form>
                </div>
              </div>
            )}

            {/* 7. TOURISM TAB */}
            {activeTab === "tourism" && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Manage Tourism Excursions</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Add, edit, or remove guided tours.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-1 items-start">
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="text-base font-bold text-gray-900">Tourism List</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-200">
                          <th className="pb-3 font-normal w-1/3">Tour Name</th>
                          <th className="pb-3 font-normal w-1/4">Location</th>
                          <th className="pb-3 font-normal w-1/4">Price</th>
                          <th className="pb-3 font-normal w-1/4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 divide-y divide-gray-100 font-medium">
                        {tourismList.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-4 text-gray-900 font-bold">{item.tourName}</td>
                            <td className="py-4 text-gray-500">{item.location}</td>
                            <td className="py-4 text-gray-500">{formatCurrency(item.price, item.nation)}</td>
                            <td className="py-4 flex gap-1 items-center">
                              <button onClick={() => { setEditingTourismId(item.id || item._id || null); setTourismForm({ tourName: item.tourName, location: item.location, duration: item.duration, price: String(item.price || ""), availableSlots: String(item.availableSlots), nation: item.nation || "India" }); }} className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">EDIT</button>
                              <button onClick={() => handleDelete("tourism", item.id || item._id)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">DEL</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <form onSubmit={handleTourismSubmit} className="lg:col-span-6 space-y-3 bg-white">
                    <h4 className="text-base font-bold text-gray-900">{editingTourismId ? "✏️ Edit Tour" : "Add New Tourism Excursion"}</h4>
                    <div className="space-y-2 text-xs font-bold text-gray-500">
                      <div><label className="block mb-1 font-normal text-gray-700">Tour Name</label><input type="text" required value={tourismForm.tourName} onChange={(e) => setTourismForm({...tourismForm, tourName: e.target.value})} placeholder="Eiffel Tower Tour" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Location</label><input type="text" required value={tourismForm.location} onChange={(e) => setTourismForm({...tourismForm, location: e.target.value})} placeholder="Paris, France" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Duration</label><input type="text" required value={tourismForm.duration} onChange={(e) => setTourismForm({...tourismForm, duration: e.target.value})} placeholder="4 Hours" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Nation</label><select value={tourismForm.nation} onChange={(e) => setTourismForm({...tourismForm, nation: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal"><option value="India">India (₹)</option><option value="International">International ($)</option></select></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Price</label><input type="number" required value={tourismForm.price} onChange={(e) => setTourismForm({...tourismForm, price: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      </div>
                      <div><label className="block mb-1 font-normal text-gray-700">Available Slots</label><input type="number" required value={tourismForm.availableSlots} onChange={(e) => setTourismForm({...tourismForm, availableSlots: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-black text-white font-bold px-4 py-2.5 rounded text-[11px] uppercase tracking-wider mt-1 active:scale-95 transition-all shadow">{editingTourismId ? "UPDATE TOUR" : "ADD TOUR"}</button>
                    {editingTourismId && <button type="button" onClick={() => { setEditingTourismId(null); setTourismForm({ tourName: "", location: "", duration: "", price: "", availableSlots: "", nation: "India" }); }} className="text-xs font-bold text-gray-400 hover:underline ml-4">Cancel Edit</button>}
                  </form>
                </div>
              </div>
            )}

            {/* 8. FOOD MENU TAB */}
            {activeTab === "food" && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Manage Food Menu</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Add, edit, or remove food items from the delivery menu.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-1 items-start">
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="text-base font-bold text-gray-900">Food Menu List</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-200">
                          <th className="pb-3 font-normal w-1/3">Item Name</th>
                          <th className="pb-3 font-normal w-1/4">Category</th>
                          <th className="pb-3 font-normal w-1/4">Price</th>
                          <th className="pb-3 font-normal w-1/4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 divide-y divide-gray-100 font-medium">
                        {foodList.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-4 text-gray-900 font-bold">{item.name}</td>
                            <td className="py-4 text-gray-500">{item.category || "Main Course"}</td>
                            <td className="py-4 text-gray-500">{formatCurrency(item.price, item.nation)}</td>
                            <td className="py-4 flex gap-1 items-center">
                              <button onClick={() => { setEditingFoodId(item.id || item._id || null); setFoodForm({ name: item.name, price: String(item.price || ""), category: item.category || "Main Course", nation: item.nation || "India" }); }} className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">EDIT</button>
                              <button onClick={() => handleDelete("food", item.id || item._id)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-2.5 py-1 rounded active:scale-95 transition-all">DEL</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <form onSubmit={handleFoodSubmit} className="lg:col-span-6 space-y-3 bg-white">
                    <h4 className="text-base font-bold text-gray-900">{editingFoodId ? "✏️ Edit Food Item" : "Add New Food Menu Item"}</h4>
                    <div className="space-y-2 text-xs font-bold text-gray-500">
                      <div><label className="block mb-1 font-normal text-gray-700">Food Item Name</label><input type="text" required value={foodForm.name} onChange={(e) => setFoodForm({...foodForm, name: e.target.value})} placeholder="Gourmet Chicken Biryani" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block mb-1 font-normal text-gray-700">Nation</label><select value={foodForm.nation} onChange={(e) => setFoodForm({...foodForm, nation: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal"><option value="India">India (₹)</option><option value="International">International ($)</option></select></div>
                        <div><label className="block mb-1 font-normal text-gray-700">Category</label><input type="text" value={foodForm.category} onChange={(e) => setFoodForm({...foodForm, category: e.target.value})} placeholder="Main Course / Snacks" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white font-normal" /></div>
                      </div>
                      <div><label className="block mb-1 font-normal text-gray-700">Price</label><input type="number" required value={foodForm.price} onChange={(e) => setFoodForm({...foodForm, price: e.target.value})} placeholder="0" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-900 outline-none bg-white" /></div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-black text-white font-bold px-4 py-2.5 rounded text-[11px] uppercase tracking-wider mt-1 active:scale-95 transition-all shadow">{editingFoodId ? "UPDATE FOOD ITEM" : "ADD FOOD ITEM"}</button>
                    {editingFoodId && <button type="button" onClick={() => { setEditingFoodId(null); setFoodForm({ name: "", price: "", category: "Main Course", nation: "India" }); }} className="text-xs font-bold text-gray-400 hover:underline ml-4">Cancel Edit</button>}
                  </form>
                </div>
              </div>
            )}

            {/* 9. USERS TAB */}
            {activeTab === "users" && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">User Management</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Search for users by email.</p>
                </div>
                <form onSubmit={handleUserSearch} className="flex gap-4 max-w-full">
                  <input type="email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} placeholder="Search user by email (e.g. rayaappa@gmail.com)" className="flex-1 border border-gray-200 rounded p-2.5 text-sm outline-none text-gray-900 font-medium bg-[#fafafa]" />
                  <button type="submit" className="bg-black text-white font-bold px-8 py-2.5 rounded text-[11px] uppercase tracking-wider shadow active:scale-95 transition-all">Search</button>
                </form>
                {searchError && <p className="text-xs font-semibold text-red-500 pl-1">{searchError}</p>}
                {foundUser && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-gray-100">
                    <div className="md:col-span-4 space-y-1.5 text-xs text-gray-700 font-medium bg-slate-50/60 p-4 rounded border border-gray-100">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">User details</h4>
                      <p><span className="text-gray-400 font-normal">Name:</span> {foundUser.firstName} {foundUser.lastName}</p>
                      <p><span className="text-gray-400 font-normal">Email:</span> {foundUser.email}</p>
                      <p><span className="text-gray-400 font-normal">Phone:</span> {foundUser.phoneNumber}</p>
                    </div>
                    <div className="md:col-span-8 space-y-3">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking History ({foundUser.bookings?.length || 0})</h4>
                      <div className="space-y-2">
                        {foundUser.bookings?.map((booking, idx) => (
                          <div key={idx} className="border border-gray-200 rounded p-4 flex items-center justify-between bg-white shadow-sm">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 border px-2 py-0.5 rounded text-gray-600">{booking.type}</span>
                              <p className="text-xs text-gray-400 font-mono mt-1.5">ID: {booking.bookingId}</p>
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