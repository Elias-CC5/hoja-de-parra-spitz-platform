"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ServiceFaq } from "@/types";

export function ServiceFaqAccordion({ faqs }: { faqs: ServiceFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="mb-4 font-display text-2xl font-medium">Preguntas frecuentes</h2>
      <Accordion.Root type="single" collapsible className="space-y-2">
        {faqs.map((faq) => (
          <Accordion.Item
            key={faq.id}
            value={faq.id}
            className="rounded-md border border-border px-4"
          >
            <Accordion.Trigger className="flex w-full items-center justify-between py-4 text-left text-sm font-medium [&[data-state=open]>svg]:rotate-180">
              {faq.question}
              <ChevronDown size={16} className="shrink-0 transition-transform" />
            </Accordion.Trigger>
            <Accordion.Content className="pb-4 text-sm text-muted-foreground">
              {faq.answer}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
