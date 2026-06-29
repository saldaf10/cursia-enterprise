/**
 * Datos compartidos de servicios (landing + páginas de detalle).
 * Cada servicio tiene su slug, color diferenciador y contenido extendido.
 */
import type { LucideIcon } from "lucide-react";
import { Globe, GraduationCap, Workflow, Megaphone, Code2 } from "lucide-react";

export type Tone = "blue" | "violet" | "green" | "cyan" | "pink";

export const tone: Record<Tone, { c: string; c2: string; tint: string; soft: string }> = {
  blue:   { c: "#0066FF", c2: "#5B8DEF", tint: "rgba(0,102,255,0.08)",  soft: "rgba(0,102,255,0.18)" },
  violet: { c: "#7C3AED", c2: "#A855F7", tint: "rgba(124,58,237,0.08)", soft: "rgba(124,58,237,0.18)" },
  green:  { c: "#06A66B", c2: "#34D399", tint: "rgba(6,166,107,0.10)",  soft: "rgba(6,166,107,0.18)" },
  cyan:   { c: "#0891B2", c2: "#22D3EE", tint: "rgba(8,145,178,0.09)",  soft: "rgba(8,145,178,0.18)" },
  pink:   { c: "#DB2777", c2: "#F472B6", tint: "rgba(219,39,119,0.08)", soft: "rgba(219,39,119,0.18)" },
};

export interface Service {
  slug: string;
  n: string;
  icon: LucideIcon;
  tone: Tone;
  category: string;
  title: string;
  teaser: string;
  lead: string;
  long: string[];
  includes: string[];
  outcome: string;
}

export const SERVICES: Service[] = [
  {
    slug: "desarrollo-web",
    n: "01",
    icon: Globe,
    tone: "blue",
    category: "Diseño & Web",
    title: "Desarrollo de páginas web",
    teaser: "Sitios cinematográficos que convierten.",
    lead: "Sitios que se sienten como una película y convierten como una máquina.",
    long: [
      "Diseñamos y desarrollamos páginas con estética cinematográfica, animaciones de scroll y un rendimiento medido en milisegundos. Cada sección está pensada para guiar a tu visitante hacia una acción concreta.",
      "No partimos de plantillas: construimos una identidad visual a tu medida, optimizada para que cargue rápido, posicione en buscadores y proyecte autoridad desde el primer scroll.",
    ],
    includes: [
      "Diseño UI/UX a medida",
      "Animaciones e interacciones premium",
      "Optimización Core Web Vitals y SEO",
      "Formularios y analítica de conversión",
      "Hosting, dominio y SSL",
    ],
    outcome: "Una web que vende por ti, 24/7.",
  },
  {
    slug: "cursos-ia",
    n: "02",
    icon: GraduationCap,
    tone: "green",
    category: "Formación con IA",
    title: "Cursos corporativos con IA",
    teaser: "Certifica conocimiento real, no memoria.",
    lead: "No certificamos memoria. Certificamos conocimiento real.",
    long: [
      "Creamos cursos a la medida desde tus propios manuales, con evaluaciones de preguntas abiertas calificadas por IA y detección de fraude.",
      "La gerencia recibe reportes estratégicos con las brechas reales del equipo y recomendaciones accionables — no solo un porcentaje de 'completado'.",
    ],
    includes: [
      "Cursos a medida desde tus manuales",
      "Evaluación con IA y preguntas abiertas",
      "Detección de fraude e integridad",
      "Reportes estratégicos para gerencia",
      "Certificación verificable",
    ],
    outcome: "Equipos que de verdad aprenden, con evidencia.",
  },
  {
    slug: "auditoria-procesos",
    n: "03",
    icon: Workflow,
    tone: "cyan",
    category: "Consultoría",
    title: "Auditoría y mejora de procesos",
    teaser: "Menos fricción, más resultados medibles.",
    lead: "Encontramos los cuellos de botella que te cuestan tiempo y dinero.",
    long: [
      "Miramos tu operación con lupa, mapeamos tus procesos y detectamos lo que frena a tu equipo.",
      "Te entregamos un plan claro y priorizado para optimizarlo, con indicadores medibles antes y después de la intervención.",
    ],
    includes: [
      "Mapeo y diagnóstico de procesos",
      "Identificación de cuellos de botella",
      "Plan de mejora priorizado",
      "Indicadores de impacto (antes/después)",
      "Acompañamiento en la implementación",
    ],
    outcome: "Más resultado con menos fricción.",
  },
  {
    slug: "funnels-creadores",
    n: "04",
    icon: Megaphone,
    tone: "pink",
    category: "Creadores",
    title: "Funnels y web para creadores",
    teaser: "Convierte tu audiencia en ingresos.",
    lead: "Convertimos tu audiencia en ingresos, con marca premium.",
    long: [
      "Para creadores de contenido que quieren monetizar de verdad: construimos tu embudo de principio a fin, tu página y tus cursos llave en mano.",
      "Te entregamos una marca premium lista para escalar, con todo conectado: captación, nutrición y venta.",
    ],
    includes: [
      "Estrategia de embudo a medida",
      "Landing y página de ventas",
      "Cursos / productos digitales llave en mano",
      "Automatizaciones y email",
      "Identidad de marca premium",
    ],
    outcome: "Una audiencia que se convierte en negocio.",
  },
  {
    slug: "desarrollos-personalizados",
    n: "05",
    icon: Code2,
    tone: "violet",
    category: "Software a medida",
    title: "Desarrollos personalizados",
    teaser: "Software hecho a la medida de tu operación.",
    lead: "Software a la medida exacta de cómo trabaja tu equipo.",
    long: [
      "Construimos herramientas internas, integraciones y automatizaciones que se ajustan a tu proceso real — no al revés. Desde paneles de gestión hasta conexiones entre tus sistemas.",
      "Cada desarrollo se piensa para escalar contigo, con código mantenible y una entrega documentada que tu equipo puede usar desde el primer día.",
    ],
    includes: [
      "Herramientas internas a medida",
      "Integraciones entre tus sistemas",
      "Automatización de tareas repetitivas",
      "Paneles y reportes en tiempo real",
      "Código documentado y escalable",
    ],
    outcome: "Tecnología que se adapta a ti, no al revés.",
  },
];

export const WHATSAPP_URL = "https://wa.me/573185529534";

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
