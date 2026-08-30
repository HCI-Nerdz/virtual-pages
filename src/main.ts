import { DecisionCursor } from "./core/cursor";
import { marketplaceSettingsTree } from "./core/marketplace-tree";
import { contrastHtml } from "./demos/contrast";
import { edgeStageShell, renderEdgeStack } from "./demos/edge";
import { parseRoute, placeholderStage, wrapDemo, type SelectedRoute } from "./demos/nav";
import {
  previewContentModeToggleHtml,
  previewStageShell,
  renderPreviewStack,
  setPreviewContentMode,
  type PreviewContentMode,
} from "./demos/preview";

const appEl = document.querySelector("#app");
if (!appEl) throw new Error("#app missing");
const app = appEl;

let unsub: (() => void) | undefined;

function wirePreviewModes(refresh: () => void) {
  app.querySelectorAll<HTMLElement>("[data-preview-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-preview-mode") as PreviewContentMode | null;
      if (!next) return;
      setPreviewContentMode(next);
      app.querySelectorAll<HTMLElement>("[data-preview-mode]").forEach((b) => {
        const on = b.getAttribute("data-preview-mode") === next;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      refresh();
    });
  });
}

function mount(route: SelectedRoute) {
  unsub?.();
  unsub = undefined;

  if (route == null) {
    app.innerHTML = wrapDemo(null, placeholderStage());
    return;
  }

  if (route === "contrast") {
    app.innerHTML = wrapDemo(route, contrastHtml(marketplaceSettingsTree));
    return;
  }

  const cursor = new DecisionCursor(marketplaceSettingsTree, "return-1042");

  if (route === "edge") {
    app.innerHTML = wrapDemo(route, edgeStageShell());
    const mountEl = document.querySelector<HTMLElement>("#edge-stage");
    if (!mountEl) throw new Error("#edge-stage missing");
    unsub = renderEdgeStack(cursor, mountEl);
    return;
  }

  app.innerHTML = wrapDemo(route, previewStageShell(), previewContentModeToggleHtml());
  const mountEl = document.querySelector<HTMLElement>("#preview-stage");
  if (!mountEl) throw new Error("#preview-stage missing");
  const session = renderPreviewStack(cursor, mountEl);
  wirePreviewModes(session.refresh);
  unsub = session.dispose;
}

function onHash() {
  mount(parseRoute(location.hash));
}

window.addEventListener("hashchange", onHash);
onHash();
