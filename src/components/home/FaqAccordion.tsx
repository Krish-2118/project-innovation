"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { Faq } from "@/lib/data/faqs";

/** Accessible disclosure list; one answer open at a time. */
export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ol className="iv-faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        const isExternal = item.link?.href.startsWith("mailto:");
        return (
          <li key={item.question} className="iv-faq__item" data-open={isOpen}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="iv-faq__trigger"
              >
                <span className="iv-mono iv-faq__index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="iv-faq__question">{item.question}</span>
                <span className="iv-faq__star" aria-hidden="true">
                  ✦
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} className="iv-faq__panel" inert={!isOpen}>
              <div className="iv-faq__panel-inner">
                <p className="iv-body">{item.answer}</p>
                {item.link &&
                  (isExternal ? (
                    <a href={item.link.href} className="iv-link mt-4 inline-block">
                      {item.link.label}
                    </a>
                  ) : (
                    <Link href={item.link.href} className="iv-link mt-4 inline-block">
                      {item.link.label}
                    </Link>
                  ))}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
