"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../../components/BackButton";
import { resourcesData } from "../../data/resources";
import ResourceLogo from "./ResourceLogo";

export default function ResourcesBoard() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

  const sortedResources = useMemo(() => {
    return [...resourcesData].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));
  }, []);

  const categories = useMemo(() => {
    const names = sortedResources.map((item) => item.category?.trim()).filter(Boolean) as string[];
    return ["全部", ...Array.from(new Set(names))];
  }, [sortedResources]);

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return sortedResources.filter((item) => {
      const inCategory = activeCategory === "全部" || item.category === activeCategory;
      const inSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.category || "").toLowerCase().includes(query);
      return inCategory && inSearch;
    });
  }, [activeCategory, searchQuery, sortedResources]);

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col items-center md:items-start">
        <div className="mb-6 flex w-full justify-start">
          <BackButton />
        </div>
        <div className="w-full text-center md:text-left">
          <h1 className="mb-3 text-3xl font-black uppercase tracking-widest text-slate-900 drop-shadow-sm dark:text-white md:text-4xl">
            Resources Dock
          </h1>
          <p className="font-serif text-sm text-slate-600 dark:text-slate-400 md:text-base">
            常用网站、工具站、AI 与设计开发资源的轻量导航舱。
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/50 bg-white/35 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/35 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-xs font-black transition-all ${
                activeCategory === category
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white/55 text-slate-600 hover:bg-white/90 dark:bg-slate-800/55 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="搜索资源..."
          className="w-full rounded-full border border-white/40 bg-white/60 px-5 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-800/60 dark:text-white md:w-64"
        />
      </div>

      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource) => (
            <motion.a
              layout
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -18 }}
              className="group relative min-h-[150px] overflow-hidden rounded-3xl border border-white/45 bg-white/55 p-5 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-indigo-400/50 hover:shadow-indigo-500/20 dark:border-white/10 dark:bg-slate-800/50"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 dark:bg-purple-500/15" />
              <div className="relative z-10 flex items-start gap-4">
                <ResourceLogo resource={resource} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h2 className="truncate text-lg font-black text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                      {resource.name}
                    </h2>
                    {resource.category && (
                      <span className="shrink-0 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black text-indigo-600 dark:text-indigo-300">
                        {resource.category}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {resource.description}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-4 rounded-2xl border border-white/45 bg-white/90 p-3 text-xs leading-relaxed text-slate-600 opacity-0 shadow-lg backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-300">
                {resource.description}
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredResources.length === 0 && (
        <div className="py-20 text-center font-serif text-slate-500">这个分类里暂时还没有资源。</div>
      )}
    </div>
  );
}
