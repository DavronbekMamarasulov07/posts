'use client'

import { useEffect, useState } from "react"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading,setLoading] = useState(true)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function fetchPosts() {
    setLoading(true)
    const res = await fetch('./api/posts')
    const data = await res.json()
    setPosts(data)  
    setLoading(false)
  }

  async function addPost(e) {
    e.preventDefault()

    if (!title || !description) return alert("Maydonni to'ldiring.")
    
    await fetch("./api/posts", {
      method: "POST",
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({title,description})
    })

    setTitle("")
    setDescription("")
    fetchPosts()
  }

  async function deletePost(id) {

    let answer = prompt("Parolni kiriting:")

    if(answer != "7788") return alert("Parol noto'g'ri va postlariga teginma!")

    await fetch("./api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id}),
    });

    fetchPosts()
  }

  useEffect(() => {
    fetchPosts()
  },[])

  return (
    <main className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 max-[400px] mx-auto transition-colors duration-200">
      <h1 className="text-3xl font-bold tracking-tight text-center mb-8 flex items-center justify-center gap-2">
        📰 Maqolalar
      </h1>

      <form
        onSubmit={addPost}
        className="bg-white w-full max-w-[400px] mx-auto dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm mb-10 flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Sarlavha..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition"
        />
        <textarea
          rows={4}
          placeholder="Maqola tavsifi..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition resize-none"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium hover:opacity-90 active:scale-[0.98] transition cursor-pointer self-end"
        >
          <span>➕</span> Maqola qo'shish
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-12 text-neutral-500 dark:text-neutral-400 font-medium animate-pulse">
          ⌛ Yuklanmoqda...
        </div>
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
              <div className="flex justify-end pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
                <button
                  onClick={() => deletePost(post.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
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
}

export default Home