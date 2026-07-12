"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MockFlightStatus {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  status: "On Time" | "Delayed" | "Boarding" | "Landed";
  delayDuration?: string;
  reasonForDelay?: string;
  scheduledDeparture: string;
  revisedDeparture?: string;
  estimatedArrival: string;
}

export default function LiveFlightStatus() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [trackedFlights, setTrackedFlights] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // 1. Initial Mock Database containing operational mock flights matching your main page
  const [flights, setFlights] = useState<MockFlightStatus[]>([
    {
      id: "fl_101",
      flightNumber: "SkyHigh 202",
      airline: "SkyHigh Airways",
      origin: "Paris",
      destination: "Tokyo",
      status: "On Time",
      scheduledDeparture: "14:30",
      estimatedArrival: "23:45",
    },
    {
      id: "fl_103",
      flightNumber: "AirIndia 33",
      airline: "Air India",
      origin: "Bangalore",
      destination: "Delhi",
      status: "On Time",
      scheduledDeparture: "08:15",
      estimatedArrival: "11:00",
    },
    {
      id: "fl_104",
      flightNumber: "Indigo 619",
      airline: "Indigo",
      origin: "Mumbai",
      destination: "Bangalore",
      status: "Boarding",
      scheduledDeparture: "19:00",
      estimatedArrival: "20:45",
    },
  ]);

  // 2. SIMULATE LIVE RADAR UPDATES (Updates automatically every 8 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setFlights((prevFlights) =>
        prevFlights.map((flight) => {
          // Let's randomly change one flight to trigger a live update simulation
          if (Math.random() > 0.5) {
            const randomChance = Math.random();
            let newStatus: "On Time" | "Delayed" | "Boarding" | "Landed" = "On Time";
            let delayStr = "";
            let reasonStr = "";
            let revisedStr = "";

            if (randomChance < 0.4) {
              newStatus = "Delayed";
              delayStr = "1h 15m";
              reasonStr = "Air Traffic Clearance delays at Destination Runway Control hubs.";
              revisedStr = "Revised Departure estimated shortly.";
            } else if (randomChance < 0.7) {
              newStatus = "Boarding";
            } else {
              newStatus = "On Time";
            }

            // Only notify if the status actually changed to keep logs precise
            if (flight.status !== newStatus) {
              triggerNotification(
                `🚨 Live Update: ${flight.flightNumber} status updated to [${newStatus}]` + 
                (newStatus === "Delayed" ? ` due to operational conditions.` : ".")
              );
            }

            return {
              ...flight,
              status: newStatus,
              delayDuration: delayStr,
              reasonForDelay: reasonStr,
              revisedDeparture: revisedStr,
            };
          }
          return flight;
        })
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // 3. Persistent Local Storage Multi-Flight Pinning Tracker Loaders
  useEffect(() => {
    const savedPinned = localStorage.getItem("pinnedFlights");
    if (savedPinned) setTrackedFlights(JSON.parse(savedPinned));
  }, []);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  const toggleTrackFlight = (id: string) => {
    let updated: string[];
    if (trackedFlights.includes(id)) {
      updated = trackedFlights.filter((fid) => fid !== id);
      triggerNotification("📌 Removed flight track watch records successfully.");
    } else {
      updated = [...trackedFlights, id];
      triggerNotification("📌 Pinned flight to real-time status active dashboard!");
    }
    setTrackedFlights(updated);
    localStorage.setItem("pinnedFlights", JSON.stringify(updated));
  };

  const filteredFlights = flights.filter(
    (f) =>
      f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      f.destination.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-8">
      {/* SIMULATED PUSH NOTIFICATION POPUP COMPONENT BANNER */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 max-w-sm bg-slate-900 border-l-4 border-blue-500 text-white p-4 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 flex gap-3 items-start animate-bounce">
          <span className="text-lg">🔔</span>
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-widest text-blue-400">System Notification</p>
            <p className="text-xs font-medium mt-0.5 leading-relaxed">{notification}</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER SECTION LAYOUT */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="text-left">
            <button onClick={() => router.push("/")} className="text-xs font-bold text-blue-600 hover:underline mb-1 block">← Back to Home</button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">📡 Live Flight Radar Tracking System</h1>
            <p className="text-xs text-slate-400">Simulated professional real-time airport network monitors & operational routes statuses logs.</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Radar Active
          </span>
        </div>

        {/* CONTROLS & SEARCH INPUT CONTROLLER BLOCKS */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-left">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Search Dynamic Flight Tracking Logs</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type Flight Number or Destination City (e.g. SkyHigh, AirIndia, Tokyo, Delhi)"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
          />
        </div>

        {/* RESULTS STATUS MONITOR GRID CONTAINER */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider text-left">Active Airport Departure Radar Monitors</h2>
          {filteredFlights.length === 0 ? (
            <p className="text-xs font-medium text-slate-400 bg-white p-6 rounded-xl border text-center">No matching operational aircraft footprints mapped under search target.</p>
          ) : (
            filteredFlights.map((flight) => {
              const isPinned = trackedFlights.includes(flight.id);
              return (
                <div key={flight.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-slate-900">{flight.flightNumber}</span>
                      <span className="text-xs font-medium text-slate-400">({flight.airline})</span>
                      
                      {/* Dynamic Color Badge Conditioners */}
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide border ${
                        flight.status === "On Time" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        flight.status === "Boarding" ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" :
                        "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                        {flight.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-500 pt-1">
                      <div><span className="text-slate-400 font-normal block text-[10px] uppercase">Route From</span>{flight.origin}</div>
                      <div><span className="text-slate-400 font-normal block text-[10px] uppercase">Destination To</span>{flight.destination}</div>
                      <div><span className="text-slate-400 font-normal block text-[10px] uppercase">Scheduled Out</span>{flight.scheduledDeparture}</div>
                      <div><span className="text-slate-400 font-normal block text-[10px] uppercase">Est. Touchdown</span>{flight.estimatedArrival}</div>
                    </div>

                    {/* EXTENDED DETAILS INFORMATION BLOCK CONTEXT FOR REVISED TIMINGS */}
                    {flight.status === "Delayed" && (
                      <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-3 text-xs mt-3 space-y-1">
                        <p className="text-rose-800 font-bold">⚠️ Context Delay Warning Details:</p>
                        <p className="text-slate-600 font-medium leading-relaxed">{flight.reasonForDelay}</p>
                        <p className="text-slate-400 font-normal text-[11px] italic mt-0.5">{flight.revisedDeparture}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                    <button
                      type="button"
                      onClick={() => toggleTrackFlight(flight.id)}
                      className={`text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg border transition-all ${
                        isPinned
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {isPinned ? "📌 Tracking Active" : "📡 Pin to Watch"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}