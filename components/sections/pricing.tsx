import Link from "next/link";
import { Check, ArrowRight, CreditCard, Building2, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";

const plans = [
  {
    name: "Web profesional",
    price: "$3,500",
    unit: "MXN",
    desc: "Tu sitio a la medida, rápido y orientado a vender.",
    features: [
      "Diseño 100% personalizado",
      "Optimizado para Core Web Vitals",
      "Responsive en todo dispositivo",
      "Dominio y host gratis 1 año",
    ],
    featured: true,
  },
  {
    name: "Actualización",
    price: "$1,800",
    unit: "MXN",
    desc: "Renueva tu web actual con diseño y performance reales.",
    features: ["Rediseño visual", "Mejoras de velocidad", "Ajustes de SEO"],
    featured: false,
  },
  {
    name: "Mantenimiento",
    price: "$1,000",
    unit: "MXN / mes",
    desc: "Tu sitio siempre al día, seguro y respaldado.",
    features: ["Actualizaciones", "Respaldos", "Soporte continuo"],
    featured: false,
  },
];

const modules = [
  "E-commerce +$3,500",
  "Pasarela de pagos +$1,500",
  "Secciones extra +$350 c/u",
  "Mantenimiento +$1,000",
];

const methods = [
  { Icon: CreditCard, label: "Tarjeta (Stripe)" },
  { Icon: Wallet, label: "Mercado Pago" },
  { Icon: Building2, label: "Transferencia BBVA" },
];

export function Pricing() {
  return (
    <section
      id="precios"
      aria-label="Precios y configurador"
      className="border-t border-border py-20 md:py-28"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Precios"
          title="Arma tu web y paga en línea"
          subtitle="Elige tu paquete, suma los módulos que necesites y paga con tarjeta, Mercado Pago o transferencia. Sin sorpresas."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                "flex flex-col rounded-2xl border bg-card p-6 transition-colors " +
                (plan.featured
                  ? "border-primary/60 shadow-xl shadow-primary/5"
                  : "border-border")
              }
            >
              {plan.featured && (
                <span className="mb-3 w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Más elegido
                </span>
              )}
              <h3 className="font-display text-xl font-semibold text-foreground">
                {plan.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.unit}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{plan.desc}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-foreground/90"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.featured ? "default" : "outline"}
                className="mt-6 w-full"
              >
                <Link href="/crear-web">Configurar y pagar</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Modules + methods */}
        <div className="mt-10 flex flex-col items-center gap-6 rounded-2xl border border-border bg-secondary/30 p-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-sm font-medium text-foreground">
              Módulos extra a tu medida
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
              {modules.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 md:items-end">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {methods.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </span>
              ))}
            </div>
            <Button asChild size="lg">
              <Link href="/crear-web">
                Abrir configurador
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
