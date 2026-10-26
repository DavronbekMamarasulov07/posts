let posts = [
  {
    id: 1,
    title: "JavaScript-da massivlar bilan ishlash",
    description:
      "Massivlar (arrays) ma'lumotlarni tartibli saqlash uchun ishlatiladi. `map`, `filter` va `reduce` metodlari orqali ularni samarali boshqarish mumkin.",
  },
  {
    id: 2,
    title: "Frontend va Backend o'rtasidagi farq",
    description:
      "Frontend foydalanuvchi ko'radigan vizual qism va interfeys bo'lsa, Backend ma'lumotlar bazasi, server mantiqi va xavfsizlikni ta'minlaydi.",
  },
  {
    id: 3,
    title: "Dasturchi uchun Git va GitHub-ning ahamiyati",
    description:
      "Versiyalarni boshqarish tizimlari loyiha tarixini kuzatish, jamoa bilan hamkorlik qilish va xatolarni tezda ortga qaytarish uchun juda muhimdir.",
  },
  {
    id: 4,
    title: "API nima va u qanday ishlaydi?",
    description:
      "API (Application Programming Interface) — turli dasturiy ta'minotlar o'zaro ma'lumot almashishi va aloqa qilishi uchun mo'ljallangan ko'prikdir.",
  },
  {
    id: 5,
    title: "Toza kod (Clean Code) yozish qoidalari",
    description:
      "O'zgaruvchilarga tushunarli nom berish, ortiqcha takrorlanishlardan (DRY) qochish va funksiyalarni bitta vazifaga yo'naltirish kod sifatini oshiradi.",
  },
];

export async function GET() {
  return Response.json(posts);
}

export async function POST(req) {
  const data = await req.json();
  const newPost = { id: Date.now(), ...data };
  posts.push(newPost);
  return Response.json(newPost, { status: 201 });
}

export async function DELETE(req) {
  const { id } = await req.json();
  posts = posts.filter((p) => p.id !== id);
return Response.json({ message: "Post o'chirildi" }, { status: 200 });
}
