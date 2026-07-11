"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialView: "login" | "signup";
}

export default function AuthModals({ isOpen, onClose, initialView }: AuthModalsProps) {
  const [view, setView] = useState<"login" | "signup">(initialView);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: ""
  });

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: ""
      });
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (view === "signup") {
      try {
        const response = await fetch("https://make-my-trip-clone-qaq2.onrender.com/user/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email.trim(),
            password: formData.password,
            phoneNumber: formData.phoneNumber
          })
        });

        if (response.ok) {
          alert("Registration Successful! Please log in now.");
          setView("login");
        } else {
          alert("Signup failed. That email might already be registered.");
        }
      } catch (err) {
        console.error(err);
        alert("Cannot connect to Spring Boot backend server.");
      } finally {
        setLoading(false);
      }
    } else {
      // FIXED: Uses standard form-urlencoded body payload to support Spring Boot @RequestParam perfectly over the cloud
      try {
        const bodyParams = new URLSearchParams();
        bodyParams.append("email", formData.email.trim());
        bodyParams.append("password", formData.password);

        const response = await fetch("https://make-my-trip-clone-qaq2.onrender.com/user/login", {
          method: "POST",
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded" 
          },
          body: bodyParams
        });

        if (response.ok) {
          const rawText = await response.text();
          let emailToSave = formData.email.trim();

          try {
            const parsedData = JSON.parse(rawText);
            if (parsedData && parsedData.email) {
              emailToSave = parsedData.email;
            }
          } catch (e) {
            // Handled if backend returns raw string tokens
          }

          localStorage.setItem("email", emailToSave);
          alert("Login Successful! Welcome to MakeMyTour.");
          onClose();
          window.location.reload(); 
        } else {
          alert("Invalid login credentials. Please check your email and password combinations.");
        }
      } catch (err) {
        console.error(err);
        alert("Connection error. Is your backend server live?");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-100 text-slate-800 text-left animate-in fade-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-black text-gray-900 text-center tracking-tight">
          {view === "signup" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-xs text-gray-400 text-center mb-6 mt-0.5">
          {view === "signup" ? "Join us to start booking your tours." : "Enter your credentials to access your account dashboard."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block mb-1">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 bg-slate-50 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 text-black font-semibold transition-all" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 bg-slate-50 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 text-black font-semibold transition-all" />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block mb-1">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 bg-slate-50 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 text-black font-semibold transition-all" />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 bg-slate-50 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 text-black font-semibold transition-all" />
          </div>

          {view === "signup" && (
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block mb-1">Phone Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 bg-slate-50 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 text-black font-semibold transition-all" />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all duration-150 active:scale-[0.99]"
          >
            {loading ? "Authenticating..." : view === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
          {view === "signup" ? (
            <p>Already have an account? <span onClick={() => setView("login")} className="text-blue-600 font-bold cursor-pointer hover:underline ml-1">Login</span></p>
          ) : (
            <p>Don't have an account yet? <span onClick={() => setView("signup")} className="text-blue-600 font-bold cursor-pointer hover:underline ml-1">Sign Up</span></p>
          )}
        </div>

      </div>
    </div>
  );
}