import { NextResponse } from "next/server";

const SECRET_PASSWORD = "7788"; // Siz belgilagan maxfiy parol

export async function POST(req) {
  try {
    const { ip, password } = await req.json();

    // 1. Parol tekshiruvi
    if (password !== SECRET_PASSWORD) {
      return NextResponse.json(
        { error: "Parol noto'g'ri! Kirish rad etildi." },
        { status: 401 },
      );
    }

    if (!ip || !ip.trim()) {
      return NextResponse.json(
        { error: "IP manzilni kiritish shart!" },
        { status: 400 },
      );
    }

    const cleanIp = ip.trim();

    // Localhost IP tekshiruvi
    if (
      cleanIp === "127.0.0.1" ||
      cleanIp === "::1" ||
      cleanIp.startsWith("192.168.")
    ) {
      return NextResponse.json(
        { error: "Lokal IP manzillarni global tarmoqda aniqlab bo'lmaydi." },
        { status: 400 },
      );
    }

    // 2. IP orqali to'liq ma'lumot olish
    const res = await fetch(
      `http://ip-api.com/json/${cleanIp}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
      { cache: "no-store" },
    );
    const data = await res.json();

    if (data.status !== "success") {
      return NextResponse.json(
        {
          error:
            data.message || "Bunday IP manzil bo'yicha ma'lumot topilmadi.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ip: data.query,
      country: data.country,
      city: data.city,
      region: data.regionName,
      timezone: data.timezone,
      isp: data.isp,
      lat: data.lat,
      lon: data.lon,
      mapsUrl: `https://www.google.com/maps?q=${data.lat},${data.lon}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Serverda kutilmagan xatolik yuz berdi." },
      { status: 500 },
    );
  }
}
