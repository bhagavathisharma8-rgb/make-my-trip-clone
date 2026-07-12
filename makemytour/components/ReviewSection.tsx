"use client";

import React, { useState, useEffect } from "react";

interface Reply {
  user: String;
  text: string;
  timestamp: string;
}

interface Review {
  id: string;
  targetId: string;
  reviewType: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  photos: string[];
  helpfulCount: number;
  flagged: boolean;
  createdAt: string;
  replies: Reply[];
}

interface Props {
  targetId: string;
  type: "FLIGHT" | "HOTEL";
}

export default function ReviewSection({ targetId, type }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photoUrl, setPhotosUrl] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeReplyBoxId, setActiveReplyBoxId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const BASE_URL = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8081"
    : "https://make-my-trip-clone-qaq2.onrender.com";

  const loadReviewsData = () => {
    fetch(`${BASE_URL}/api/reviews/${type}/${targetId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadReviewsData();
  }, [targetId, type]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const email = localStorage.getItem("email") || "guest@makemytour.com";
    const name = email.split("@")[0];

    const payload = {
      targetId,
      reviewType: type,
      userEmail: email,
      userName: name,
      rating,
      comment,
      photos: photoUrl ? [photoUrl] : [],
    };

    try {
      const res = await fetch(`${BASE_URL}/api/reviews/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setComment("");
        setPhotosUrl("");
        loadReviewsData();
      }
    } catch (err) {
      alert("Failed to save your feedback.");
    }
  };

  const handlePostReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    const email = localStorage.getItem("email") || "user@makemytour.com";

    try {
      const res = await fetch(`${BASE_URL}/api/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: email.split("@")[0], text: replyText }),
      });
      if (res.ok) {
        setReplyText("");
        setActiveReplyBoxId(null);
        loadReviewsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvoteHelpful = async (reviewId: string) => {
    await fetch(`${BASE_URL}/api/reviews/${reviewId}/helpful`, { method: "POST" });
    loadReviewsData();
  };

  const handleFlagContent = async (reviewId: string) => {
    await fetch(`${BASE_URL}/api/reviews/${reviewId}/flag`, { method: "POST" });
    alert("This review content block has been flagged for moderation screening review rules successfully.");
    loadReviewsData();
  };

  // Sorting Handler Algorithms
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "helpful") return b.helpfulCount - a.helpfulCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // default: "newest"
  });

  return (
    <div className="w-full bg-white border rounded-xl p-6 shadow-sm text-left text-xs font-sans text-slate-800 space-y-6">
      
      {/* HEADER CONTROLLER ACCORDIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3">
        <div>
          <h3 className="text-base font-black text-slate-950 uppercase tracking-wide">⭐ User Generated Reviews & Ratings Feedback</h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Read true community feedback or contribute your personal flight experience</p>
        </div>
        <div className="flex items-center gap-2 font-bold text-slate-500">
          <span>Sort Feedback Filter:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-1.5 rounded-lg bg-slate-50 outline-none text-black">
            <option value="newest">📅 Newest Feedback</option>
            <option value="highest">⭐ Highest Rated</option>
            <option value="helpful">👍 Most Helpful</option>
          </select>
        </div>
      </div>

      {/* INPUT FORM PANEL CONTAINER */}
      <form onSubmit={handleSubmitReview} className="bg-slate-50 border p-4 rounded-xl space-y-4 shadow-inner">
        <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Write a detailed customer review pass</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Star Rating Scale</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)} className={`text-base transition-transform active:scale-90 ${s <= rating ? 'text-amber-400' : 'text-slate-300'}`}>★</button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Upload Supplemental Photo Link URL</label>
            <input type="text" placeholder="Paste feedback photo image URL here..." value={photoUrl} onChange={(e) => setPhotosUrl(e.target.value)} className="w-full border p-2 rounded-lg bg-white outline-none font-medium" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Review Statement Comments</label>
          <textarea rows={3} placeholder="Share extensive details concerning cleanliness, staff manners, or itinerary timelines..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border p-3 rounded-xl bg-white outline-none text-black font-semibold resize-none" />
        </div>

        <button type="submit" className="bg-slate-900 hover:bg-black text-white px-4 py-2 font-bold uppercase tracking-wide rounded-lg shadow-sm">Submit Feedback Record</button>
      </form>

      {/* REVIEWS GRID RENDER LIST LOGS */}
      <div className="space-y-4 pt-2">
        {sortedReviews.length === 0 ? (
          <p className="text-center py-6 font-medium text-slate-400 border border-dashed rounded-xl">No verified feedback logs loaded for this database target profile reference index yet.</p>
        ) : (
          sortedReviews.map((rev) => (
            <div key={rev.id} className={`p-4 border rounded-xl space-y-3 bg-white ${rev.flagged ? 'border-amber-200 bg-amber-50/10' : 'border-gray-100'}`}>
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-gray-900 capitalize">{rev.userName}</span>
                    <span className="text-slate-300">•</span>
                    <div className="flex text-[10px] text-amber-400">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <button type="button" onClick={() => handleUpvoteHelpful(rev.id)} className="hover:text-blue-600 flex items-center gap-0.5">👍 Helpful ({rev.helpfulCount})</button>
                  <span>•</span>
                  <button type="button" onClick={() => handleFlagContent(rev.id)} className="hover:text-amber-600">🚩 Flag Inappropriate</button>
                </div>
              </div>

              <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{rev.comment}</p>

              {/* PHOTO PREVIEW DISPLAY BLOCKS */}
              {rev.photos && rev.photos.length > 0 && rev.photos[0] && (
                <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-100 shadow-sm"><img src={rev.photos[0]} alt="Review snapshot Attach" className="w-full h-full object-cover" /></div>
              )}

              {/* REPLIES ITERATIVE THREAD COMPONENT ROW */}
              <div className="pl-4 border-l-2 border-slate-100 space-y-2 pt-1">
                {rev.replies && rev.replies.map((rep, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-lg text-left">
                    <p className="font-bold text-gray-900 capitalize">{rep.user} <span className="text-[9px] text-slate-400 font-normal ml-1 font-mono">{new Date(rep.timestamp).toLocaleDateString()}</span></p>
                    <p className="text-slate-600 font-medium mt-0.5">{rep.text}</p>
                  </div>
                ))}

                {/* REPLY INTERACTION TRIGGER INPUT ACCORDIONS */}
                {activeReplyBoxId === rev.id ? (
                  <div className="flex gap-2 pt-1 items-center">
                    <input type="text" placeholder="Write conversation reply segment..." value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 border p-1.5 bg-white font-medium rounded" />
                    <button type="button" onClick={() => handlePostReply(rev.id)} className="bg-slate-800 text-white font-bold px-3 py-1.5 rounded uppercase text-[10px]">Post</button>
                    <button type="button" onClick={() => setActiveReplyBoxId(null)} className="text-slate-400 hover:underline">Cancel</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setActiveReplyBoxId(rev.id)} className="text-[10px] text-blue-500 font-bold hover:underline mt-1 block">💬 Write Conversation Reply Thread</button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}