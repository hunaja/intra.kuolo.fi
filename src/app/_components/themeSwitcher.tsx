"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (theme === "light") {
    return (
      <Button isIconOnly variant="bordered" onPress={() => setTheme("dark")}>
        <MoonIcon width={15} />
      </Button>
    );
  }

  return (
    <Button isIconOnly variant="bordered" onPress={() => setTheme("light")}>
      <SunIcon width={15} />
    </Button>
  );
}
