import { NextResponse } from "next/server";

// Agar ma'lumotlar bazasi ulanmagan bo'lsa, xotiradagi massiv (namuna sifatida)
let posts = [
  {
    id: 1,
    title: "JavaScript-da massivlar",
    description:
      "Massivlar ma'lumotlarni saqlash va boshqarish uchun juda qulay.",
    ip: "127.0.0.1",
    device: "Windows (Chrome)",
    createdAt: new Date().toLocaleTimeString(),
  },
];

// User-Agent stringidan qurilma va brauzerni ajratib oluvchi yordamchi funksiya
function getDeviceInfo(ua) {
  let os = "Noma'lum OS";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Noma'lum Brauzer";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua))
    browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";
  else if (/opr|opera/i.test(ua)) browser = "Opera";

  return `${os} (${browser})`;
}

// Barcha postlarni olish (GET)
export async function GET() {
  return NextResponse.json(posts);
}

// Yangi post yaratish va IP/Device bilan birga saqlash (POST)
export async function POST(req) {
  try {
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Maydonlar to'ldirilishi shart" },
        { status: 400 },
      );
    }

    // 1. IP manzilni aniqlash
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "127.0.0.1";

    // 2. Qurilma va brauzer turini aniqlash
    const userAgent = req.headers.get("user-agent") || "";
    const device = getDeviceInfo(userAgent);

    const newPost = {
      id: Date.now(),
      title,
      description,
      ip,
      device,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Bazaga yoki massiv boshiga qo'shish
    posts.unshift(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

// Postni o'chirish (DELETE)
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    posts = posts.filter((post) => post.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "O'chirishda xatolik" }, { status: 500 });
  }
}
