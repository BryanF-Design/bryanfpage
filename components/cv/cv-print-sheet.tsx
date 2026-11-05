import Image from "next/image";

import { CV_CONTACT, INVENTORY, INVENTORY_SLOTS, QUESTS, SIDE_PROJECTS, TROPHIES } from "@/lib/cv/data";
import type { CvDict } from "@/lib/cv/i18n";

import { cvStyles as s } from "./cv-parts";

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

/**
 * Versión para "Guardar en PDF": un CV de verdad, blanco y en A4, con todo el
 * contenido en el idioma elegido. En pantalla no existe (solo `@media print`);
 * al imprimir, la consola del juego se oculta y queda solo esta hoja.
 */
export function CvPrintSheet({ t }: { t: CvDict }) {
  const inv = t.inventory;
  const itemName = (id: string, slot: string, name: string) => {
    if (slot === "lead") return inv.leadNames[id as keyof typeof inv.leadNames] ?? name;
    if (id in inv.aiNames) return inv.aiNames[id as keyof typeof inv.aiNames];
    if (id in inv.mktNames) return inv.mktNames[id as keyof typeof inv.mktNames];
    if (id in inv.autoNames) return inv.autoNames[id as keyof typeof inv.autoNames];
    if (id in inv.infraNames) return inv.infraNames[id as keyof typeof inv.infraNames];
    return name;
  };
  const period = (p: string | null, id: string) =>
    p === null ? (id === "indusecc" ? t.quests.concurrent : "") : p.endsWith("–") ? `${p} ${t.ui.today}` : p;

  return (
    <div className={s.printSheet} aria-hidden>
      {/* Encabezado */}
      <header className={s.psHeader}>
        <Image src="/img/cv/bryan-photo-full.webp" alt="" width={720} height={960} className={s.psPhoto} sizes="120px" />
        <div className={s.psHeadText}>
          <h1>{CV_CONTACT.fullName}</h1>
          <p className={s.psRole}>{t.start.role} · Tech Architect · Operations Manager</p>
          <p className={s.psContact}>
            <span>{CV_CONTACT.email}</span>
            <span>{CV_CONTACT.phoneLabel}</span>
            <span>bryanfdesign.com</span>
            <span>linkedin.com/in/bryanfdesigner</span>
            <span>{t.ui.baseValue}</span>
          </p>
        </div>
      </header>

      <div className={s.psGrid}>
        <main>
          <section>
            <h2>{t.profile.eyebrow}</h2>
            <p>{t.profile.summary}</p>
          </section>

          <section>
            <h2>{t.quests.title}</h2>
            {QUESTS.map((q) => {
              const item = t.quests.items[q.id as keyof CvDict["quests"]["items"]];
              const bullets = [...item.tech, ...item.ops];
              const when = period(q.period, q.id);
              return (
                <article key={q.id} className={s.psJob}>
                  <div className={s.psJobHead}>
                    <strong>{q.company}</strong>
                    {when ? <span>{when}</span> : null}
                  </div>
                  <p className={s.psJobRole}>{item.role}</p>
                  {bullets.length > 0 ? (
                    <ul>
                      {bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className={s.psMuted}>{item.scope}</p>
                  )}
                </article>
              );
            })}
          </section>

          <section>
            <h2>{t.trophies.title}</h2>
            <ul className={s.psProjects}>
              {TROPHIES.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> — {t.trophies.items[p.id as keyof CvDict["trophies"]["items"]].desc}{" "}
                  <span className={s.psMuted}>({host(p.url)})</span>
                </li>
              ))}
            </ul>
            <p className={s.psMuted}>
              {t.trophies.more}: {SIDE_PROJECTS.map((p) => p.name).join(" · ")}
            </p>
          </section>
        </main>

        <aside>
          <section>
            <h2>{t.profile.classesTitle}</h2>
            <ul className={s.psTags}>
              {t.profile.classes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          {INVENTORY_SLOTS.map((slot) => (
            <section key={slot}>
              <h2>{inv.slots[slot]}</h2>
              <p className={s.psList}>
                {INVENTORY.filter((i) => i.slot === slot)
                  .map((i) => itemName(i.id, i.slot, i.name))
                  .join(" · ")}
              </p>
            </section>
          ))}

          <section>
            <h2>{t.academy.title}</h2>
            {t.academy.education.map((e) => (
              <div key={e.school} className={s.psEdu}>
                <strong>{e.degree}</strong>
                <span>{e.school}</span>
                <span className={s.psMuted}>{e.period.endsWith("–") ? `${e.period} ${t.ui.today}` : e.period}</span>
              </div>
            ))}
          </section>

          <section>
            <h2>{t.academy.coursesTitle}</h2>
            <ul className={s.psCourses}>
              {t.academy.courses.map((c, i) => (
                <li key={`${c.year}-${i}`}>
                  <b>{c.year}</b> {c.name}
                  {c.org ? ` — ${c.org}` : ""}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{t.academy.languagesTitle}</h2>
            {t.academy.languages.map((l) => (
              <p key={l.name} className={s.psList}>
                <strong>{l.name}</strong> · {l.level}
              </p>
            ))}
          </section>

          <section>
            <h2>{t.contact.roles}</h2>
            <ul className={s.psTags}>
              {t.contact.rolesList.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <footer className={s.psFooter}>
        <Image src="/img/brand/logo-dark.png" alt="" width={720} height={253} className={s.psLogo} sizes="90px" />
        <span>
          {CV_CONTACT.website.replace(/\/$/, "")}/cv · {t.meta.title}
        </span>
      </footer>
    </div>
  );
}
