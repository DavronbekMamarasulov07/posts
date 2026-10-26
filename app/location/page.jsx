"use client";

import { useState } from "react";
import Link from "next/link";

export default function LocationPage() {
  const [ip, setIp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleLookup(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!ip.trim() || !password.trim()) {
      setError("Iltimos, IP manzil va parolni kiriting!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/lookup-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Xatolik yuz berdi");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-10 px-4 max-w-xl mx-auto transition-colors">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
        >
          ← Asosiy sahifaga qaytish
        </Link>
        <span className="text-xs bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full font-medium">
          Himoyalangan bo'lim
        </span>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          📍 IP Lokatsiya Aniqlash
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          IP manzilning aniq geografik joylashuvini ko'rish uchun parolni
          kiriting.
        </p>

        <form onSubmit={handleLookup} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              IP Manzil
            </label>
            <input
              type="text"
              placeholder="Masalan: 8.8.8.8 yoki 84.54.80.1"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Maxfiy Parol
            </label>
            <input
              type="password"
              placeholder="Parolni kiriting..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-sm"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium hover:opacity-90 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? "Qidirilmoqda..." : "🔍 Joylashuvni ko'rish"}
          </button>
        </form>
      </div>

      {/* Natija kartochkasi */}
      {result && (
        <div className="mt-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm animate-in fade-in">
          <h2 className="text-lg font-semibold mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center justify-between">
            <span>Ma'lumotlar topildi</span>
            <span className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
              {result.ip}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-500 text-xs">Davlat</p>
              <p className="font-medium text-base">{result.country}</p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">Shahar / Viloyat</p>
              <p className="font-medium text-base">
                {result.city}, {result.region}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">
                Internet Provayder (ISP)
              </p>
              <p className="font-medium">{result.isp}</p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">Vaqt mintaqasi</p>
              <p className="font-medium">{result.timezone}</p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">Koordinatalar</p>
              <p className="font-medium font-mono text-xs">
                {result.lat}, {result.lon}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <a
              href={result.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium transition"
            >
              🗺️ Google Maps'da ochish
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
