"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialView: "login" | "signup";
}

export default function AuthModals({ isOpen, onClose, initialView }: AuthModalsProps) {
  const [view, setView] = useState<"login" | "signup">(initialView);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: ""
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (view === "signup") {
      try {
        const response = await fetch("http://localhost:8080/user/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber
          })
        });

        if (response.ok) {
          alert("Registration Successful! Switching to Login.");
          setView("login");
        } else {
          alert("Signup failed. Check your data entry (or this email might already exist).");
        }
      } catch (err) {
        console.error(err);
        alert("Cannot connect to Spring Boot backend server.");
      }
    } else {
      // HANDLE LOGIN ACTION - Matching your Spring Boot @RequestParam setup
      try {
        const url = `http://localhost:8080/user/login?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`;
        
        const response = await fetch(url, {
          method: "POST"
        });

        if (response.ok) {
          const userData = await response.json();
          
          if (userData && userData.email) {
            // Save the session details directly into local storage browser memory
            localStorage.setItem("email", userData.email);
            
            // Cleanly close the modal layout layer and refresh page state
            onClose();
            window.location.reload();
          } else {
            alert("Login failed. Invalid user data returned.");
          }
        } else {
          alert("Invalid login credentials. Please check your email and password.");
        }
      } catch (err) {
        console.error(err);
        alert("Connection error. Is your Spring Boot backend running?");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-800">
          <X className="h-5 w-5" />
        </button>

        {/* Dynamic Header Titles */}
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          {view === "signup" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          {view === "signup" ? "Join us to start booking your tours." : "Enter your credentials to access your account."}
        </p>

        {/* Dynamic Form Layout */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {view === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-blue-500 text-black" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-blue-500 text-black" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-blue-500 text-black" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-blue-500 text-black" />
          </div>

          {view === "signup" && (
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Phone Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-blue-500 text-black" />
            </div>
          )}

          <button type="submit" className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition duration-200">
            {view === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Bottom Toggle Link */}
        <div className="mt-6 text-center text-xs text-gray-600">
          {view === "signup" ? (
            <p>Already have an account? <span onClick={() => setView("login")} className="text-blue-600 font-semibold cursor-pointer hover:underline">Login</span></p>
          ) : (
            <p>Don't have an account? <span onClick={() => setView("signup")} className="text-blue-600 font-semibold cursor-pointer hover:underline">Sign Up</span></p>
          )}
        </div>

      </div>
    </div>
  );
}