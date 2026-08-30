/** Shared demo chrome — selector hub + separate variant pages. */

export type DemoRoute = "edge" | "preview" | "contrast";

const ORG_HOME = "https://hci-nerdz.github.io/";
const DEMOS_INDEX = "https://hci-nerdz.github.io/demos/";
/** Site home for this demo (Pages / suite root). */
export const SITE_HOME = import.meta.env.BASE_URL;
const REPO_URL = "https://github.com/HCI-Nerdz/virtual-pages";
const ORG_LABEL = "HCI Nerdz";
const DEMOS_LABEL = "Demos";
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
      "Hover lifts z-index with a modest shadow. Arrows between cards hint at hierarchy. Click a card to jump. " +
      "Use Snippets vs Screenshots below to change what each card shows — that control stays outside the product facsimile.",
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

export function routeHref(id: DemoRoute): string {
  return `${SITE_HOME}${id}/`;
}

export function routeMeta(id: DemoRoute): RouteMeta {
  return ROUTES.find((r) => r.id === id) ?? ROUTES[0];
}

export function isDemoRoute(raw: string): raw is DemoRoute {
  return ROUTES.some((r) => r.id === raw);
}

/** Old hash deep-links (`#/edge`) → real variant pages. */
export function redirectLegacyHash(): boolean {
  const raw = (location.hash.replace(/^#\/?/, "") || "").split("?")[0];
  if (!isDemoRoute(raw)) return false;
  location.replace(routeHref(raw));
  return true;
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

/**
 * Site-nav trail including intermediates that lead to the demo home.
 * On a variant page, the variant label is the final crumb.
 */
function identityHtml(active: DemoRoute | null): string {
  const crumbs: string[] = [
    `<a href="${ORG_HOME}">${ORG_LABEL}</a>`,
    `<span class="demo-hub-sep" aria-hidden="true">/</span>`,
    `<a href="${DEMOS_INDEX}">${DEMOS_LABEL}</a>`,
    `<span class="demo-hub-sep" aria-hidden="true">/</span>`,
  ];
  if (active == null) {
    crumbs.push(`<span aria-current="page">${REPO_LABEL}</span>`);
  } else {
    const meta = routeMeta(active);
    crumbs.push(`<a href="${SITE_HOME}">${REPO_LABEL}</a>`);
    crumbs.push(`<span class="demo-hub-sep" aria-hidden="true">/</span>`);
    crumbs.push(`<span aria-current="page">${meta.label}</span>`);
  }
  crumbs.push(`<span class="sim-badge" title="Interactive mock">DEMO</span>`);
  return `<p class="demo-identity">${crumbs.join("\n    ")}</p>`;
}

function vcsHtml(): string {
  return `<p class="demo-vcs">
    <a class="vcs-link" href="${REPO_URL}" title="GitHub repository" aria-label="GitHub: ${REPO_LABEL}">${GITHUB_MARK}<span class="vcs-label">GitHub</span></a>
  </p>`;
}

/** Hub gallery: each tile opens a separate variant page (not an in-page tabpanel). */
function galleryHtml(): string {
  const tiles = ROUTES.map(
    (r) => `<a class="demo-variant-tile" href="${routeHref(r.id)}">
      <span class="demo-tab-label">${r.label}</span>
      ${mockPreviewHtml(r.id)}
      <span class="demo-tab-caption">${r.mockCaption}</span>
    </a>`,
  ).join("");
  return `<nav class="demo-variant-gallery" aria-label="Virtual page variants">${tiles}</nav>`;
}

/** Compact sibling links on a variant page (real pages, not tabs). */
function siblingNavHtml(active: DemoRoute): string {
  const links = ROUTES.map((r) => {
    const current = r.id === active;
    if (current) {
      return `<span class="demo-sibling is-current" aria-current="page">${r.label}</span>`;
    }
    return `<a class="demo-sibling" href="${routeHref(r.id)}">${r.label}</a>`;
  }).join("");
  return `<nav class="demo-sibling-nav" aria-label="Other variants">
  <a class="demo-sibling-hub" href="${SITE_HOME}">← All variants</a>
  <span class="demo-sibling-list">${links}</span>
</nav>`;
}

/** Selector landing — no interactive desk on this page. */
export function hubPageHtml(): string {
  return `<header class="demo-hub" role="banner">
  ${identityHtml(null)}
  ${vcsHtml()}
  <h1 class="demo-hub-title">Virtual pages</h1>
  <p class="demo-suite-lede">${SUITE_LEDE}</p>
  <p class="demo-choose-hint">Pick a variant to open its interactive desk on its own page.</p>
  ${galleryHtml()}
</header>`;
}

/** Variant page chrome + desk body. */
export function variantPageHtml(
  active: DemoRoute,
  body: string,
  previewModesHtml = "",
): string {
  const meta = routeMeta(active);
  const modes =
    active === "preview" && previewModesHtml
      ? `<div class="demo-preview-modes-row">${previewModesHtml}</div>`
      : "";
  return `<header class="demo-hub" role="banner">
  ${identityHtml(active)}
  ${vcsHtml()}
  ${siblingNavHtml(active)}
  <h1 class="demo-hub-title">${meta.title}</h1>
  <p class="demo-variant-lede">${meta.blurb}</p>
  ${modes}
</header>
<main class="demo-stage" data-demo="${active}">${body}</main>`;
}
