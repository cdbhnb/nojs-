"use client";

import LocalComments from "./LocalComments";

export default function MomentComments({ id }: { id: string }) {
  return <LocalComments pageId={id} compact />;
}
