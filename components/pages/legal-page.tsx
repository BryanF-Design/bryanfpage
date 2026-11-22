"use client";

import type { ReactNode } from "react";

import { PageIntro } from "@/components/pages/page-intro";
import { SubPageShell } from "@/components/pages/sub-page-shell";

export interface LegalSection {
  title: string;
  body: ReactNode;
}

/**
 * Páginas legales con el mismo diseño del sitio (antes eran HTML estático
 * oscuro con otro estilo; auditoría P2-3). Texto en español, claro y corto.
 */
export function LegalPage({
  eyebrow,
  title,
  subtitle,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <SubPageShell>
      <PageIntro eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <article className="panel px-5 py-8 shadow-soft sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <p className="text-sm font-semibold text-ink/60">{updated}</p>
        <ol className="mt-6 flex max-w-3xl flex-col gap-8">
          {sections.map((s, i) => (
            <li key={s.title} className="reveal reveal-up" style={{ ["--stagger" as string]: Math.min(i, 4) }}>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
                <span className="mr-2 text-lime-deep">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="mt-2 flex flex-col gap-3 text-pretty text-base leading-relaxed text-ink/75 [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-lime [&_a]:decoration-2 [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc">
                {s.body}
              </div>
            </li>
          ))}
        </ol>
      </article>
    </SubPageShell>
  );
}
