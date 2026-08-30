import { DecisionCursor } from "./core/cursor";
import { marketplaceSettingsTree } from "./core/marketplace-tree";
import { contrastHtml } from "./demos/contrast";
import { edgeStageShell, renderEdgeStack } from "./demos/edge";
import { parseRoute, placeholderStage, wrapDemo, type SelectedRoute } from "./demos/nav";
import { previewStageShell, renderPreviewStack } from "./demos/preview";

const app = document.querySelector("#app");
if (!app) throw new Error("#app missing");

let unsub: (() => void) | undefined;

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

  app.innerHTML = wrapDemo(route, previewStageShell());
  const mountEl = document.querySelector<HTMLElement>("#preview-stage");
  if (!mountEl) throw new Error("#preview-stage missing");
  unsub = renderPreviewStack(cursor, mountEl);
}

function onHash() {
  mount(parseRoute(location.hash));
}

window.addEventListener("hashchange", onHash);
onHash();
