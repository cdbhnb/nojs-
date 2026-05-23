"use client";

import LocalComments from "./LocalComments";

export default function LabComments({ pageId }: { pageId?: string }) {
  return <LocalComments pageId={pageId} />;
}
