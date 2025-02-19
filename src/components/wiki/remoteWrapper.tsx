"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

export default function MDXRemoteWrapper({
  source,
}: {
  source: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  >;
}) {
  return <MDXRemote {...source} />;
}
