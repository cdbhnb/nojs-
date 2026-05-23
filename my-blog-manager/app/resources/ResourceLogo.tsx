"use client";

import { useMemo, useState } from "react";
import { DEFAULT_RESOURCE_ICON, Resource } from "../../data/resources";

function getDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export function getResourceLogo(resource: Pick<Resource, "url" | "logo">) {
  if (resource.logo?.trim()) return resource.logo.trim();
  const domain = getDomain(resource.url);
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : DEFAULT_RESOURCE_ICON;
}

export default function ResourceLogo({ resource }: { resource: Resource }) {
  const [failed, setFailed] = useState(false);
  const src = useMemo(() => getResourceLogo(resource), [resource]);

  return (
    <img
      src={failed ? DEFAULT_RESOURCE_ICON : src}
      alt={`${resource.name} logo`}
      onError={() => setFailed(true)}
      className="h-12 w-12 rounded-2xl bg-white/80 object-contain p-2 shadow-inner dark:bg-slate-950/70"
    />
  );
}
