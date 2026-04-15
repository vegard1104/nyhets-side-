"use client";

import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Søk etter artikler...",
}: SearchBarProps) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = (v: string) => {
    setLocal(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), 300);
  };

  return (
    <input
      type="search"
      value={local}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
}
