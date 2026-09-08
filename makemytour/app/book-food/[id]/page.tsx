"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookFoodPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("Raya Appa");
  const [deliveryLocation, setDeliveryLocation] = useState("Terminal 3, Gate 12 / Seat 24");
  const [activeCategory, setActiveCategory] = useState("All");

  // Comprehensive menu with your exact preferred food image links mapped correctly
  const defaultVegetarianMenu = [
    // North Indian (5 items)
    { id: 1, name: "North Indian Deluxe Thali", price: 280, category: "North Indian", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Butter Roti with Paneer Butter Masala", price: 220, category: "North Indian", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Chole Bhature Special", price: 170, category: "North Indian", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Dal Makhani with Garlic Naan", price: 240, category: "North Indian", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Aloo Paratha with Curd & Pickle", price: 150, category: "North Indian", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80" },

    // South Indian (5 items)
    { id: 6, name: "South Indian Traditional Meals", price: 250, category: "South Indian", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80" },
    { id: 7, name: "Masala Dosa with Chutney & Sambar", price: 140, category: "South Indian", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80" },
    
    { id: 10, name: "Rava Upma with Coconut Chutney", price: 120, category: "South Indian", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80" },

    // Chinese (5 items)
    { id: 11, name: "Crispy Veg Fried Rice", price: 180, category: "Chinese", img: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=500&q=80" },
    { id: 12, name: "Spicy Veg Hakka Noodles", price: 190, category: "Chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80" },
    
    { id: 14, name: "Chilli Paneer Gravy with Fried Rice", price: 260, category: "Chinese", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80" },
    { id: 15, name: "Honey Chilli Crispy Potatoes", price: 190, category: "Chinese", img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=500&q=80" },

    // Pizza (5 items)
    { id: 16, name: "Classic Cheese Margherita Pizza", price: 290, category: "Pizza", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" },
    { id: 17, name: "Spicy Paneer Tikka Pizza", price: 340, category: "Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80" },
    { id: 18, name: "Veggie Supreme Loaded Pizza", price: 360, category: "Pizza", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80" },
    { id: 19, name: "Sweet Corn & Mushroom Pizza", price: 320, category: "Pizza", img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=500&q=80" },
    { id: 20, name: "Double Cheese Farmhouse Pizza", price: 350, category: "Pizza", img: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=80" },

    // Ice Creams (5 items)
    { id: 21, name: "Fresh Fruit Salad with Vanilla Ice Cream", price: 160, category: "Ice Creams", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=500&q=80" },
    { id: 22, name: "Rich Chocolate Brownie Sundae", price: 190, category: "Ice Creams", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80" },
    { id: 23, name: "Classic Mango Kulfi Stick", price: 110, category: "Ice Creams", img: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=500&q=80" },
    { id: 24, name: "Butterscotch Bliss Scoop", price: 130, category: "Ice Creams", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80" },
    { id: 25, name: "Strawberry Ripple Ice Cream", price: 120, category: "Ice Creams", img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=500&q=80" },

    // Juices (5 items)
    { id: 26, name: "Fresh Mixed Fruit Juice", price: 120, category: "Juices", img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80" },
    { id: 27, name: "Refreshing Mint Lemonade Juice", price: 100, category: "Juices", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80" },
    { id: 28, name: "Sweet Alphonso Mango Shake", price: 150, category: "Juices", img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=500&q=80" },
    { id: 29, name: "Fresh Pomegranate Juice", price: 160, category: "Juices", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80" },
    { id: 30, name: "Pineapple Ginger Cooler", price: 130, category: "Juices", img: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=500&q=80" }
  ];

  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    const customAdminMenu = JSON.parse(localStorage.getItem("adminFoodMenu") || "[]");
    const formattedCustom = customAdminMenu.map((item: any, idx: number) => ({
      id: 900 + idx,
      name: item.name,
      price: item.price,
      category: item.category || "Main Course",
      img: item.img || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80"
    }));

    const combined = [...formattedCustom, ...defaultVegetarianMenu].map(item => ({ ...item, qty: 0 }));
    setMenuItems(combined);
  }, []);

  const handleQtyChange = (id: number, delta: number) => {
    setMenuItems(menuItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const categories = ["All", "North Indian", "South Indian", "Chinese", "Pizza", "Ice Creams", "Juices"];
  
  const filteredMenu = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(i => i.category.toLowerCase() === activeCategory.toLowerCase());

  const selectedItems = menuItems.filter(item => item.qty > 0);
  const foodSubtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = selectedItems.length > 0 ? 50 : 0;
  const totalAmount = foodSubtotal + deliveryFee;

  const handleConfirmFoodOrder = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one vegetarian food item to order.");
      return;
    }

    const orderSummaryText = selectedItems.map(i => `${i.qty}x ${i.name}`).join(", ");

    const newBooking = {
      type: "Food",
      bookingId: "fd_" + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(),
      quantity: selectedItems.reduce((acc, i) => acc + i.qty, 0),
      totalPrice: totalAmount,
      cancelled: false,
      passengerName: customerName,
      itemsOrdered: orderSummaryText,
      deliveryLocation: deliveryLocation,
      travelDate: new Date().toISOString().split('T')[0],
      currency: "INR"
    };

    const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    localStorage.setItem("userBookings", JSON.stringify([newBooking, ...existingBookings]));

    alert("Vegetarian Food Order Placed Successfully!");
    setShowModal(false);
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col font-sans text-stone-800 text-left">
      
      {/* HEADER */}
      <header className="bg-[#C2410C] text-white px-10 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-xl">🍔</span>
          <h1 className="text-lg font-bold tracking-tight">MakeMyTour <span className="text-orange-200 text-xs uppercase px-2 py-0.5 bg-orange-950 rounded-md font-normal ml-2">Pure Veg Express Dining</span></h1>
        </div>
        <button onClick={() => router.push("/profile")} className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow">
          My Profile & Bookings
        </button>
      </header>

      {/* TITLE BAR */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-8 pb-4 space-y-2">
        <span className="bg-orange-100 text-orange-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
          🌱 100% Pure Vegetarian • Hot & Fresh Delivery
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
          Raghavendra Vegetarian Kitchen, Ice Creams & Fresh Juices
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          🚀 Estimated Delivery: 25-30 Minutes • Hygienic Packaging • Live Order Tracking
        </p>
      </div>

      {/* CATEGORY TABS */}
      <div className="max-w-6xl w-full mx-auto px-6 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${activeCategory === cat ? 'bg-[#C2410C] text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl w-full mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: FOOD MENU SELECTION WITH UNIQUE IMAGES */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-xs space-y-6">
            <h3 className="font-black text-sm text-stone-900 uppercase tracking-wide">🍽️ Vegetarian Menu Selection ({filteredMenu.length} items)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMenu.map((food) => (
                <div key={food.id} className="flex flex-col justify-between p-4 bg-stone-50 border rounded-2xl gap-3 shadow-xs hover:shadow-md transition-all">
                  <div className="h-32 rounded-xl overflow-hidden relative bg-stone-200">
                    <img 
                      src={food.img} 
                      alt={food.name} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-lg">
                      {food.category}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xs text-stone-900 leading-snug">{food.name}</h4>
                    <p className="text-xs font-bold text-orange-700">₹ {food.price}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                    <span className="text-[10px] font-bold text-stone-400 uppercase">Quantity</span>
                    <div className="flex items-center gap-3 bg-white border px-3 py-1.5 rounded-xl shadow-xs">
                      <button type="button" onClick={() => handleQtyChange(food.id, -1)} className="font-black text-stone-600 hover:text-orange-700 px-1">-</button>
                      <span className="font-black text-xs w-4 text-center">{food.qty}</span>
                      <button type="button" onClick={() => handleQtyChange(food.id, 1)} className="font-black text-stone-600 hover:text-orange-700 px-1">+</button>
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
            <h3 className="font-black text-sm text-stone-900 uppercase tracking-wide border-b pb-3">🛍️ Order Summary</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-500 uppercase text-[10px] mb-1 font-bold">Customer Name</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  className="w-full border p-3 rounded-xl font-bold text-stone-900 bg-stone-50 outline-none focus:border-orange-600" 
                />
              </div>

              <div>
                <label className="block text-stone-500 uppercase text-[10px] mb-1 font-bold">Delivery Location / Seat</label>
                <input 
                  type="text" 
                  value={deliveryLocation} 
                  onChange={(e) => setDeliveryLocation(e.target.value)} 
                  className="w-full border p-3 rounded-xl font-bold text-stone-900 bg-stone-50 outline-none focus:border-orange-600" 
                />
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-600 border-t pt-4">
              {selectedItems.length === 0 ? (
                <p className="text-stone-400 italic">No food items selected yet.</p>
              ) : (
                selectedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.qty}x {item.name}</span>
                    <span>₹ {item.price * item.qty}</span>
                  </div>
                ))
              )}
              <div className="flex justify-between pt-2 border-t">
                <span>Express Delivery Fee</span>
                <span>₹ {deliveryFee}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-black text-stone-950 text-sm">
                <span>Total Amount</span>
                <span className="text-orange-700">₹ {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowModal(true)}
              disabled={selectedItems.length === 0}
              className={`w-full py-4 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md transition-all ${selectedItems.length === 0 ? 'bg-stone-300 text-stone-500 cursor-not-allowed' : 'bg-[#C2410C] hover:bg-black text-white active:scale-95'}`}
            >
              Proceed to Place Food Order
            </button>
          </div>
        </div>
      </main>

      {/* CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative space-y-4 text-stone-800">
            <h3 className="text-base font-black text-stone-950">🍔 Confirm Vegetarian Food Order</h3>
            <p className="text-stone-500">Delivering to **{deliveryLocation}** for **{customerName}**.</p>
            
            <div className="bg-stone-50 p-4 rounded-2xl border space-y-1 font-bold">
              <div className="flex justify-between"><span>Total Payable:</span><span className="text-orange-700 text-sm">₹ {totalAmount.toLocaleString()}</span></div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-stone-100 text-stone-700 font-bold py-3 rounded-xl">Go Back</button>
              <button type="button" onClick={handleConfirmFoodOrder} className="flex-1 bg-[#C2410C] text-white font-bold py-3 rounded-xl shadow">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}