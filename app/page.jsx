"use client";

import { useEffect, useState } from "react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Xatolik:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addPost(e) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return alert("Maydonlarni to'liq to'ldiring.");
    }

    setSubmitting(true);

    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      setTitle("");
      setDescription("");
      fetchPosts();
    } catch (err) {
      alert("Post qo'shishda xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deletePost(id) {
    let answer = prompt("Parolni kiriting:");

    if (answer !== "7788") {
      return alert("Parol noto'g'ri va postlarga teginma!");
    }

    await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchPosts();
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto transition-colors duration-200">
      <h1 className="text-3xl font-bold tracking-tight text-center mb-8 flex items-center justify-center gap-2">
        📰 Maqolalar
      </h1>

      {/* Post yaratish formasi */}
      <form
        onSubmit={addPost}
        className="bg-white w-full max-w-[500px] mx-auto dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm mb-10 flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Sarlavha..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition"
        />
        <textarea
          rows={3}
          placeholder="Maqola tavsifi..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition resize-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium hover:opacity-90 active:scale-[0.98] transition cursor-pointer self-end disabled:opacity-50"
        >
          <span>➕</span> {submitting ? "Qo'shilmoqda..." : "Maqola qo'shish"}
        </button>
      </form>

      {/* Postlar ro'yxati */}
      {loading ? (
        <div className="flex justify-center items-center py-12 text-neutral-500 dark:text-neutral-400 font-medium animate-pulse">
          ⌛ Yuklanmoqda...
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-neutral-500">
          Hozircha hech qanday post mavjud emas.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col justify-between p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                  {post.title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-4">
                  {post.description}
                </p>
              </div>

              {/* IP, Qurilma va O'chirish qismi */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2 text-xs">
                <div className="flex flex-col gap-1 text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1 font-mono">
                    🌐 IP:{" "}
                    <strong className="text-neutral-700 dark:text-neutral-300">
                      {post.ip || "127.0.0.1"}
                    </strong>
                  </span>
                  <span className="flex items-center gap-1">
                    📱 Qurilma:{" "}
                    <strong className="text-neutral-700 dark:text-neutral-300">
                      {post.device || "Noma'lum"}
                    </strong>
                  </span>
                  {post.createdAt && (
                    <span className="text-[11px] text-neutral-400">
                      🕒 {post.createdAt}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => deletePost(post.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer self-end"
                >
                  🗑️ O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
