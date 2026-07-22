"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types";

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const displayImages = images.length > 0 ? images : [{ id: "placeholder", url: PLACEHOLDER_IMAGE, displayOrder: 0 }];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image src={displayImages[activeIndex].url} alt={name} fill className="object-cover" priority />
      </div>

      {displayImages.length > 1 && (
        <div className="mt-3 flex gap-2">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 overflow-hidden rounded-md border-2 ${
                index === activeIndex ? "border-accent" : "border-transparent"
              }`}
            >
              <Image src={image.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
