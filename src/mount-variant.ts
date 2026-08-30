import "./styles.css";
import { DecisionCursor } from "./core/cursor";
import { marketplaceSettingsTree } from "./core/marketplace-tree";
import { contrastHtml } from "./demos/contrast";
import { edgeStageShell, renderEdgeStack } from "./demos/edge";
import { variantPageHtml, type DemoRoute } from "./demos/nav";
import {
  previewContentModeToggleHtml,
  previewStageShell,
  renderPreviewStack,
  setPreviewContentMode,
  type PreviewContentMode,
} from "./demos/preview";

function wirePreviewModes(root: ParentNode, refresh: () => void) {
  root.querySelectorAll<HTMLElement>("[data-preview-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-preview-mode") as PreviewContentMode | null;
      if (!next) return;
      setPreviewContentMode(next);
      root.querySelectorAll<HTMLElement>("[data-preview-mode]").forEach((b) => {
        const on = b.getAttribute("data-preview-mode") === next;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      refresh();
    });
  });
}

export function mountVariant(route: DemoRoute) {
  const appEl = document.querySelector("#app");
  if (!appEl) throw new Error("#app missing");
  const app = appEl;

  if (route === "contrast") {
    app.innerHTML = variantPageHtml(route, contrastHtml(marketplaceSettingsTree));
    return;
  }

  const cursor = new DecisionCursor(marketplaceSettingsTree, "return-1042");

  if (route === "edge") {
    app.innerHTML = variantPageHtml(route, edgeStageShell());
    const mountEl = document.querySelector<HTMLElement>("#edge-stage");
    if (!mountEl) throw new Error("#edge-stage missing");
    renderEdgeStack(cursor, mountEl);
    return;
  }

  app.innerHTML = variantPageHtml(route, previewStageShell(), previewContentModeToggleHtml());
  const mountEl = document.querySelector<HTMLElement>("#preview-stage");
  if (!mountEl) throw new Error("#preview-stage missing");
  const session = renderPreviewStack(cursor, mountEl);
  wirePreviewModes(app, session.refresh);
}
