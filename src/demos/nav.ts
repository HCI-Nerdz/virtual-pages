/** Shared demo hub chrome — hash routes under Vite base. */

export type DemoRoute = "edge" | "preview" | "contrast";

/** null = no variant chosen yet (placeholder demo zone). */
export type SelectedRoute = DemoRoute | null;

const DEMOS_INDEX = "https://hci-nerdz.github.io/demos/";
const REPO_URL = "https://github.com/HCI-Nerdz/virtual-pages";
const ORG_LABEL = "HCI-Nerdz";
const REPO_LABEL = "virtual-pages";

const SUITE_LEDE =
  "Large directories dumped on one page overload people — and often exist because fewer full page loads look cheaper. " +
  "Virtual pages keep one decision backbone, give each option a real route name, and can deliver most steps as soft (SPA) navigations " +
  "so you do not pay a document round-trip per click. Soft and hard loads share the same stack chrome. " +
  "Arm this on a route subtree (settings, account) while marketing chrome stays outside.";

interface RouteMeta {
  id: DemoRoute;
  label: string;
  title: string;
  blurb: string;
  mockCaption: string;
}

const ROUTES: RouteMeta[] = [
  {
    id: "edge",
    label: "Edge layers",
    title: "Edge-layered virtual pages",
    blurb:
      "Parent steps show as thin left-edge tabs inside a clipped app frame (not full blank sheets). " +
      "Breadcrumb lives on the front page. Click an edge tab or crumb to climb. Only one or two parents peek — orientation, not a history mural.",
    mockCaption: "Thin parent edges beside the front page",
  },
  {
    id: "preview",
    label: "Preview stack",
    title: "Top-bar preview stack",
    blurb:
      "Ancestors sit in the top bar as preview cards — lined up when there is room, Cover Flow–style overlap when the bar fills. " +
      "Toggle Snippets vs Screenshots. Hover lifts z-index with a modest shadow. Arrows between cards hint at hierarchy. Click a card to jump.",
    mockCaption: "Ancestor cards in a top-bar stack",
  },
  {
    id: "contrast",
    label: "Flat contrast",
    title: "Same tree, flat mega-panel",
    blurb:
      "Identical destinations, classic pattern: every section and deep link visible together — the CFO-friendly “one page, scan hard” layout. " +
      "Same content budget can be SPA-routed as virtual pages without multiplying full document loads. Use this to feel the bleed.",
    mockCaption: "Every node on one mega-panel",
  },
];

const GITHUB_MARK =
  `<svg class="vcs-mark" viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" focusable="false">` +
  `<path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>` +
  `</svg>`;

export function parseRoute(hash: string): SelectedRoute {
  const raw = (hash.replace(/^#\/?/, "") || "").split("?")[0];
  if (!raw) return null;
  const hit = ROUTES.find((r) => r.id === raw);
  return hit ? hit.id : null;
}

function routeMeta(id: DemoRoute): RouteMeta {
  return ROUTES.find((r) => r.id === id) ?? ROUTES[0];
}

function mockPreviewHtml(id: DemoRoute): string {
  if (id === "edge") {
    return `<span class="vp-mock-preview vp-mock-edge" aria-hidden="true">
      <span class="vp-mock-edge-rail"><i></i><i></i></span>
      <span class="vp-mock-edge-face"></span>
    </span>`;
  }
  if (id === "preview") {
    return `<span class="vp-mock-preview vp-mock-preview-stack" aria-hidden="true">
      <span class="vp-mock-card"></span>
      <span class="vp-mock-arrow"></span>
      <span class="vp-mock-card"></span>
      <span class="vp-mock-arrow"></span>
      <span class="vp-mock-card is-now"></span>
    </span>`;
  }
  return `<span class="vp-mock-preview vp-mock-flat" aria-hidden="true">
    <span></span><span></span><span></span><span></span>
  </span>`;
}

function tabBarHtml(active: SelectedRoute): string {
  const tabs = ROUTES.map((r) => {
    const selected = r.id === active;
    return `<a class="demo-tab${selected ? " is-active" : ""}" role="tab" href="#/${r.id}" data-route="${r.id}" aria-selected="${selected}" id="tab-${r.id}">${r.label}</a>`;
  }).join("");
  return `<div class="demo-tabbar" role="tablist" aria-label="Virtual page variants">${tabs}</div>`;
}

function mockupGridHtml(active: SelectedRoute): string {
  const tiles = ROUTES.map((r) => {
    const selected = r.id === active;
    return `<a class="demo-mock-tile${selected ? " is-active" : ""}" href="#/${r.id}" data-route="${r.id}" aria-current="${selected ? "true" : "false"}">
      ${mockPreviewHtml(r.id)}
      <strong>${r.label}</strong>
      <span>${r.mockCaption}</span>
    </a>`;
  }).join("");
  return `<nav class="demo-mock-grid" aria-label="Variant mockups">${tiles}</nav>`;
}

export function placeholderStage(): string {
  return `<div class="demo-placeholder" role="status">
    <p class="demo-placeholder-title">Pick a variant</p>
    <p class="demo-placeholder-body">Choose a tab or mockup above to load the interactive desk.</p>
  </div>`;
}

export function hubHtml(active: SelectedRoute): string {
  const metaBlock =
    active == null
      ? `<p class="demo-choose-hint">Select a variant to open its interactive desk below.</p>`
      : (() => {
          const meta = routeMeta(active);
          return `<h1 class="demo-hub-title" id="panel-${active}">${meta.title}</h1>
  <p class="demo-variant-lede">${meta.blurb}</p>`;
        })();

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
  ${tabBarHtml(active)}
  ${mockupGridHtml(active)}
  ${metaBlock}
</header>`;
}

export function wrapDemo(active: SelectedRoute, body: string): string {
  const panel =
    active == null
      ? ""
      : ` role="tabpanel" aria-labelledby="tab-${active}" id="panel-body-${active}"`;
  return `${hubHtml(active)}<main class="demo-stage" data-demo="${active ?? "none"}"${panel}>${body}</main>`;
}
