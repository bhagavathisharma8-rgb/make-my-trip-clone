"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, LogOut, Edit3, Plane, Building, XCircle, Download, Share2, Wallet, Lock, Satellite } from "lucide-react";

interface BookingItem {
  type: string; // "Flight", "Hotel", "Homestay", "Holiday", "Trains", "Buses", "Tourism", "Food"
  bookingId: string;
  date: string;
  quantity: number;
  totalPrice: number;
  cancelled?: boolean;
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  refundStatus?: string; 
  refundDate?: string;
  passengerName?: string;
  passengerAge?: number;
  seatPreference?: string;
  travelDate?: string;
  seatNumber?: string;
  currency?: "INR" | "USD"; 
  itemsOrdered?: string;
  deliveryLocation?: string;
}

interface UserProfileData {
  id?: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bookings: BookingItem[];
}

interface WalletHistory {
  type: "DEPOSIT" | "REFUND" | "PAYMENT";
  amount: number;
  date: string;
  description: string;
}

export default function ProfileDashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [trackedFlights, setTrackedFlights] = useState<string[]>([]);
  const [activeAccountTab, setActiveAccountTab] = useState<"profile" | "ewallet" | "password">("profile");
  
  // Dashboard view states ("overview" | "bookings" | "cancellations" | "refunds")
  const [profileMainView, setProfileMainView] = useState<"overview" | "bookings" | "cancellations" | "refunds">("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [showNavbarDropdown, setShowNavbarDropdown] = useState(false);

  // E-Wallet States
  const [walletBalance, setWalletBalance] = useState<number>(4500);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [walletLogs, setWalletLogs] = useState<WalletHistory[]>([
    { type: "DEPOSIT", amount: 4500, date: "12 Jul 2026, 01:05 AM", description: "Opening Account Registration Bonus Credit" }
  ]);

  // Security Account Password Reset States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Modal Cancellation Interactive States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<BookingItem | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const categoriesList = ["Flight", "Hotel", "Homestay", "Holiday", "Trains", "Buses", "Tourism", "Food"];

  const getDisplayPrice = (amount: number, currency: string = "INR") => {
    return currency === "USD" ? `$${amount.toLocaleString()}` : `₹${amount.toLocaleString()}`;
  };

  const fetchProfileData = () => {
    const savedEmail = localStorage.getItem("email") || "rayaappa@gmail.com";
    
    const savedPinned = localStorage.getItem("pinnedFlights");
    if (savedPinned) setTrackedFlights(JSON.parse(savedPinned));

    const userBookingsFromStorage = JSON.parse(localStorage.getItem("userBookings") || "[]");

    const defaultBookings = [
      { 
        type: "Flight", 
        bookingId: "6a5124dd53d21de6d237680b", 
        date: "11 Jul 2026", 
        quantity: 1, 
        totalPrice: 4873,
        cancelled: true,
        cancellationReason: "Health / Emergency",
        refundAmount: 3411.1,
        refundStatus: "COMPLETED",
        refundDate: "12 Jul 2026",
        passengerName: "Raya Appa",
        passengerAge: 26,
        seatPreference: "Window",
        travelDate: "2026-07-15",
        seatNumber: "--",
        currency: "INR"
      },
      {
        type: "Hotel",
        bookingId: "ht_9823415",
        date: "11 Jul 2026",
        quantity: 2,
        totalPrice: 6000,
        cancelled: true,
        cancellationReason: "Change of plans",
        refundAmount: 4200,
        refundStatus: "COMPLETED",
        refundDate: "13 Jul 2026",
        passengerName: "Raya Appa",
        travelDate: "2026-07-15",
        currency: "INR"
      },
      {
        type: "Trains",
        bookingId: "tr_442109",
        date: "10 Jul 2026",
        quantity: 1,
        totalPrice: 1250,
        cancelled: false,
        passengerName: "Raya Appa",
        travelDate: "2026-07-18",
        currency: "INR"
      }
    ];

    setUserData({
      _id: "mock_user_123",
      firstName: "Raya",
      lastName: "Appa",
      email: savedEmail,
      phoneNumber: "1234567888",
      bookings: [...userBookingsFromStorage, ...defaultBookings]
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, [router]);

  const handleOpenCancelModal = (booking: BookingItem) => {
    setActiveBooking(booking);
    setCancellationReason("");
    setActionError("");
    setIsModalOpen(true);
  };

  const handleConfirmCancellation = async () => {
    if (!cancellationReason) {
      setActionError("Please select a valid reason from the dropdown menu.");
      return;
    }
    if (!userData || !activeBooking) return;

    setActionLoading(true);
    setActionError("");

    try {
      const processedRefund = activeBooking.totalPrice * 0.70;
      const currentDateStr = new Date().toLocaleDateString();
      setWalletBalance(prev => prev + processedRefund);
      setWalletLogs(prev => [
        ...prev,
        { type: "REFUND", amount: processedRefund, date: new Date().toLocaleString(), description: `70% Policy Payout for voided trip/order ID #${activeBooking.bookingId}` }
      ]);

      setUserBookingsStorage(activeBooking.bookingId, cancellationReason, processedRefund, currentDateStr);

      setUserData(prev => prev ? {
        ...prev,
        bookings: prev.bookings.map(b => b.bookingId === activeBooking.bookingId ? { ...b, cancelled: true, cancellationReason, refundAmount: processedRefund, refundStatus: "COMPLETED", refundDate: currentDateStr } : b)
      } : prev);

      alert("Reservation/Order cancelled successfully! Dynamic 70% refund policy applied.");
      setIsModalOpen(false);
    } catch (err: any) {
      setActionError("Failed to process cancellation request.");
    } finally {
      setActionLoading(false);
    }
  };

  const setUserBookingsStorage = (bookingId: string, reason: string, refund: number, dateStr: string) => {
    const existing = JSON.parse(localStorage.getItem("userBookings") || "[]");
    const updated = existing.map((b: any) => b.bookingId === bookingId ? { ...b, cancelled: true, cancellationReason: reason, refundAmount: refund, refundStatus: "COMPLETED", refundDate: dateStr } : b);
    localStorage.setItem("userBookings", JSON.stringify(updated));
  };

  const handleEwalletDeposit = () => {
    const value = Number(depositAmount);
    if (!value || value <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }
    setWalletBalance(prev => prev + value);
    setWalletLogs(prev => [
      ...prev,
      { type: "DEPOSIT", amount: value, date: new Date().toLocaleString(), description: "Funds added via secure gateway deposit" }
    ]);
    setDepositAmount("");
    alert(`Success! ₹${value.toLocaleString()} loaded securely into your MakeMyTour Ewallet.`);
  };

  const handleSecurityPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 5) {
      alert("Password strings must be at least 5 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Validation Error: Passwords do not match.");
      return;
    }
    alert("Security access credentials modified permanently!");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogoutAction = () => {
    localStorage.clear();
    router.push("/");
  };

  // Filter lists based on profileMainView and selectedCategory
  const getFilteredBookings = () => {
    if (!userData) return [];
    return userData.bookings.filter(b => {
      // Category filter match (handling plural/singular mapping like Food, Flight, Hotel, etc.)
      const bType = b.type?.toLowerCase();
      const sCat = selectedCategory?.toLowerCase();
      const matchesCategory = selectedCategory ? (bType === sCat || bType === sCat + "s" || bType + "s" === sCat) : true;
      if (!matchesCategory) return false;

      // View type filter match
      if (profileMainView === "cancellations") return b.cancelled === true;
      if (profileMainView === "refunds") return b.cancelled === true && b.refundAmount && b.refundAmount > 0;
      return true; // "bookings"
    });
  };

  const currentFilteredList = getFilteredBookings();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-800 relative">
      
      {/* GLOBAL TOP NAVBAR BAR */}
      <header className="bg-white border-b border-gray-200 px-12 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-xl">✈️</span>
          <h1 className="text-xl font-bold text-gray-950 tracking-tight">MakeMy<span className="text-blue-500">Tour</span></h1>
        </div>
        
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => router.push("/")}
            className="text-xs border border-gray-200 font-bold px-3 py-1.5 rounded hover:bg-slate-50 transition-colors uppercase tracking-wider"
          >
            New Search
          </button>
          
          <button 
            onClick={() => setShowNavbarDropdown(!showNavbarDropdown)}
            className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm cursor-pointer border border-slate-700 active:scale-95 transition-transform"
          >
            {userData?.firstName ? userData.firstName.charAt(0).toUpperCase() : "R"}
          </button>

          {showNavbarDropdown && (
            <div className="absolute right-0 top-10 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-3 z-50 text-left">
              <div className="px-4 pb-2 border-b border-gray-100">
                <p className="text-[11px] font-black text-gray-900 uppercase tracking-wide">My Account</p>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{userData?.email || "rayaappa@gmail.com"}</p>
              </div>
              <div className="pt-1.5 px-2 flex flex-col space-y-0.5">
                <button 
                  onClick={() => { setActiveAccountTab("profile"); setProfileMainView("overview"); setShowNavbarDropdown(false); }}
                  className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded-md font-bold text-slate-700 hover:text-black transition-colors text-xs"
                >
                  👤 My Profile Details
                </button>
                <button 
                  onClick={() => { setActiveAccountTab("profile"); setProfileMainView("bookings"); setSelectedCategory(null); setShowNavbarDropdown(false); }}
                  className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded-md font-bold text-slate-700 hover:text-black transition-colors text-xs"
                >
                  📋 My Bookings List
                </button>
                <button 
                  onClick={() => { handleLogoutAction(); setShowNavbarDropdown(false); }}
                  className="w-full text-left px-2 py-1.5 text-red-500 hover:bg-red-50 rounded-md font-bold transition-all text-xs"
                >
                  ➔ Log out Account
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* THREE HEADER METRIC BOX CARDS (Booking Lists, Cancellation List, Refund Status) */}
      <div className="max-w-6xl w-full mx-auto px-8 pt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* BOX 1: MY BOOKING LISTS */}
        <div 
          onClick={() => { setActiveAccountTab("profile"); setProfileMainView("bookings"); setSelectedCategory(null); }}
          className={`p-5 rounded-xl border cursor-pointer transition-all shadow-sm flex items-center gap-4 ${profileMainView === 'bookings' && activeAccountTab === 'profile' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 border-gray-200'}`}
        >
          <div className="text-xl">📋</div>
          <div>
            <h4 className="font-black text-sm">My Booking Lists</h4>
            <p className={`text-[10px] ${profileMainView === 'bookings' && activeAccountTab === 'profile' ? 'text-blue-100' : 'text-slate-400'}`}>Select categories like flights, hotels, trains & food</p>
          </div>
        </div>

        {/* BOX 2: CANCELLATION LIST */}
        <div 
          onClick={() => { setActiveAccountTab("profile"); setProfileMainView("cancellations"); setSelectedCategory(null); }}
          className={`p-5 rounded-xl border cursor-pointer transition-all shadow-sm flex items-center gap-4 ${profileMainView === 'cancellations' && activeAccountTab === 'profile' ? 'bg-red-600 text-white border-red-600' : 'bg-white hover:bg-slate-50 border-gray-200'}`}
        >
          <div className="text-xl">❌</div>
          <div>
            <h4 className="font-black text-sm">Cancellation List</h4>
            <p className={`text-[10px] ${profileMainView === 'cancellations' && activeAccountTab === 'profile' ? 'text-red-100' : 'text-slate-400'}`}>Review cancelled trips and food orders</p>
          </div>
        </div>

        {/* BOX 3: REFUND STATUS */}
        <div 
          onClick={() => { setActiveAccountTab("profile"); setProfileMainView("refunds"); setSelectedCategory(null); }}
          className={`p-5 rounded-xl border cursor-pointer transition-all shadow-sm flex items-center gap-4 ${profileMainView === 'refunds' && activeAccountTab === 'profile' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-slate-50 border-gray-200'}`}
        >
          <div className="text-xl">💰</div>
          <div>
            <h4 className="font-black text-sm">Refund Status</h4>
            <p className={`text-[10px] ${profileMainView === 'refunds' && activeAccountTab === 'profile' ? 'text-emerald-100' : 'text-slate-400'}`}>Check refund amounts and payout dates</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="md:col-span-4 space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4 text-left">
                <div className="border-b pb-2">
                    <h3 className="text-base font-black text-gray-900">My Account</h3>
                </div>

                <div className="space-y-1 flex flex-col">
                    <button 
                      onClick={() => { setActiveAccountTab("profile"); setProfileMainView("overview"); }}
                      className={`w-full text-left font-bold px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs ${activeAccountTab === "profile" && profileMainView === "overview" ? "bg-slate-900 text-white shadow-sm" : "hover:bg-slate-50 text-slate-600"}`}
                    >
                      <User className="w-4 h-4" /> My Profile Details
                    </button>
                    <button 
                      onClick={() => { setActiveAccountTab("ewallet"); setProfileMainView("overview"); }}
                      className={`w-full text-left font-bold px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs ${activeAccountTab === "ewallet" ? "bg-slate-900 text-white shadow-sm" : "hover:bg-slate-50 text-slate-600"}`}
                    >
                      <Wallet className="w-4 h-4" /> MakeMyTour Ewallet
                    </button>
                    <button 
                      onClick={() => { setActiveAccountTab("password"); setProfileMainView("overview"); }}
                      className={`w-full text-left font-bold px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs ${activeAccountTab === "password" ? "bg-slate-900 text-white shadow-sm" : "hover:bg-slate-50 text-slate-600"}`}
                    >
                      <Lock className="w-4 h-4" /> Change Password
                    </button>
                </div>
            </div>

            {/* TRACKED FLIGHTS WIDGET */}
            <Link 
                href="/flight-status" 
                className="block bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-left hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            >
                <div className="flex items-center gap-2 border-b pb-2">
                    <Satellite className="w-4 h-4 text-blue-600" />
                    <h3 className="font-black text-sm text-gray-900">Tracked Flights</h3>
                </div>
                <div className="mt-3">
                    {trackedFlights.length > 0 ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                {trackedFlights.length} Active
                            </span>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                                Click to view radar
                            </p>
                        </div>
                    ) : (
                        <p className="text-[10px] text-slate-400 font-medium italic">No active flights tracked.</p>
                    )}
                </div>
            </Link>
        </div>

        {/* MAIN DISPLAY PANEL */}
        <div className="md:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6 text-left">
          
          {/* PROFILE OVERVIEW VIEW */}
          {activeAccountTab === "profile" && profileMainView === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-100">
              <div className="border-b pb-2">
                <h3 className="text-base font-black text-gray-950 uppercase tracking-wide">My Personal Profile Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-semibold text-gray-600">
                <div className="p-3 bg-slate-50 rounded-xl"><span className="text-[10px] text-slate-400 block mb-0.5">FULL NAME</span><span className="text-gray-900 font-black text-xs capitalize">{userData?.firstName} {userData?.lastName}</span></div>
                <div className="p-3 bg-slate-50 rounded-xl"><span className="text-[10px] text-slate-400 block mb-0.5">EMAIL ID</span><span className="text-gray-900 font-black text-xs truncate block">{userData?.email}</span></div>
                <div className="p-3 bg-slate-50 rounded-xl"><span className="text-[10px] text-slate-400 block mb-0.5">MOBILE NUMBER</span><span className="text-gray-900 font-black text-xs">{userData?.phoneNumber || "1234567888"}</span></div>
              </div>
            </div>
          )}

          {/* DYNAMIC VIEW FOR BOOKINGS / CANCELLATIONS / REFUNDS */}
          {activeAccountTab === "profile" && profileMainView !== "overview" && (
            <div className="space-y-5 animate-in fade-in duration-100">
              
              {/* STEP 1: CATEGORY SELECTION MENU */}
              {selectedCategory === null ? (
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="text-base font-black text-gray-950 uppercase tracking-wide">
                      {profileMainView === "bookings" && "Select Booking Category List"}
                      {profileMainView === "cancellations" && "Select Cancellation Category"}
                      {profileMainView === "refunds" && "Select Refund Status Category"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Click a category below to filter records.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {categoriesList.map((cat) => {
                      const count = userData?.bookings.filter(b => {
                        const bType = b.type?.toLowerCase();
                        const sCat = cat.toLowerCase();
                        const matchCat = (bType === sCat || bType === sCat + "s" || bType + "s" === sCat);
                        if (!matchCat) return false;
                        if (profileMainView === "cancellations") return b.cancelled === true;
                        if (profileMainView === "refunds") return b.cancelled === true && b.refundAmount && b.refundAmount > 0;
                        return true;
                      }).length || 0;

                      return (
                        <div 
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className="p-4 rounded-xl border border-gray-200 bg-slate-50 hover:bg-black hover:text-white transition-all cursor-pointer flex justify-between items-center group shadow-sm"
                        >
                          <div>
                            <h4 className="font-black text-xs uppercase tracking-wider">{cat} List</h4>
                            <p className="text-[10px] text-slate-400 group-hover:text-slate-300 mt-0.5">View {cat.toLowerCase()} records</p>
                          </div>
                          <span className="bg-white text-black font-black text-xs px-2.5 py-1 rounded-full shadow-inner">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* STEP 2: DISPLAY FILTERED LIST FOR CHOSEN CATEGORY */
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                        📁 {selectedCategory} ({profileMainView.toUpperCase()})
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Showing exact matches for this category</p>
                    </div>
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-all"
                    >
                      ← Back to Categories
                    </button>
                  </div>

                  {currentFilteredList.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-xl space-y-2">
                      <p className="text-slate-400 font-bold text-xs">No records found for {selectedCategory} under {profileMainView}.</p>
                    </div>
                  ) : (
                    currentFilteredList.map((booking, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-5 bg-slate-50/40 space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 bg-blue-50 border rounded-lg flex items-center justify-center text-blue-600">
                              {booking.type === "Food" ? "🍔" : <Plane className="w-4 h-4" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-gray-900">{booking.type} {booking.type === "Food" ? "Order Summary" : "Ticket Summary"}</h4>
                              <p className="font-mono text-gray-400 text-[10px]">ID: {booking.bookingId}</p>
                            </div>
                          </div>
                          <span className={`font-bold px-2 py-0.5 rounded text-[9px] uppercase ${booking.cancelled ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {booking.cancelled ? 'Cancelled' : 'Paid & Active'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 bg-white border p-4 rounded-xl text-gray-500 font-semibold shadow-inner text-xs">
                          {booking.type === "Food" ? (
                            <>
                              <p>Customer: <span className="text-gray-900 block font-black">{booking.passengerName || "Raya Appa"}</span></p>
                              <p>Delivery Location: <span className="text-orange-600 block font-black">📍 {booking.deliveryLocation || "Terminal 3"}</span></p>
                              <p>Items Ordered: <span className="text-gray-900 block font-black truncate">{booking.itemsOrdered || "Gourmet Meal"}</span></p>
                            </>
                          ) : (
                            <>
                              <p>Passenger: <span className="text-gray-900 block font-black">{booking.passengerName || "Raya Appa"}</span></p>
                              <p>Travel Date: <span className="text-blue-600 block font-black">📅 {booking.travelDate || "2026-07-15"}</span></p>
                            </>
                          )}
                          <p>Gross Price: <span className="text-gray-900 block font-black">{getDisplayPrice(booking.totalPrice, booking.currency || "INR")}</span></p>
                        </div>

                        {/* REFUND STATUS SPECIFIC CARD DETAILS */}
                        {profileMainView === "refunds" && booking.refundAmount && (
                          <div className="p-4 border border-emerald-200 bg-emerald-50/40 rounded-xl text-left space-y-1.5 font-medium text-slate-700 text-xs">
                            <p className="text-emerald-800 font-black uppercase text-[10px] tracking-wide">💰 Official Refund Status Details</p>
                            <p>Refund Status: <span className="text-emerald-700 font-bold uppercase">{booking.refundStatus || "COMPLETED"}</span></p>
                            <p>Amount Refunded: <span className="text-emerald-700 font-black">{getDisplayPrice(booking.refundAmount, booking.currency || "INR")} (70% policy applied)</span></p>
                            <p>Date of Refund: <span className="text-gray-900 font-bold">📅 {booking.refundDate || "12 Jul 2026"}</span></p>
                          </div>
                        )}

                        {/* CANCELLATION REASON DETAILS */}
                        {profileMainView === "cancellations" && booking.cancelled && (
                          <div className="p-4 border border-red-200 bg-red-50/30 rounded-xl text-left space-y-1.5 font-medium text-slate-600 text-xs">
                            <p className="text-red-700 font-black uppercase text-[10px] tracking-wide">❌ Cancellation & Refund Details</p>
                            <p>Reason: <span className="text-gray-900 font-bold">"{booking.cancellationReason || "User requested cancellation"}"</span></p>
                            <p>Refund Payout: <span className="text-emerald-700 font-black">{getDisplayPrice(booking.refundAmount || booking.totalPrice * 0.70, booking.currency || "INR")}</span></p>
                          </div>
                        )}

                        {!booking.cancelled && profileMainView === "bookings" && (
                          <div className="flex justify-end">
                            <button onClick={() => handleOpenCancelModal(booking)} className="text-[10px] font-bold text-red-500 bg-white border border-red-200 hover:bg-red-50 px-3 py-1 rounded-lg transition-all flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Process Cancellation
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* E-WALLET TAB */}
          {activeAccountTab === "ewallet" && (
            <div className="space-y-6">
              <div className="border-b pb-2 flex justify-between items-center">
                <h3 className="text-base font-black text-gray-950 uppercase tracking-wide">💳 MakeMyTour E-Wallet Dashboard</h3>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">Net Balance: {getDisplayPrice(walletBalance, "INR")}</span>
              </div>
              
              <div className="bg-slate-50 border p-5 rounded-xl space-y-3 shadow-inner">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Deposit Funding Module</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Enter amount to load (₹)" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="flex-1 border p-2.5 bg-white text-black text-xs font-bold rounded-lg outline-none" />
                  <button onClick={handleEwalletDeposit} className="bg-slate-900 hover:bg-black text-white px-5 rounded-lg font-bold text-[11px] uppercase tracking-wide transition-all">Deposit Money</button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Account Statements History</h4>
                <div className="border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 font-bold border-b text-slate-700">
                      <tr>
                        <th className="p-3">Timestamp Date</th>
                        <th className="p-3">Classification</th>
                        <th className="p-3">Reference Log Description</th>
                        <th className="p-3 text-right">Transaction Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-600 font-semibold bg-white">
                      {walletLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 text-slate-400 font-medium">{log.date}</td>
                          <td className="p-3"><span className={`px-2 py-0.5 rounded text-[9px] font-black ${log.type === 'DEPOSIT' || log.type === 'REFUND' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{log.type}</span></td>
                          <td className="p-3 text-gray-900 font-medium">{log.description}</td>
                          <td className={`p-3 text-right font-black ${log.type === 'DEPOSIT' || log.type === 'REFUND' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {log.type === 'DEPOSIT' || log.type === 'REFUND' ? '+' : '-'} {getDisplayPrice(log.amount, "INR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CHANGE PASSWORD TAB */}
          {activeAccountTab === "password" && (
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h3 className="text-base font-black text-gray-950 uppercase tracking-wide">🔒 Account Credentials Modification</h3>
              </div>
              <form onSubmit={handleSecurityPasswordChange} className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Enter New Profile Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 5 characters" className="w-full border p-2.5 bg-slate-50 text-xs font-bold rounded-lg outline-none text-black focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Confirm Target Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="w-full border p-2.5 bg-slate-50 text-xs font-bold rounded-lg outline-none text-black focus:bg-white" />
                </div>
                <button type="submit" className="bg-slate-900 hover:bg-black text-white font-bold px-4 py-2.5 rounded-lg uppercase text-[11px] tracking-wider transition-all">Save Secure Credentials</button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* POPUP CANCELLATION OVERLAY INTERFACE */}
      {isModalOpen && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 p-6 border border-zinc-800 shadow-2xl text-white text-left animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-black mb-1">Cancel Reservation / Order</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Review transaction penalties for reference <span className="text-blue-400 font-mono font-bold">#{activeBooking.bookingId}</span>. Cancellations automatically compute and settle a **70% payout statement refund** directly into your wallet portfolio logs.
            </p>

            <div className="mb-5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Reason for cancellation
              </label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition shadow-inner"
              >
                <option value="">-- Choose Predefined Option --</option>
                <option value="Change of plans">Change of plans</option>
                <option value="Health / Emergency">Health / Emergency</option>
                <option value="Found a better deal">Found a better deal</option>
                <option value="Schedule adjustment">Schedule adjustment</option>
              </select>
            </div>

            {actionError && <p className="text-xs text-red-400 font-semibold mb-4 bg-red-950/40 p-2.5 rounded-lg border border-red-900/50">{actionError}</p>}

            <div className="flex justify-end gap-2.5 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900 rounded-xl transition"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancellation}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl transition text-white shadow-md shadow-red-900/20"
              >
                {actionLoading ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}