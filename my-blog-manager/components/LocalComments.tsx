"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type BlogUser = {
  type: "guest" | "github";
  nickname: string;
  avatar: string;
  createdAt: string;
};

type LocalComment = {
  id: string;
  user: BlogUser;
  content: string;
  createdAt: string;
};

const USER_KEY = "db996_blog_user";
const DEFAULT_AVATAR = "/siamese-cat.png";

function cleanText(value: string, maxLength: number) {
  return value.replace(/[<>`"'\\]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function getCommentKey(pageId: string) {
  return `db996_blog_comments:${pageId}`;
}

function formatTime(value: string) {
  try {
    return new Date(value).toLocaleString("zh-CN", { hour12: false });
  } catch {
    return value;
  }
}

export default function LocalComments({ pageId, compact = false }: { pageId?: string; compact?: boolean }) {
  const pathname = usePathname();
  const finalPageId = useMemo(() => (pageId || pathname.replace(/\/$/, "") || "/").substring(0, 80), [pageId, pathname]);
  const [user, setUser] = useState<BlogUser | null>(null);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [githubHint, setGithubHint] = useState("");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) setUser(JSON.parse(savedUser));
      const savedComments = localStorage.getItem(getCommentKey(finalPageId));
      if (savedComments) setComments(JSON.parse(savedComments));
      else setComments([]);
    } catch {
      setComments([]);
    }
  }, [finalPageId]);

  const saveComments = (next: LocalComment[]) => {
    setComments(next);
    localStorage.setItem(getCommentKey(finalPageId), JSON.stringify(next));
  };

  const handleGuestLogin = (event: FormEvent) => {
    event.preventDefault();
    const safeName = cleanText(nickname, 24);
    if (!safeName) return;
    const nextUser: BlogUser = {
      type: "guest",
      nickname: safeName,
      avatar: DEFAULT_AVATAR,
      createdAt: new Date().toISOString()
    };
    setUser(nextUser);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setNickname("");
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setContent("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    const safeContent = content.replace(/\r\n/g, "\n").replace(/[<>]/g, "").trim().slice(0, 1000);
    if (!safeContent) return;
    const next = [
      {
        id: `comment_${Date.now()}`,
        user,
        content: safeContent,
        createdAt: new Date().toISOString()
      },
      ...comments
    ];
    saveComments(next);
    setContent("");
  };

  const panelClass = compact
    ? "rounded-2xl border border-white/40 bg-white/35 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/35"
    : "rounded-3xl border border-white/45 bg-white/45 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 md:p-6";

  return (
    <div className={compact ? "w-full" : "relative mt-16 w-full"}>
      {!compact && <div className="pointer-events-none absolute -top-10 left-1/2 z-0 h-32 w-3/4 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />}

      <div className={`relative z-10 ${panelClass}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className={`${compact ? "text-sm" : "text-lg"} font-black text-slate-900 dark:text-white`}>评论区</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{user ? `当前身份：${user.nickname}（${user.type === "guest" ? "游客" : "GitHub"}）` : "请先登录后再评论"}</p>
          </div>
          {user && (
            <button onClick={handleLogout} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 transition-colors hover:bg-red-500 hover:text-white dark:bg-slate-800 dark:text-slate-300">
              退出登录
            </button>
          )}
        </div>

        {!user ? (
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <form onSubmit={handleGuestLogin} className="flex gap-2">
              <input
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="输入游客昵称"
                className="min-w-0 flex-1 rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-800/70 dark:text-white"
              />
              <button className="rounded-2xl bg-indigo-500 px-5 py-3 text-xs font-black text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-600">
                游客登录
              </button>
            </form>
            <button
              onClick={() => setGithubHint("GitHub 登录入口已预留。请先配置 README 中的 GITHUB_CLIENT_ID、GITHUB_CLIENT_SECRET、GITHUB_REDIRECT_URI，再接入 OAuth 回调。")}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-xs font-black text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900"
            >
              GitHub 登录
            </button>
            {githubHint && <p className="md:col-span-2 text-xs leading-relaxed text-amber-600 dark:text-amber-300">{githubHint}</p>}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="写点什么..."
              className={`${compact ? "min-h-20" : "min-h-28"} w-full resize-none rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-800/70 dark:text-white`}
            />
            <div className="flex justify-end">
              <button className="rounded-2xl bg-indigo-500 px-6 py-3 text-xs font-black text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-600">
                发布评论
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-white/35 bg-white/40 p-4 dark:border-white/10 dark:bg-slate-800/35">
              <div className="mb-3 flex items-center gap-3">
                <img src={comment.user.avatar || DEFAULT_AVATAR} alt={comment.user.nickname} className="h-9 w-9 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{comment.user.nickname}</span>
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black text-indigo-600 dark:text-indigo-300">{comment.user.type === "guest" ? "游客" : "GitHub"}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{formatTime(comment.createdAt)}</span>
                </div>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && <p className="py-4 text-center text-xs text-slate-400">还没有评论。</p>}
        </div>
      </div>
    </div>
  );
}
