export type BrandLogoTone = "primary" | "secondary" | "accent"

export interface BrandLogoMeta {
  src: string
  alt: string
  fallback: string
  tone?: BrandLogoTone
}

export const brandLogos = {
  xbox: { src: "/logos/xbox.svg", alt: "Logotipo de Xbox", fallback: "X", tone: "secondary" },
  playstation: { src: "/logos/playstation.svg", alt: "Logotipo de PlayStation", fallback: "PS", tone: "secondary" },
  nintendo: { src: "/logos/nintendo.svg", alt: "Logotipo de Nintendo", fallback: "N", tone: "secondary" },
  spotify: { src: "/logos/spotify.svg", alt: "Logotipo de Spotify", fallback: "S", tone: "secondary" },
  netflix: { src: "/logos/netflix.svg", alt: "Logotipo de Netflix", fallback: "N", tone: "secondary" },
  amazon: { src: "/logos/amazon.svg", alt: "Logotipo de Amazon", fallback: "A", tone: "secondary" },
  steam: { src: "/logos/steam.svg", alt: "Logotipo de Steam", fallback: "St", tone: "secondary" },
  "google-play": { src: "/logos/google-play.svg", alt: "Logotipo de Google Play", fallback: "G", tone: "secondary" },
  telcel: { src: "/logos/telcel.svg", alt: "Logotipo de Telcel", fallback: "T", tone: "secondary" },
  att: { src: "/logos/att.svg", alt: "Logotipo de AT&T", fallback: "AT", tone: "secondary" },
  movistar: { src: "/logos/movistar.svg", alt: "Logotipo de Movistar", fallback: "M", tone: "secondary" },
  unefon: { src: "/logos/unefon.svg", alt: "Logotipo de Unefon", fallback: "U", tone: "secondary" },
  cfe: { src: "/logos/cfe.svg", alt: "Logotipo de CFE", fallback: "CFE", tone: "primary" },
  jmas: { src: "/logos/jmas.svg", alt: "Logotipo de JMAS", fallback: "JMAS", tone: "primary" },
  cespe: { src: "/logos/cespe.svg", alt: "Logotipo de CESPE", fallback: "CESPE", tone: "primary" },
  siapa: { src: "/logos/siapa.svg", alt: "Logotipo de SIAPA", fallback: "SIAPA", tone: "primary" },
  sky: { src: "/logos/sky.svg", alt: "Logotipo de SKY", fallback: "SKY", tone: "primary" },
  dish: { src: "/logos/dish.svg", alt: "Logotipo de Dish", fallback: "Dish", tone: "primary" },
  izzi: { src: "/logos/izzi.svg", alt: "Logotipo de Izzi", fallback: "Izzi", tone: "primary" },
  totalplay: { src: "/logos/totalplay.svg", alt: "Logotipo de TotalPlay", fallback: "TP", tone: "primary" },
  telmex: { src: "/logos/telmex.svg", alt: "Logotipo de Telmex", fallback: "Telmex", tone: "primary" },
  megacable: { src: "/logos/megacable.svg", alt: "Logotipo de Megacable", fallback: "Mega", tone: "primary" },
  "tag-iave": { src: "/logos/tag-iave.svg", alt: "Logotipo de TAG IAVE", fallback: "IAVE", tone: "primary" },
  pase: { src: "/logos/pase.svg", alt: "Logotipo de PASE", fallback: "PASE", tone: "primary" },
  televia: { src: "/logos/televia.svg", alt: "Logotipo de TeleVia", fallback: "TV", tone: "primary" },
  gnp: { src: "/logos/gnp.svg", alt: "Logotipo de GNP", fallback: "GNP", tone: "primary" },
  axa: { src: "/logos/axa.svg", alt: "Logotipo de AXA", fallback: "AXA", tone: "primary" },
  qualitas: { src: "/logos/qualitas.svg", alt: "Logotipo de Qualitas", fallback: "Q", tone: "primary" },
} as const satisfies Record<string, BrandLogoMeta>

export type BrandLogoKey = keyof typeof brandLogos
