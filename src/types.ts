/**
 * TypeScript contract for `public/portfolio-template.json`.
 *
 * Owned by ticket 00 (spec/00-data-contract-types-json.md).
 * Keys with hyphens mirror the JSON keys exactly; access them with
 * bracket notation (e.g. `intro['bullet-points']`).
 */

export interface Intro {
  header: string;
  sub: string;
  body: string;
  "bullet-points": string[];
}

export interface TechItem {
  name: string;
  "img-src": string;
  link: string;
}

export interface WorkExperience {
  /** Stable slug for the entry (e.g. "streamline"); also used for asset paths. */
  id: string;
  logo: string;
  /** Optional product/company website; renders the name as an external link. */
  link?: string;
  role: string;
  dates: string;
  intro?: string;
  description: string;
  "product-features": string[];
  "personal-experience": string[];
  gallery: string[];
}

export interface QA {
  q: string;
  a: string;
}

export interface SocialLink {
  icon: string;
  link: string;
}

/**
 * Keys are social slugs (e.g. "linked-in", "github", "ai-knowledge-base");
 * new entries are plug-and-play.
 */
export type SocialsMap = Record<string, SocialLink>;

export interface PortfolioData {
  intro: Intro;
  "tech-stack": TechItem[];
  "work-experience": WorkExperience[];
  questions: QA[];
  socials: SocialsMap;
}
