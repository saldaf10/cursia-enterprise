"use client";

/**
 * Cursia — Landing premium (producción, ruta /)
 * Claro premium coherente con el interior de la app:
 * blanco + azul #0066FF primario + violeta #7C3AED acento + verde validación.
 * Funnel: atención → consideración → prueba social → conversión.
 * La landing anterior quedó archivada en /anterior.
 *
 * NOTA: las reseñas son PLACEHOLDERS EDITABLES. Reemplazar por testimonios reales.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";
import { SERVICES, tone, WHATSAPP_URL } from "./services";
import WhatsappFab from "./_components/WhatsappFab";

/* ── Scroll reveal ────────────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Spotlight de cursor en cards ─────────────────────────────────────────── */
function onCardMouseMove(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--cx", `${e.clientX - r.left}px`);
  el.style.setProperty("--cy", `${e.clientY - r.top}px`);
}

/* ── Reseñas — PLACEHOLDERS EDITABLES ─────────────────────────────────────── */
const REVIEWS = [
  { quote: "El reporte nos mostró exactamente dónde estaba el vacío de conocimiento. Capacitamos con foco y el cambio fue medible en semanas.", role: "Dirección de Talento Humano", org: "Sector financiero" },
  { quote: "Por fin un curso que no se puede 'pasar' copiando. Las preguntas abiertas con IA nos dieron una certificación en la que confiamos.", role: "Jefatura de Operaciones", org: "Manufactura" },
  { quote: "El agente sobre nuestros manuales le ahorra horas al equipo cada semana. Responde al instante y siempre cita la fuente.", role: "Líder de L&D", org: "Retail" },
  { quote: "La nueva página web cambió por completo cómo nos perciben los clientes. Se siente premium y carga al instante.", role: "Gerencia de Marketing", org: "Servicios B2B" },
  { quote: "La auditoría de procesos destapó cuellos de botella que llevábamos años arrastrando. El plan fue claro y accionable.", role: "Dirección de Operaciones", org: "Logística" },
  { quote: "Montaron mi funnel y mis cursos llave en mano. Pasé de improvisar a tener una marca que vende sola.", role: "Creador de contenido", org: "Educación online" },
] as const;

/* ── Nodos de la constelación del hero (5 servicios alrededor del núcleo) ──── */
const NODE_LABELS = ["Web premium", "Cursos IA", "Auditoría", "Funnels", "Software"];
const NODES = SERVICES.map((s, k) => {
  const ang = ((-90 + k * 72) * Math.PI) / 180;
  const R = 37; // radio en %
  return {
    label: NODE_LABELS[k] ?? s.title,
    icon: s.icon,
    tone: s.tone,
    x: +(50 + R * Math.cos(ang)).toFixed(2),
    y: +(50 + R * Math.sin(ang)).toFixed(2),
  };
});

/* ════════════════════════════════════════════════════════════════════════ */

export default function ReinventionLanding() {
  useScrollReveal();
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const reviewsRail = useRef<HTMLDivElement>(null);

  // Coverflow 3D de servicios (manual, giratorio infinito)
  const [activeSvc, setActiveSvc] = useState(0);
  const goSvc = useCallback(
    (dir: number) => setActiveSvc((a) => (a + dir + SERVICES.length) % SERVICES.length),
    []
  );
  const svcDrag = useRef<{ x: number; active: boolean }>({ x: 0, active: false });
  const onSvcPointerDown = useCallback((e: React.PointerEvent) => {
    svcDrag.current = { x: e.clientX, active: true };
  }, []);
  const onSvcPointerUp = useCallback((e: React.PointerEvent) => {
    if (!svcDrag.current.active) return;
    svcDrag.current.active = false;
    const dx = e.clientX - svcDrag.current.x;
    // Arrastre (swipe)
    if (Math.abs(dx) > 45) { goSvc(dx > 0 ? -1 : 1); return; }
    // Clic simple: según la mitad donde se hizo clic
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = e.clientX - (rect.left + rect.width / 2);
    if (rel > 175) goSvc(1);
    else if (rel < -175) goSvc(-1);
    // Zona central (tarjeta activa): no mueve, deja navegar el botón
  }, [goSvc]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Parallax del hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        hero.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    };
    hero.addEventListener("mousemove", onMove);
    return () => { hero.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  const slide = useCallback((ref: React.RefObject<HTMLDivElement | null>, dir: number) => {
    const rail = ref.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * (rail.clientWidth * 0.8), behavior: "smooth" });
  }, []);

  return (
    <div className="cursia-root min-h-screen bg-white text-[#191C1E] antialiased font-body selection:bg-[#0066FF]/15 selection:text-[#0066FF] overflow-x-hidden">
      <StyleBlock />
      <WhatsappFab />

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="aura aura--blue" />
        <div className="aura aura--violet" />
        <div className="grid-faint" />
      </div>

      {/* ── Navbar ── */}
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
        <nav className={`flex items-center gap-2 sm:gap-6 rounded-full border px-4 sm:px-6 py-2.5 transition-all duration-500 ${
          scrolled ? "border-black/5 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(2,12,40,0.35)]" : "border-black/[0.04] bg-white/50 backdrop-blur-md"
        }`}>
          <span className="font-headline font-extrabold text-lg tracking-tight">Curs<span className="text-[#0066FF]">ia</span></span>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#424656]">
            <a href="#servicios" className="hover:text-[#0066FF] transition-colors">Servicios</a>
            <a href="#proceso" className="hover:text-[#0066FF] transition-colors">Proceso</a>
            <a href="#resenas" className="hover:text-[#0066FF] transition-colors">Reseñas</a>
          </div>
          <a href="#contacto" className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-[#0066FF] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,102,255,0.7)] hover:bg-[#0052cc] transition-all">
            Hablemos <ArrowRight className="w-4 h-4" />
          </a>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section ref={heroRef} className="hero relative z-10 min-h-[100svh] flex items-center px-6 pt-32 pb-20 overflow-hidden">
        <MouseField />
        <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div>
            <div data-reveal className="reveal inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-[#F7F9FB] px-4 py-1.5 text-xs font-semibold text-[#424656]">
              <CheckCircle2 className="w-4 h-4 text-[#006C49]" /> Resultados verificables con IA
            </div>
            <h1 data-reveal className="reveal reveal--1 font-headline font-extrabold tracking-tight mt-6 text-[clamp(2.5rem,6.5vw,5rem)] leading-[1.06]">
              <span className="block">La inteligencia que</span>
              <span className="grad-text">construye tu futuro digital.</span>
            </h1>
            <p data-reveal className="reveal reveal--2 mt-6 max-w-xl text-base sm:text-lg text-[#424656] leading-relaxed">
              Web premium, agentes de búsqueda sobre tus documentos, cursos con IA,
              auditoría de procesos y funnels para creadores. Todo con una sola firma:
              <span className="text-[#191C1E] font-semibold"> evidencia, no promesas.</span>
            </p>
            <div data-reveal className="reveal reveal--3 mt-9 flex flex-col sm:flex-row gap-4">
              <a href="#contacto" className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0066FF] px-7 py-3.5 text-base font-semibold text-white shadow-[0_16px_40px_-12px_rgba(0,102,255,0.8)] hover:bg-[#0052cc] transition-all">
                Solicitar diagnóstico gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#servicios" className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-7 py-3.5 text-base font-medium text-[#191C1E] hover:border-[#0066FF]/40 hover:text-[#0066FF] transition-all">
                Ver servicios
              </a>
            </div>
            <div data-reveal className="reveal reveal--4 mt-10 flex items-center gap-6 text-sm text-[#424656]">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-4 h-4 fill-[#7C3AED] text-[#7C3AED]" />)}
              </div>
              <span>Equipos que aprenden <span className="font-semibold text-[#191C1E]">de verdad</span></span>
            </div>
          </div>

          {/* Constelación de capacidades (reacciona al mouse vía parallax) */}
          <div data-reveal className="reveal reveal--3 relative">
            <div className="gradient-ring parallax-card rounded-[2.1rem] p-px">
              <div className="constellation relative aspect-square overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_120px_-40px_rgba(2,12,40,0.35)]">
                {/* fondo sutil */}
                <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 50% 46%, rgba(124,58,237,0.08), transparent 70%)" }} />
                <div aria-hidden className="grid-faint opacity-50" />

                {/* anillos giratorios */}
                <div aria-hidden className="orbit-ring absolute left-1/2 top-1/2 h-[80%] w-[80%] rounded-full border border-dashed border-black/[0.07]" />
                <div aria-hidden className="orbit-ring-rev absolute left-1/2 top-1/2 h-[54%] w-[54%] rounded-full border border-black/[0.05]" />

                {/* líneas conectoras */}
                <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id="cline" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0066FF" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.12" />
                    </linearGradient>
                  </defs>
                  {NODES.map((n) => (
                    <line key={n.label} x1="50" y1="50" x2={n.x} y2={n.y} stroke="url(#cline)" strokeWidth={1.4} vectorEffect="non-scaling-stroke" strokeDasharray="3 4" className="cline" />
                  ))}
                </svg>

                {/* nodos de servicios */}
                {NODES.map((n, idx) => {
                  const tt = tone[n.tone]; const NIcon = n.icon;
                  return (
                    <div key={n.label} className="node absolute" style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${idx * 0.45}s` }}>
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-1 ring-black/[0.06] shadow-[0_14px_30px_-12px_rgba(2,12,40,0.45)]" style={{ color: tt.c }}>
                          <NIcon className="h-5 w-5" />
                        </span>
                        <span className="rounded-md bg-white/85 px-1.5 text-[11px] font-semibold text-[#191C1E] backdrop-blur-sm">{n.label}</span>
                      </div>
                    </div>
                  );
                })}

                {/* núcleo */}
                <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
                  <span aria-hidden className="core-ping absolute inset-0 rounded-full" />
                  <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full text-white ring-4 ring-white shadow-[0_22px_55px_-12px_rgba(0,102,255,0.65)]" style={{ background: "conic-gradient(from 140deg, #0066FF, #7C3AED, #4F7DFF, #0066FF)" }}>
                    <span className="font-headline text-lg font-extrabold leading-none">Cursia</span>
                    <span className="mt-0.5 text-[9px] font-medium opacity-80">núcleo IA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee de capacidades ── */}
      <div className="relative z-10 border-y border-black/[0.05] bg-white/60 backdrop-blur-sm py-4 overflow-hidden">
        <div className="marquee flex gap-8 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.18em] text-[#424656]">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8">
              {["Diseño cinematográfico", "Evaluación con IA", "Detección de fraude", "Auditoría de procesos", "Funnels de conversión", "Web premium", "Cursos a medida", "Reportes estratégicos"].map((t) => (
                <span key={t} className="flex items-center gap-2.5"><Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" /> {t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICIOS (slider de tarjetas oscuras) ── */}
      <section id="servicios" className="relative z-10 px-6 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div data-reveal className="reveal flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED]">Servicios</span>
              <h2 className="font-headline font-extrabold tracking-tight mt-4 text-[clamp(2rem,5vw,3.4rem)] leading-[1.05]">
                Cinco formas de llevar tu operación <span className="grad-text">al siguiente nivel.</span>
              </h2>
            </div>
          </div>

          <div className="svc3d mt-14 select-none">
            <div
              className="relative mx-auto h-[500px]"
              style={{ perspective: "2000px" }}
              onPointerDown={onSvcPointerDown}
              onPointerUp={onSvcPointerUp}
              onPointerLeave={onSvcPointerUp}
            >
              <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                {SERVICES.map((s, i) => {
                  const t = tone[s.tone]; const Icon = s.icon;
                  let d = i - activeSvc;
                  if (d > SERVICES.length / 2) d -= SERVICES.length;
                  if (d < -SERVICES.length / 2) d += SERVICES.length;
                  const ad = Math.abs(d);
                  const isActive = d === 0;
                  const hidden = ad > 2;
                  return (
                    <div
                      key={s.slug}
                      onMouseMove={onCardMouseMove}
                      className={`svc-card spotlight-card group absolute left-1/2 top-0 flex h-[480px] w-[330px] flex-col overflow-hidden rounded-[26px] border ${isActive ? "cursor-default" : "cursor-pointer"}`}
                      style={{
                        background: `radial-gradient(130% 90% at 100% 0%, ${t.tint}, transparent 50%), linear-gradient(168deg, #070B15 0%, #03050B 100%)`,
                        ["--spot" as string]: t.soft,
                        ["--glow" as string]: t.soft,
                        transform: `translateX(-50%) translateX(${d * 236}px) translateZ(${-ad * 240}px) rotateY(${-d * 27}deg) scale(${1 - ad * 0.05})`,
                        zIndex: 50 - ad,
                        opacity: hidden ? 0 : 1 - ad * 0.12,
                        pointerEvents: hidden ? "none" : "auto",
                        borderColor: isActive ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
                        boxShadow: isActive ? `0 60px 130px -50px ${t.soft}` : "0 40px 90px -55px rgba(0,0,0,0.75)",
                        transition: "transform .65s cubic-bezier(.16,1,.3,1), opacity .55s ease, box-shadow .55s ease, border-color .55s ease",
                      }}
                    >
                      {/* spine de color superior */}
                      <div aria-hidden className="svc-spine absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${t.c}, ${t.c2}, transparent)`, backgroundSize: "200% 100%" }} />
                      {/* número fantasma */}
                      <span aria-hidden className="absolute right-5 top-3 font-headline text-[76px] font-black leading-none text-white/[0.05] select-none">{s.n}</span>
                      {/* icono marca de agua */}
                      <Icon aria-hidden className="absolute -right-7 -bottom-7 h-44 w-44 text-white/[0.03]" strokeWidth={1.25} />
                      {/* glow de color tras el icono */}
                      <div aria-hidden className="svc-glow absolute -left-12 -top-12 h-44 w-44 rounded-full blur-[60px]" style={{ background: t.soft }} />

                      <div className="relative flex flex-1 flex-col p-6">
                        {/* chip de icono */}
                        <div
                          className="flex shrink-0 items-center justify-center rounded-2xl text-white ring-1 ring-white/15 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                          style={{ height: 52, width: 52, background: `linear-gradient(135deg, ${t.c}, ${t.c2})`, boxShadow: `0 16px 34px -10px ${t.soft}` }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        <span className="mt-5 block text-[10.5px] font-bold uppercase tracking-[0.22em]" style={{ color: t.c2 }}>{s.category}</span>
                        <h3 className="font-headline text-[20px] font-extrabold text-white mt-1.5 leading-[1.15]">{s.title}</h3>
                        <p className="mt-2.5 text-[13px] text-slate-400 leading-relaxed">{s.lead}</p>

                        <div aria-hidden className="my-4 h-px w-full bg-white/[0.08]" />

                        <ul className="space-y-2.5">
                          {s.includes.slice(0, 3).map((b) => (
                            <li key={b} className="flex items-center gap-2.5 text-[12.5px] text-slate-300">
                              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full" style={{ background: t.tint }}>
                                <Check className="h-2.5 w-2.5" style={{ color: t.c2 }} strokeWidth={3} />
                              </span>
                              {b}
                            </li>
                          ))}
                        </ul>

                        {/* botón / CTA */}
                        <div className="relative mt-auto pt-5">
                          {isActive ? (
                            <Link href={`/servicios/${s.slug}`} className="relative block overflow-hidden rounded-xl">
                              <span aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${t.c}, ${t.c2})` }} />
                              <span className="relative flex items-center justify-between rounded-xl border border-white/15 px-4 py-3 text-[13px] font-semibold text-white transition-colors duration-300 group-hover:border-transparent">
                                Conocer servicio
                                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </span>
                            </Link>
                          ) : (
                            <span className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-[13px] font-semibold text-white/60">
                              Conocer servicio
                              <ArrowUpRight className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controles manuales */}
            <div className="mt-10 flex items-center justify-center gap-5">
              <button onClick={() => goSvc(-1)} aria-label="Anterior" className="flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#191C1E] hover:border-[#0066FF]/40 hover:text-[#0066FF] transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {SERVICES.map((s, i) => (
                  <button
                    key={s.slug}
                    onClick={() => setActiveSvc(i)}
                    aria-label={`Ir a ${s.title}`}
                    className={`h-2 rounded-full transition-all duration-300 ${i === activeSvc ? "w-7 bg-[#0066FF]" : "w-2 bg-black/15 hover:bg-black/30"}`}
                  />
                ))}
              </div>
              <button onClick={() => goSvc(1)} aria-label="Siguiente" className="flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#191C1E] hover:border-[#0066FF]/40 hover:text-[#0066FF] transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section id="proceso" className="relative z-10 px-6 py-24 bg-[#F7F9FB] border-y border-black/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div data-reveal className="reveal text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED]">Proceso</span>
            <h2 className="font-headline font-extrabold tracking-tight mt-4 text-[clamp(1.9rem,5vw,3rem)] leading-[1.05]">
              Del diagnóstico <span className="grad-text">a la evidencia.</span>
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-3 gap-5">
            {[
              { n: "01", t: "Diagnóstico", d: "Analizamos tu necesidad y definimos el alcance exacto. Sin costo." },
              { n: "02", t: "Construcción", d: "Diseñamos y desarrollamos a tu medida, con IA y estándares premium." },
              { n: "03", t: "Evidencia", d: "Entregamos resultados medibles y reportes claros para decidir." },
            ].map((p) => (
              <div key={p.n} data-reveal className="reveal rounded-3xl border border-black/[0.06] bg-white p-7 shadow-[0_20px_60px_-40px_rgba(2,12,40,0.3)]">
                <span className="font-headline text-3xl font-extrabold grad-text">{p.n}</span>
                <h3 className="font-headline font-bold text-lg mt-3">{p.t}</h3>
                <p className="text-sm text-[#424656] mt-1.5 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEÑAS (slider) ── */}
      <section id="resenas" className="relative z-10 px-6 pt-24 sm:pt-28 pb-10">
        <div className="max-w-6xl mx-auto">
          <div data-reveal className="reveal flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED]">Reseñas</span>
              <h2 className="font-headline font-extrabold tracking-tight mt-4 text-[clamp(2rem,5vw,3.2rem)] leading-[1.05]">
                Lo que dicen <span className="grad-text">los equipos.</span>
              </h2>
              <p className="mt-3 text-xs text-[#424656]/70 italic">* Reseñas de ejemplo — reemplazar por testimonios reales.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => slide(reviewsRail, -1)} aria-label="Anterior" className="flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#191C1E] hover:border-[#0066FF]/40 hover:text-[#0066FF] transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => slide(reviewsRail, 1)} aria-label="Siguiente" className="flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#191C1E] hover:border-[#0066FF]/40 hover:text-[#0066FF] transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={reviewsRail} className="rail mt-12 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {REVIEWS.map((r, i) => (
              <figure
                key={i}
                onMouseMove={onCardMouseMove}
                className="review-card spotlight-card group relative shrink-0 snap-start w-[85%] sm:w-[360px] overflow-hidden rounded-3xl border border-[#7C3AED]/15 p-7 shadow-[0_30px_70px_-38px_rgba(124,58,237,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_44px_100px_-44px_rgba(124,58,237,0.6)] hover:border-[#7C3AED]/30"
                style={{ background: "linear-gradient(160deg, #FFFFFF 0%, #F4F1FF 100%)", ["--spot" as string]: "rgba(124,58,237,0.16)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#7C3AED] text-white shadow-[0_12px_26px_-10px_rgba(124,58,237,0.7)]">
                    <Quote className="w-5 h-5" />
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-[#7C3AED] text-[#7C3AED]" />)}
                  </div>
                </div>
                <blockquote className="mt-5 text-[15px] text-[#191C1E] leading-relaxed">{r.quote}</blockquote>
                <figcaption className="mt-5 pt-5 border-t border-[#7C3AED]/10">
                  <div className="font-semibold text-sm text-[#191C1E]">{r.role}</div>
                  <div className="text-xs text-[#424656]">{r.org}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / CONTACTO (claro, coherente con el resto) ── */}
      <section id="contacto" className="relative z-10 px-6 pt-8 pb-24">
        <div data-reveal className="reveal relative max-w-4xl mx-auto rounded-[2.5rem] border border-black/[0.06] bg-white p-10 sm:p-16 text-center shadow-[0_40px_120px_-50px_rgba(2,12,40,0.3)] overflow-hidden">
          <div aria-hidden className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[36rem] max-w-full rounded-full bg-gradient-to-r from-[#0066FF]/15 to-[#7C3AED]/15 blur-3xl" />
          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED]">Empecemos</span>
            <h2 className="font-headline font-extrabold tracking-tight mt-4 text-[clamp(1.9rem,5vw,3.2rem)] leading-[1.06]">
              Conversemos sobre <span className="grad-text">tu próximo proyecto.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-[#424656]">
              Diagnóstico inicial sin costo. Te mostramos exactamente qué podemos construir contigo.
            </p>
            <div className="mt-9 flex justify-center">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-[#0066FF] px-8 py-4 text-base font-semibold text-white shadow-[0_16px_40px_-12px_rgba(0,102,255,0.7)] hover:bg-[#0052cc] transition-all">
                Solicitar diagnóstico gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <footer className="max-w-4xl mx-auto mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#424656]">
          <span className="font-headline font-extrabold text-base text-[#191C1E]">Curs<span className="text-[#0066FF]">ia</span></span>
          <span>© {new Date().getFullYear()} Cursia · Inteligencia que construye.</span>
        </footer>
      </section>
    </div>
  );
}

/* ── MouseField: campo de puntos interactivo (canvas) ─────────────────────── */
function MouseField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    if (!ctx || !parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const GAP = 30;
    const R = 160;
    let width = 0, height = 0;
    let dots: { x: number; y: number }[] = [];
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const build = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP; y < height; y += GAP)
        for (let x = GAP; x < width; x += GAP) dots.push({ x, y });
    };
    build();

    const ro = new ResizeObserver(build);
    ro.observe(parent);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    };
    const onLeave = () => { mouse.tx = -9999; mouse.ty = -9999; };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);

    let raf = 0;
    const frame = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.15;
      mouse.y += (mouse.ty - mouse.y) * 0.15;
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        let ox = 0, oy = 0, size = 1.1, alpha = 0.16, mix = 0;
        if (dist < R) {
          const f = 1 - dist / R;
          const ang = Math.atan2(dy, dx);
          const push = f * 22;
          ox = Math.cos(ang) * push;
          oy = Math.sin(ang) * push;
          size = 1.1 + f * 2.6;
          alpha = 0.16 + f * 0.7;
          mix = f;
        }
        const rr = Math.round(0 + (124 - 0) * mix);
        const gg = Math.round(102 + (58 - 102) * mix);
        const bb = Math.round(255 + (237 - 255) * mix);
        ctx.beginPath();
        ctx.arc(d.x + ox, d.y + oy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);
  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 z-0 h-full w-full pointer-events-none" />;
}

/* ── Estilos ──────────────────────────────────────────────────────────────── */
function StyleBlock() {
  return (
    <style>{`
      .cursia-root .reveal { opacity: 0; transform: translateY(26px); transition: opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1); }
      .cursia-root .reveal.is-visible { opacity: 1; transform: translateY(0); }
      .cursia-root .reveal--1.is-visible { transition-delay: .06s; }
      .cursia-root .reveal--2.is-visible { transition-delay: .12s; }
      .cursia-root .reveal--3.is-visible { transition-delay: .18s; }
      .cursia-root .reveal--4.is-visible { transition-delay: .24s; }

      .cursia-root .grad-text {
        display: inline-block;
        background: linear-gradient(95deg, #0066FF 0%, #4F7DFF 45%, #7C3AED 100%);
        background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent;
        line-height: 1.18; padding-bottom: 0.12em; padding-right: 0.04em;
        animation: gradShift 8s ease infinite;
      }
      @keyframes gradShift { 0%,100% { background-position: 0% center; } 50% { background-position: 100% center; } }

      .cursia-root .aura { position: absolute; border-radius: 50%; filter: blur(110px); opacity: .55; }
      .cursia-root .aura--blue { width: 46vw; height: 46vw; top: -14vw; right: -8vw; background: radial-gradient(circle, rgba(0,102,255,.22), transparent 70%); }
      .cursia-root .aura--violet { width: 42vw; height: 42vw; bottom: -16vw; left: -10vw; background: radial-gradient(circle, rgba(124,58,237,.18), transparent 70%); }
      .cursia-root .grid-faint {
        position: absolute; inset: 0;
        background-image: linear-gradient(rgba(2,12,40,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(2,12,40,.04) 1px, transparent 1px);
        background-size: 56px 56px;
        mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 20%, transparent 75%);
        -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 20%, transparent 75%);
      }

      .cursia-root .hero { --px: 0; --py: 0; }
      .cursia-root .parallax-card { transform: translate3d(calc(var(--px) * -16px), calc(var(--py) * -16px), 0) rotateX(calc(var(--py) * 3deg)) rotateY(calc(var(--px) * -3deg)); transition: transform .25s ease-out; will-change: transform; }

      .cursia-root .gradient-ring { background: conic-gradient(from 140deg, #0066FF, #7C3AED, #4F7DFF, #0066FF); }

      .cursia-root .spotlight-card { --cx: 50%; --cy: 50%; --spot: rgba(0,102,255,0.12); }
      .cursia-root .spotlight-card::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0;
        background: radial-gradient(340px circle at var(--cx) var(--cy), var(--spot), transparent 65%); transition: opacity .3s ease; z-index: 1; }
      .cursia-root .spotlight-card:hover::before { opacity: 1; }
      .cursia-root .spotlight-card > *:not([aria-hidden]) { position: relative; z-index: 2; }

      .cursia-root .marquee { animation: marquee 36s linear infinite; }
      @keyframes marquee { to { transform: translateX(-50%); } }

      .cursia-root .svc3d { touch-action: pan-y; }

      /* Constelación del hero */
      .cursia-root .orbit-ring { transform: translate(-50%,-50%); animation: orbitSpin 70s linear infinite; }
      .cursia-root .orbit-ring-rev { transform: translate(-50%,-50%); animation: orbitSpin 55s linear infinite reverse; }
      @keyframes orbitSpin { from { transform: translate(-50%,-50%) rotate(0); } to { transform: translate(-50%,-50%) rotate(360deg); } }
      .cursia-root .node { transform: translate(-50%,-50%); animation: nodeFloat 5.5s ease-in-out infinite; will-change: transform; }
      @keyframes nodeFloat { 0%,100% { transform: translate(-50%,-50%); } 50% { transform: translate(-50%, calc(-50% - 8px)); } }
      .cursia-root .cline { animation: clineDash 1.6s linear infinite; }
      @keyframes clineDash { to { stroke-dashoffset: -7; } }
      .cursia-root .core-ping { background: radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%); animation: corePulse 3.2s ease-in-out infinite; }
      @keyframes corePulse { 0% { transform: scale(.9); opacity: .6; } 70%,100% { transform: scale(1.7); opacity: 0; } }

      .cursia-root .svc-spine { animation: spineShift 5.5s linear infinite; }
      @keyframes spineShift { to { background-position: 200% 0; } }

      .cursia-root .svc-glow { opacity: .45; animation: glowPulse 5s ease-in-out infinite; }
      .cursia-root .svc-card:hover .svc-glow { opacity: .85; }
      @keyframes glowPulse { 0%,100% { opacity: .4; transform: scale(1); } 50% { opacity: .72; transform: scale(1.14); } }

      .cursia-root .rail { scrollbar-width: none; -ms-overflow-style: none; }
      .cursia-root .rail::-webkit-scrollbar { display: none; }

      @media (prefers-reduced-motion: reduce) {
        .cursia-root .reveal { opacity: 1; transform: none; }
        .cursia-root .parallax-card, .cursia-root .marquee, .cursia-root .grad-text,
        .cursia-root .svc-spine, .cursia-root .svc-glow,
        .cursia-root .orbit-ring, .cursia-root .orbit-ring-rev, .cursia-root .node,
        .cursia-root .cline, .cursia-root .core-ping { animation: none !important; }
      }
    `}</style>
  );
}
