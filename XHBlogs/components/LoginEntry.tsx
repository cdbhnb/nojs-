"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type BlogUser = {
  type: "guest" | "github";
  nickname: string;
  avatar: string;
  createdAt: string;
};

const USER_KEY = "db996_blog_user";
const DEFAULT_AVATAR = "/siamese-cat.png";

function cleanNickname(value: string) {
  return value.replace(/[<>`"'\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
}

export default function LoginEntry() {
  const [user, setUser] = useState<BlogUser | null>(null);
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [githubHint, setGithubHint] = useState("");

  useEffect(() => {
    const syncUser = () => {
      try {
        const saved = localStorage.getItem(USER_KEY);
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };
    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleGuestLogin = (event: FormEvent) => {
    event.preventDefault();
    const safeName = cleanNickname(nickname);
    if (!safeName) return;
    const nextUser: BlogUser = {
      type: "guest",
      nickname: safeName,
      avatar: DEFAULT_AVATAR,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setNickname("");
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 items-center gap-2 rounded-full border border-white/40 bg-white/55 px-3 text-xs font-black text-slate-700 shadow-sm backdrop-blur-xl transition-all hover:bg-white/90 dark:border-white/10 dark:bg-slate-800/55 dark:text-slate-200"
      >
        {user ? (
          <>
            <img src={user.avatar || DEFAULT_AVATAR} alt={user.nickname} className="h-5 w-5 rounded-full object-cover" />
            <span className="hidden max-w-20 truncate lg:inline">{user.nickname}</span>
          </>
        ) : (
          "登录"
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute right-0 top-12 z-[120] w-72 rounded-3xl border border-white/50 bg-white/90 p-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/90"
          >
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={user.avatar || DEFAULT_AVATAR} alt={user.nickname} className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900 dark:text-white">{user.nickname}</p>
                    <p className="text-[10px] text-slate-400">{user.type === "guest" ? "游客" : "GitHub"}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full rounded-2xl bg-red-500 py-3 text-xs font-black text-white shadow-lg shadow-red-500/20">
                  退出登录
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <form onSubmit={handleGuestLogin} className="space-y-2">
                  <input
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    placeholder="游客昵称"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button className="w-full rounded-2xl bg-indigo-500 py-3 text-xs font-black text-white shadow-lg shadow-indigo-500/25">
                    游客登录
                  </button>
                </form>
                <button
                  onClick={() => setGithubHint("GitHub 登录入口已预留，请先配置 OAuth 环境变量后接入回调。")}
                  className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-black text-white dark:bg-white dark:text-slate-900"
                >
                  GitHub 登录
                </button>
                {githubHint && <p className="text-xs leading-relaxed text-amber-600 dark:text-amber-300">{githubHint}</p>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
