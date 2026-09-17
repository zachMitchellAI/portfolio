import type { PortfolioData } from "../types";

/**
 * Loads `public/portfolio-template.json` at runtime.
 *
 * Vite's `base` is `/portfolio/` (GitHub Pages), so the fetch path must be
 * built from `import.meta.env.BASE_URL` — a bare `/portfolio-template.json`
 * breaks on GitHub Pages.
 */

const REQUIRED_TOP_LEVEL_KEYS = [
  "intro",
  "tech-stack",
  "work-experience",
  "questions",
  "socials",
] as const;

type RequiredTopLevelKey = (typeof REQUIRED_TOP_LEVEL_KEYS)[number];

/** Minimal runtime check: required top-level keys must exist on the parsed JSON. */
function hasRequiredKeys(
  data: unknown,
): data is Record<RequiredTopLevelKey, unknown> {
  return (
    typeof data === "object" &&
    data !== null &&
    REQUIRED_TOP_LEVEL_KEYS.every((key) => key in data)
  );
}

export function portfolioTemplateUrl(): string {
  return `${import.meta.env.BASE_URL}portfolio-template.json`;
}

export async function loadPortfolio(): Promise<PortfolioData> {
  const url = portfolioTemplateUrl();
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to load portfolio data from ${url} (HTTP ${response.status} ${response.statusText}).`,
    );
  }

  const data: unknown = await response.json();

  if (!hasRequiredKeys(data)) {
    throw new Error(
      `Invalid portfolio data at ${url}: missing one or more required top-level keys (${REQUIRED_TOP_LEVEL_KEYS.join(", ")}).`,
    );
  }

  return data as PortfolioData;
}
