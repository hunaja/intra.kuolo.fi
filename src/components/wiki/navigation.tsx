"use client";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import type { WikiPages } from "@/server/api/wiki";

export default function WikiNavigation({
  pages,
  selectedSlug,
}: {
  pages: WikiPages;
  selectedSlug?: string;
}) {
  return (
    <Listbox
      selectedKeys={new Set(selectedSlug ? [selectedSlug] : [])}
      selectionMode="single"
      className="p-4"
      disallowEmptySelection
      topContent={<div className="p-4 text-center text-lg font-bold">Wiki</div>}
    >
      {Object.entries(pages).map(([category, pages]) => (
        <ListboxSection key={category} title={category}>
          {pages.map(({ slug, title }) => (
            <ListboxItem
              key={slug}
              value={slug}
              href={`/wiki/${slug.substring(0, slug.length - 4)}`}
            >
              {title}
            </ListboxItem>
          ))}
        </ListboxSection>
      ))}
    </Listbox>
  );
}
