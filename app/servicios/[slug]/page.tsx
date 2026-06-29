"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { getService, SERVICES, tone, WHATSAPP_URL } from "../../services";
import WhatsappFab from "../../_components/WhatsappFab";

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const service = slug ? getService(slug) : undefined;

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 text-center px-6 font-body">
        <h1 className="font-headline text-3xl font-extrabold text-[#191C1E]">Servicio no encontrado</h1>
        <Link href="/#servicios" className="inline-flex items-center gap-2 rounded-full bg-[#0066FF] px-6 py-3 text-white font-semibold">
          <ArrowLeft className="w-4 h-4" /> Volver a servicios
        </Link>
      </div>
    );
  }

  const t = tone[service.tone];
  const Icon = service.icon;
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <div className="cursia-detail min-h-screen bg-white text-[#191C1E] antialiased font-body overflow-x-hidden">
      <StyleBlock />
      <WhatsappFab />

      {/* glow de fondo con el color del servicio */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[18vw] right-[-10vw] h-[46vw] w-[46vw] rounded-full blur-[120px] opacity-50" style={{ background: `radial-gradient(circle, ${t.soft}, transparent 70%)` }} />
      </div>

      {/* Nav simple */}
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
        <nav className="flex items-center gap-6 rounded-full border border-black/[0.05] bg-white/80 backdrop-blur-xl px-6 py-2.5 shadow-[0_10px_40px_-18px_rgba(2,12,40,0.35)]">
          <Link href="/" className="font-headline font-extrabold text-lg tracking-tight">Curs<span className="text-[#0066FF]">ia</span></Link>
          <Link href="/#servicios" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#424656] hover:text-[#0066FF] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Todos los servicios
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#0066FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0052cc] transition-all">
            Hablemos <ArrowRight className="w-4 h-4" />
          </a>
        </nav>
      </header>

      {/* Hero del servicio */}
      <section className="relative z-10 px-6 pt-36 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="reveal-d inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: t.c }}>
            <span className="font-headline">Servicio {service.n}</span>
          </div>
          <div className="reveal-d mt-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${t.c}, ${t.c2})`, boxShadow: `0 18px 40px -12px ${t.soft}` }}>
            <Icon className="w-8 h-8" />
          </div>
          <h1 className="reveal-d font-headline font-extrabold tracking-tight mt-6 text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
            {service.title}
          </h1>
          <p className="reveal-d mt-5 text-lg sm:text-xl font-semibold" style={{ color: t.c }}>{service.lead}</p>
          <div className="reveal-d mt-8 flex flex-col sm:flex-row gap-4">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white transition-transform hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${t.c}, ${t.c2})` }}>
              Solicitar este servicio <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/#servicios" className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-7 py-3.5 text-base font-medium text-[#191C1E] hover:border-black/20 transition-all">
              <ArrowLeft className="w-4 h-4" /> Ver otros servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Descripción + qué incluye */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-14">
          <div className="reveal-d space-y-5">
            {service.long.map((p, i) => (
              <p key={i} className="text-base sm:text-lg text-[#424656] leading-relaxed">{p}</p>
            ))}
            <div className="mt-8 rounded-3xl p-6 sm:p-7" style={{ background: t.tint }}>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider" style={{ color: t.c }}>
                <Sparkles className="w-4 h-4" /> Resultado
              </div>
              <p className="font-headline text-xl sm:text-2xl font-extrabold mt-2">{service.outcome}</p>
            </div>
          </div>

          <aside className="reveal-d">
            <div className="rounded-3xl border border-black/[0.06] bg-white p-7 shadow-[0_24px_70px_-44px_rgba(2,12,40,0.3)]">
              <h2 className="font-headline font-bold text-lg">Qué incluye</h2>
              <ul className="mt-5 space-y-3.5">
                {service.includes.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-[#191C1E]">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: t.c }} /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Proceso */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="reveal-d font-headline font-extrabold tracking-tight text-[clamp(1.6rem,4vw,2.4rem)]">Cómo lo entregamos</h2>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { n: "01", t: "Diagnóstico", d: "Entendemos tu necesidad y definimos el alcance. Sin costo." },
              { n: "02", t: "Construcción", d: "Lo desarrollamos a tu medida con estándares premium." },
              { n: "03", t: "Evidencia", d: "Entregamos resultados medibles y claros." },
            ].map((p) => (
              <div key={p.n} className="reveal-d rounded-2xl border border-black/[0.06] bg-white p-6">
                <span className="font-headline text-2xl font-extrabold" style={{ color: t.c }}>{p.n}</span>
                <h3 className="font-headline font-bold mt-2">{p.t}</h3>
                <p className="text-sm text-[#424656] mt-1">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-16">
        <div className="reveal-d relative max-w-4xl mx-auto rounded-[2.5rem] border border-black/[0.06] bg-white p-10 sm:p-14 text-center shadow-[0_40px_120px_-50px_rgba(2,12,40,0.3)] overflow-hidden">
          <div aria-hidden className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[36rem] max-w-full rounded-full blur-3xl opacity-60" style={{ background: `radial-gradient(circle, ${t.soft}, transparent 70%)` }} />
          <div className="relative">
            <h2 className="font-headline font-extrabold tracking-tight text-[clamp(1.7rem,4.5vw,2.8rem)] leading-[1.06]">
              ¿Listo para <span style={{ color: t.c }}>empezar</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-[#424656]">Diagnóstico inicial sin costo. Te mostramos exactamente qué podemos construir contigo.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-transform hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${t.c}, ${t.c2})` }}>
              Solicitar diagnóstico gratis <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Otros servicios */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-headline font-bold text-lg text-[#424656]">Otros servicios</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {others.map((s) => {
              const ot = tone[s.tone]; const OIcon = s.icon;
              return (
                <Link key={s.slug} href={`/servicios/${s.slug}`} className="group rounded-2xl border border-black/[0.06] bg-white p-5 hover:-translate-y-1 transition-all shadow-[0_18px_50px_-40px_rgba(2,12,40,0.3)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${ot.c}, ${ot.c2})` }}>
                    <OIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-headline font-bold text-sm mt-4 leading-snug">{s.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: ot.c }}>
                    Ver <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#424656]">
        <Link href="/" className="font-headline font-extrabold text-base text-[#191C1E]">Curs<span className="text-[#0066FF]">ia</span></Link>
        <span>© {new Date().getFullYear()} Cursia · Inteligencia que construye.</span>
      </footer>
    </div>
  );
}

function StyleBlock() {
  return (
    <style>{`
      .cursia-detail .reveal-d { opacity: 0; transform: translateY(20px); animation: riseD .8s cubic-bezier(.16,1,.3,1) forwards; }
      .cursia-detail .reveal-d:nth-child(2) { animation-delay: .05s; }
      .cursia-detail .reveal-d:nth-child(3) { animation-delay: .1s; }
      @keyframes riseD { to { opacity: 1; transform: translateY(0); } }
      @media (prefers-reduced-motion: reduce) { .cursia-detail .reveal-d { opacity: 1; transform: none; animation: none; } }
    `}</style>
  );
}
