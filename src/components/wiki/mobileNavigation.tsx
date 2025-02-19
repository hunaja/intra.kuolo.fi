"use client";

import { WikiPages } from "@/app/wiki/page";
import { BookOpenIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";

export default function MobileWikiNavigation({
  pages,
  selectedSlug,
}: {
  pages: WikiPages;
  selectedSlug?: string;
}) {
  return (
    <Dropdown className="block sm:hidden">
      <DropdownTrigger className="flex w-full">
        <Button
          color="primary"
          className="mx-auto my-0 w-96"
          startContent={<BookOpenIcon width={15} />}
        >
          Wikin sisällöt
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Wiki mobiilinavigaatio"
        selectedKeys={new Set(selectedSlug ? [selectedSlug] : [])}
        selectionMode="single"
      >
        {Object.entries(pages).map(([category, pages]) => (
          <DropdownSection key={category} title={category}>
            {pages.map(({ slug, title }) => (
              <DropdownItem
                key={slug}
                href={`/wiki/${slug.substring(0, slug.length - 4)}`}
              >
                {title}
              </DropdownItem>
            ))}
          </DropdownSection>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
