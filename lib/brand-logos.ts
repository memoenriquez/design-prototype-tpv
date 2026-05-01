export type BrandLogoTone = "primary" | "secondary" | "accent"

export interface BrandLogoMeta {
  src: string
  alt: string
  fallback: string
  tone?: BrandLogoTone
}

export const brandLogos = {
  xbox: { src: "/logos/xbox.svg", alt: "Xbox logo", fallback: "X", tone: "secondary" },
  playstation: { src: "/logos/playstation.svg", alt: "PlayStation logo", fallback: "PS", tone: "secondary" },
  nintendo: { src: "/logos/nintendo.svg", alt: "Nintendo logo", fallback: "N", tone: "secondary" },
  spotify: { src: "/logos/spotify.svg", alt: "Spotify logo", fallback: "S", tone: "secondary" },
  netflix: { src: "/logos/netflix.svg", alt: "Netflix logo", fallback: "N", tone: "secondary" },
  amazon: { src: "/logos/amazon.svg", alt: "Amazon logo", fallback: "A", tone: "secondary" },
  steam: { src: "/logos/steam.svg", alt: "Steam logo", fallback: "St", tone: "secondary" },
  "google-play": { src: "/logos/google-play.svg", alt: "Google Play logo", fallback: "G", tone: "secondary" },
  telcel: { src: "/logos/telcel.svg", alt: "Telcel logo", fallback: "T", tone: "secondary" },
  att: { src: "/logos/att.svg", alt: "AT&T logo", fallback: "AT", tone: "secondary" },
  movistar: { src: "/logos/movistar.svg", alt: "Movistar logo", fallback: "M", tone: "secondary" },
  unefon: { src: "/logos/unefon.svg", alt: "Unefon logo", fallback: "U", tone: "secondary" },
  cfe: { src: "/logos/cfe.svg", alt: "CFE logo", fallback: "CFE", tone: "primary" },
  jmas: { src: "/logos/jmas.svg", alt: "JMAS logo", fallback: "JMAS", tone: "primary" },
  cespe: { src: "/logos/cespe.svg", alt: "CESPE logo", fallback: "CESPE", tone: "primary" },
  siapa: { src: "/logos/siapa.svg", alt: "SIAPA logo", fallback: "SIAPA", tone: "primary" },
  sky: { src: "/logos/sky.svg", alt: "SKY logo", fallback: "SKY", tone: "primary" },
  dish: { src: "/logos/dish.svg", alt: "Dish logo", fallback: "Dish", tone: "primary" },
  izzi: { src: "/logos/izzi.svg", alt: "Izzi logo", fallback: "Izzi", tone: "primary" },
  totalplay: { src: "/logos/totalplay.svg", alt: "TotalPlay logo", fallback: "TP", tone: "primary" },
  telmex: { src: "/logos/telmex.svg", alt: "Telmex logo", fallback: "Telmex", tone: "primary" },
  megacable: { src: "/logos/megacable.svg", alt: "Megacable logo", fallback: "Mega", tone: "primary" },
  "tag-iave": { src: "/logos/tag-iave.svg", alt: "TAG IAVE logo", fallback: "IAVE", tone: "primary" },
  pase: { src: "/logos/pase.svg", alt: "PASE logo", fallback: "PASE", tone: "primary" },
  televia: { src: "/logos/televia.svg", alt: "TeleVia logo", fallback: "TV", tone: "primary" },
  gnp: { src: "/logos/gnp.svg", alt: "GNP logo", fallback: "GNP", tone: "primary" },
  axa: { src: "/logos/axa.svg", alt: "AXA logo", fallback: "AXA", tone: "primary" },
  qualitas: { src: "/logos/qualitas.svg", alt: "Qualitas logo", fallback: "Q", tone: "primary" },
} as const satisfies Record<string, BrandLogoMeta>

export type BrandLogoKey = keyof typeof brandLogos
