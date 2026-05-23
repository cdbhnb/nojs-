"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Edit3, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import BackButton from "../../components/BackButton";
import { useOperations } from "../../context/OperationContext";
import { useToast } from "../../components/ToastProvider";
import { Resource, resourcesData as initialResources } from "../../data/resources";
import ResourceLogo from "./ResourceLogo";

const emptyResource: Partial<Resource> = {
  name: "",
  url: "",
  description: "",
  category: "",
  logo: "",
  sort: 100
};

export default function ResourcesBoard() {
  const { addOperation } = useOperations();
  const { showToast } = useToast();
  const [editableResources, setEditableResources] = useState<Resource[]>(
    [...initialResources].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999))
  );
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceModal, setResourceModal] = useState<{ isOpen: boolean; mode: "add" | "edit"; data: Partial<Resource> }>({
    isOpen: false,
    mode: "add",
    data: emptyResource
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; name: string | null }>({
    isOpen: false,
    id: null,
    name: null
  });

  const sortedResources = useMemo(() => {
    return [...editableResources].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));
  }, [editableResources]);

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

  const syncToQueue = (nextList: Resource[]) => {
    addOperation({
      type: "sync_resources",
      label: "同步资源导航变更",
      description: "写入 data/resources.ts",
      payload: nextList,
      value: nextList
    } as any);
    showToast("资源变更已加入待处理队列，请点击右上角“更新本地”写入文件", "info");
  };

  const handleSaveResource = () => {
    const { mode, data } = resourceModal;
    if (!data.name?.trim() || !data.url?.trim()) {
      showToast("网站名称和网站链接不能为空", "warning");
      return;
    }

    const normalized: Resource = {
      id: data.id || `resource_${Date.now()}`,
      name: data.name.trim(),
      url: data.url.trim(),
      description: data.description?.trim() || "这个资源暂时还没有简介。",
      category: data.category?.trim() || "未分类",
      logo: data.logo?.trim() || "",
      sort: Number(data.sort ?? 100)
    };

    const next =
      mode === "add"
        ? [normalized, ...editableResources]
        : editableResources.map((item) => (item.id === normalized.id ? normalized : item));

    setEditableResources(next);
    syncToQueue(next);
    setResourceModal({ isOpen: false, mode: "add", data: emptyResource });
  };

  const confirmDelete = () => {
    if (!deleteModal.id) return;
    const next = editableResources.filter((item) => item.id !== deleteModal.id);
    setEditableResources(next);
    syncToQueue(next);
    setDeleteModal({ isOpen: false, id: null, name: null });
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:px-10">
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 18 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }} className="relative w-full max-w-sm rounded-[36px] border border-white/50 bg-white/85 p-8 text-center shadow-2xl backdrop-blur-2xl dark:bg-slate-900/85">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-red-500/10">
                <AlertTriangle className="text-red-500" />
              </div>
              <h3 className="mb-2 text-xl font-black text-slate-900 dark:text-white">删除资源？</h3>
              <p className="mb-7 text-sm leading-relaxed text-slate-500">
                确认移除 <span className="font-bold text-red-500">"{deleteModal.name}"</span> 吗？
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} className="flex-1 rounded-2xl bg-slate-100 py-3 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">取消</button>
                <button onClick={confirmDelete} className="flex-1 rounded-2xl bg-red-500 py-3 text-xs font-black text-white shadow-lg">确认删除</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resourceModal.isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="relative w-full max-w-lg rounded-[36px] border border-white/30 bg-white/90 p-7 shadow-2xl backdrop-blur-2xl dark:bg-slate-900/90">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-slate-900 dark:text-white">
                <Sparkles className="text-indigo-500" /> {resourceModal.mode === "add" ? "添加资源" : "编辑资源"}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input value={resourceModal.data.name || ""} onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, name: e.target.value } })} className="rounded-2xl bg-slate-100 px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/25 dark:text-white" placeholder="网站名称" />
                <input value={resourceModal.data.category || ""} onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, category: e.target.value } })} className="rounded-2xl bg-slate-100 px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/25 dark:text-white" placeholder="分类，可选" />
                <input value={resourceModal.data.url || ""} onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, url: e.target.value } })} className="md:col-span-2 rounded-2xl bg-slate-100 px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/25 dark:text-white" placeholder="网站链接 https://..." />
                <input value={resourceModal.data.logo || ""} onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, logo: e.target.value } })} className="md:col-span-2 rounded-2xl bg-slate-100 px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/25 dark:text-white" placeholder="Logo URL，可选；留空自动获取 favicon" />
                <textarea value={resourceModal.data.description || ""} onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, description: e.target.value } })} className="md:col-span-2 h-24 resize-none rounded-2xl bg-slate-100 px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/25 dark:text-white" placeholder="简介" />
                <input type="number" value={resourceModal.data.sort ?? 100} onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, sort: Number(e.target.value) } })} className="rounded-2xl bg-slate-100 px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/25 dark:text-white" placeholder="排序" />
              </div>
              <p className="mt-3 text-xs text-slate-400">Logo 留空时会按网站域名自动尝试 favicon，失败会使用默认图标。</p>
              <div className="mt-7 flex gap-3">
                <button onClick={() => setResourceModal({ isOpen: false, mode: "add", data: emptyResource })} className="flex-1 py-3 text-sm font-bold text-slate-500">取消</button>
                <button onClick={handleSaveResource} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-500 py-4 text-sm font-black text-white shadow-lg shadow-indigo-500/25">
                  <Save size={18} /> 加入暂存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col items-center md:items-start">
        <div className="mb-6 flex w-full justify-start">
          <BackButton />
        </div>
        <div className="w-full text-center md:text-left">
          <h1 className="mb-3 text-3xl font-black uppercase tracking-widest text-slate-900 dark:text-white md:text-4xl">Resources Dock</h1>
          <p className="font-serif text-sm text-slate-600 dark:text-slate-400 md:text-base">管理常用网站、工具站、资源站、AI 工具与开发工具。</p>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/50 bg-white/35 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/35 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2 text-xs font-black transition-all ${activeCategory === category ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "bg-white/55 text-slate-600 hover:bg-white/90 dark:bg-slate-800/55 dark:text-slate-300"}`}>
              {category}
            </button>
          ))}
        </div>
        <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索资源..." className="w-full rounded-full border border-white/40 bg-white/60 px-5 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-800/60 dark:text-white md:w-64" />
      </div>

      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.button layout onClick={() => setResourceModal({ isOpen: true, mode: "add", data: emptyResource })} className="group flex min-h-[150px] flex-col items-center justify-center rounded-3xl border-4 border-dashed border-slate-300 bg-white/10 transition-all duration-500 hover:border-indigo-500 hover:bg-indigo-500/5 dark:border-slate-700">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-md transition-all group-hover:rotate-90 group-hover:bg-indigo-500 group-hover:text-white dark:bg-slate-800">
            <Plus size={32} />
          </div>
          <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-500">添加资源</span>
        </motion.button>

        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource) => (
            <motion.div layout key={resource.id} initial={{ opacity: 0, scale: 0.95, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -18 }} className="group relative min-h-[150px]">
              <div className="absolute right-4 top-4 z-30 flex gap-2 opacity-0 transition-all group-hover:opacity-100">
                <button onClick={() => setResourceModal({ isOpen: true, mode: "edit", data: resource })} className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg transition-transform hover:scale-110"><Edit3 size={16} /></button>
                <button onClick={() => setDeleteModal({ isOpen: true, id: resource.id, name: resource.name })} className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg transition-transform hover:scale-110"><Trash2 size={16} /></button>
              </div>
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block h-full overflow-hidden rounded-3xl border border-white/45 bg-white/55 p-5 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-indigo-400/50 dark:border-white/10 dark:bg-slate-800/50">
                <div className="flex items-start gap-4">
                  <ResourceLogo resource={resource} />
                  <div className="min-w-0 flex-1 pr-16">
                    <h2 className="truncate text-lg font-black text-slate-900 dark:text-white">{resource.name}</h2>
                    <p className="mt-1 text-xs font-bold text-indigo-500">{resource.category || "未分类"} · sort {resource.sort ?? 100}</p>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{resource.description}</p>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
