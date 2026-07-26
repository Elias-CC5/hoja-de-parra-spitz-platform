"use client";

import Image from "next/image";
import { useState } from "react";

export interface AccordionItemData {
  id: number;
  title: string;
  imageUrl: string;
}

interface AccordionItemProps {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
}

function AccordionItem({ item, isActive, onMouseEnter }: AccordionItemProps) {
  return (
    <div
      className={`
        relative h-[420px] rounded-2xl overflow-hidden cursor-pointer shrink-0
        border border-stone-800/80 shadow-2xl
        transition-all duration-700 ease-in-out
        ${isActive ? "w-[360px]" : "w-[56px]"}
      `}
      onMouseEnter={onMouseEnter}
    >
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        unoptimized
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-90" />

      <span
        className={`
          absolute whitespace-nowrap font-semibold
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0 text-white text-lg"
              : "w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90 text-amber-400 text-sm uppercase tracking-wide"
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
}

interface ImageAccordionProps {
  items?: AccordionItemData[];
  defaultActiveIndex?: number;
  onActiveChange?: (index: number) => void;
}

export function ImageAccordion({
  items = [],
  defaultActiveIndex = 0,
  onActiveChange,
}: ImageAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  const handleHover = (index: number) => {
    setActiveIndex(index);
    onActiveChange?.(index);
  };

  return (
    <div className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => handleHover(index)}
        />
      ))}
    </div>
  );
}