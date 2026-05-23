"use client";

import LocalComments from "./LocalComments";

export default function Comments({ pageId }: { pageId?: string }) {
  return <LocalComments pageId={pageId} />;
}
