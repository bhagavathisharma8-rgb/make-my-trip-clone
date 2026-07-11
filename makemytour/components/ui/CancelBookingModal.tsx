"use client";

import React, { useState } from "react";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  userId: string;
  totalPrice: number;
  bookingDate: string; // The timestamp when it was reserved
  onCancellationSuccess: () => void;
}

export default function CancelBookingModal({
  isOpen,
  onClose,
  bookingId,
  userId,
  totalPrice,
  bookingDate,
  onCancellationSuccess,
}: CancelModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Calculate tentative real-time penalty alert structure on frontend for transparency
  const hoursElapsed = Math.abs(
    (new Date().getTime() - new Date(bookingDate).getTime()) / 3600000
  );
  const estimatedRefund = hoursElapsed <= 24 ? totalPrice * 0.5 : totalPrice;

  const handleCancelSubmit = async () => {
    if (!reason) {
      setError("Please select a reason for cancellation.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://make-my-trip-clone-qaq2.onrender.com/booking/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          bookingId: bookingId,
          reason: reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process cancellation request.");
      }

      alert("Booking successfully cancelled. Refund initiated!");
      onCancellationSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 border border-zinc-800 shadow-2xl text-white">
        <h3 className="text-xl font-bold mb-2">Cancel Reservation</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Are you sure you want to cancel booking <span className="text-blue-400 font-mono font-bold">#{bookingId}</span>?
        </p>

        {/* Dynamic Refund Notice Calculation Box */}
        <div className="mb-4 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-zinc-400">Original Amount:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-emerald-400">
            <span>Estimated Refund:</span>
            <span>${estimatedRefund.toFixed(2)}</span>
          </div>
          {hoursElapsed <= 24 && (
            <p className="text-xs text-amber-400 mt-2">
              ⚠️ Policy Note: Canceled within 24 hours of booking. A 50% reservation fee applies.
            </p>
          )}
        </div>

        {/* Trend Tracking Dropdown Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Reason for cancellation
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">-- Choose an option --</option>
            <option value="Change of plans">Change of plans</option>
            <option value="Health / Emergency">Health / Emergency</option>
            <option value="Found a better deal">Found a better deal</option>
            <option value="Flight schedule adjustment">Flight schedule adjustment</option>
          </select>
        </div>

        {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

        {/* Actions Button Bar */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-transparent hover:bg-zinc-800 rounded-lg transition"
          >
            Go Back
          </button>
          <button
            onClick={handleCancelSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 rounded-lg transition text-white shadow"
          >
            {loading ? "Processing..." : "Confirm Cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
}