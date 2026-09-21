import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Background from "./components/Background";
import HueRibbon from "./components/HueRibbon";
import Intro from "./components/Intro";
import Questions from "./components/Questions";
import SectionCard from "./components/SectionCard";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import TechStack from "./components/TechStack";
import WorkExperience from "./components/WorkExperience";
import { loadPortfolio } from "./data/loadPortfolio";
import type { PortfolioData } from "./types";

type AppState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: PortfolioData };

const centerFullHeight = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  px: 2,
} as const;

/**
 * App shell. Fetches `portfolio-template.json` once on mount and renders the
 * assembled page; all personal content lives in the JSON, never in code.
 *
 * Render order (success): Background (fixed, z-index -1) > SiteHeader >
 * Container[maxWidth=lg] > Intro > HueRibbon > TechStack > HueRibbon >
 * WorkExperience (own internal ribbons) > Questions (own internal ribbon) >
 * SiteFooter.
 *
 * HueRibbon is full-bleed (100vw wide), so the Container must NOT clip
 * overflow — that would cut the escaped frames back to 1200px. Instead the
 * root `<main>` uses `overflowX: 'clip'` (never a scroll container) to absorb
 * the 100vw-vs-scrollbar (~15px) overflow. No App-level ribbon
 * sits directly above Questions or inside WorkExperience — those components
 * already render their own.
 */
function App() {
  const [state, setState] = useState<AppState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await loadPortfolio();
        if (!cancelled) setState({ status: "success", data });
      } catch (error: unknown) {
        console.error("[App] Failed to load portfolio data:", error);
        if (!cancelled) setState({ status: "error" });
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  // The fixed Vanta layer stays mounted across all states so it never has to
  // tear down / re-create the WebGL effect on a data-state transition.
  return (
    // Root-level containment: the full-bleed ribbons are 100vw wide, which
    // exceeds documentElement.clientWidth by the scrollbar width (~15px).
    // `clip` — unlike `hidden` — never creates a scroll container, and it does
    // not affect the fixed Background.
    <Box component="main" sx={{ overflowX: "clip" }}>
      <Background />
      {state.status === "loading" && (
        <Box sx={centerFullHeight}>
          <CircularProgress />
        </Box>
      )}
      {state.status === "error" && (
        <Box
          sx={{
            ...centerFullHeight,
            flexDirection: "column",
            gap: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h1">
            Couldn&apos;t load portfolio data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please refresh the page to try again.
          </Typography>
        </Box>
      )}
      {state.status === "success" && (
        <>
          <SiteHeader socials={state.data.socials} />
          {/* pb: 8 per spec; no overflow clipping here — ribbons escape to full viewport width. */}
          <Container maxWidth="lg" sx={{ pb: 8 }}>
            {/* mt: 4 — first card must not hug the sticky AppBar (spec 18). */}
            <SectionCard sx={{ mt: 4 }}>
              <Intro data={state.data} />
            </SectionCard>
            <HueRibbon />
            <SectionCard>
              <TechStack data={state.data} />
            </SectionCard>
            <HueRibbon />
            <WorkExperience data={state.data} />
            <Questions data={state.data} />
          </Container>
          <SiteFooter socials={state.data.socials} />
        </>
      )}
    </Box>
  );
}

export default App;
