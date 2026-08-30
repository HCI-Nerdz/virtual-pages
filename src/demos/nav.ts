/** Shared demo hub chrome — hash routes under Vite base. */

import introAnchorSvg from "../assets/intro-anchor.svg?raw";

export type DemoRoute = "edge" | "preview" | "contrast";

const DEMOS_INDEX = "https://hci-nerdz.github.io/demos/";
const REPO_URL = "https://github.com/HCI-Nerdz/virtual-pages";
const ORG_LABEL = "HCI-Nerdz";
const REPO_LABEL = "virtual-pages";

const SUITE_LEDE =
  "Large directories dumped on one page overload people — and often exist because fewer full page loads look cheaper. " +
  "Virtual pages keep one decision backbone, give each option a real route name, and can deliver most steps as soft (SPA) navigations " +
  "so you do not pay a document round-trip per click. Soft and hard loads share the same stack chrome. " +
  "Arm this on a route subtree (settings, account) while marketing chrome stays outside.";

const INTRO_ANCHOR_ALT =
  "Simulated app frame: thin Orders and #1042 edge tabs beside the Return page, with breadcrumb and soft-route badge";

interface RouteMeta {
  id: DemoRoute;
  label: string;
  title: string;
  blurb: string;
}

const ROUTES: RouteMeta[] = [
  {
    id: "edge",
    label: "Edge layers",
    title: "Edge-layered virtual pages",
    blurb:
      "Inside a clipped simulated app frame: parent steps show as thin left-edge tabs (not full blank sheets). Breadcrumb lives on the front page. " +
      "Click an edge tab or crumb to climb. Only one or two parents peek — orientation, not a history mural.",
  },
  {
    id: "preview",
    label: "Preview stack",
    title: "Top-bar preview stack",
    blurb:
      "Same facsimile frame. Ancestors sit in the top bar as preview cards — lined up when there is room, Cover Flow–style overlap (Y-axis tilt, nearest ancestors more open) when the bar fills. " +
      "Toggle Snippets (literal text) vs Screenshots (faux page captures; real product would frame around the last click). " +
      "Hover lifts z-index with a modest shadow — no zoom that steals neighbor hits. Click a card to jump.",
  },
  {
    id: "contrast",
    label: "Flat contrast",
    title: "Same tree, flat mega-panel",
    blurb:
      "Identical destinations, classic pattern: every section and deep link visible together — the CFO-friendly “one page, scan hard” layout. " +
      "Same content budget can be SPA-routed as virtual pages without multiplying full document loads. Use this to feel the bleed.",
  },
];

const GITHUB_MARK =
  `<svg class="vcs-mark" viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" focusable="false">` +
  `<path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>` +
  `</svg>`;

export function parseRoute(hash: string): DemoRoute {
  const raw = (hash.replace(/^#\/?/, "") || "edge").split("?")[0];
  const hit = ROUTES.find((r) => r.id === raw);
  return hit ? hit.id : "edge";
}

function routeMeta(id: DemoRoute): RouteMeta {
  return ROUTES.find((r) => r.id === id) ?? ROUTES[0];
}

export function hubHtml(active: DemoRoute): string {
  const links = ROUTES.map((r) => {
    const cls = r.id === active ? "demo-variant-link active" : "demo-variant-link";
    return `<a class="${cls}" href="#/${r.id}" data-route="${r.id}">${r.label}</a>`;
  }).join("");
  const meta = routeMeta(active);
  return `<header class="demo-hub" role="banner">
  <p class="demo-identity">
    <a href="${DEMOS_INDEX}">${ORG_LABEL}</a>
    <span class="demo-hub-sep" aria-hidden="true">/</span>
    <a href="${REPO_URL}">${REPO_LABEL}</a>
    <span class="sim-badge" title="Interactive mock">DEMO</span>
  </p>
  <p class="demo-vcs">
    <a class="vcs-link" href="${REPO_URL}" title="GitHub repository" aria-label="GitHub: ${REPO_LABEL}">${GITHUB_MARK}<span class="vcs-label">GitHub</span></a>
  </p>
  <p class="demo-suite-lede">${SUITE_LEDE}</p>
  <figure class="demo-intro-anchor" aria-label="${INTRO_ANCHOR_ALT}">
    ${introAnchorSvg}
  </figure>
  <div class="demo-variants" role="navigation" aria-label="Virtual page variants">${links}</div>
  <h1 class="demo-hub-title">${meta.title}</h1>
  <p class="demo-variant-lede">${meta.blurb}</p>
</header>`;
}

export function wrapDemo(active: DemoRoute, body: string): string {
  return `${hubHtml(active)}<main class="demo-stage" data-demo="${active}">${body}</main>`;
}
