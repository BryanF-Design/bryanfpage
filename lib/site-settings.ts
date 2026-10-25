import { unstable_cache } from "next/cache";

import { readPublicSettings } from "@/lib/db";
import { normalizeSettings, type SiteSettings } from "@/lib/seasons";

/** Etiqueta de caché: el panel la invalida al guardar. */
export const SETTINGS_TAG = "site-settings";

async function load(): Promise<SiteSettings> {
  try {
    return normalizeSettings(await readPublicSettings());
  } catch (error) {
    console.error("Ajustes del sitio: se usan los de fábrica", error);
    return normalizeSettings({});
  }
}

/**
 * Ajustes del sitio para páginas, layout y cobros (en caché 5 minutos;
 * guardar en el panel la renueva al instante, así lo que se muestra y lo que
 * se cobra salen del mismo dato).
 */
export const getSiteSettings = unstable_cache(load, ["site-settings-v1"], {
  revalidate: 300,
  tags: [SETTINGS_TAG],
});
