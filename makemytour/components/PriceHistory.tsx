"use client";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriceHistory() {
  const data = [{ name: 'Mon', price: 3500 }, { name: 'Wed', price: 4200 }, { name: 'Fri', price: 3800 }];
  
  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm mt-6">
      <h3 className="font-bold text-sm mb-4">📈 Price Trend & Freeze</h3>
      <div className="h-32 w-full">
        <ResponsiveContainer><LineChart data={data}><XAxis dataKey="name" hide /><Tooltip /><Line type="monotone" dataKey="price" stroke="#3b82f6" /></LineChart></ResponsiveContainer>
      </div>
      <button onClick={() => alert("Price Locked for 24 Hours!")} className="w-full mt-4 bg-emerald-600 text-white py-2 rounded text-xs font-bold">
        ❄️ Freeze Price
      </button>
    </div>
  );
}