import type { DecisionCursor } from "../core/cursor";
import type { DecisionNode, DecisionPath } from "../core/types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function transportBadge(node: DecisionNode): string {
  const kind = node.transport ?? "soft";
  const label = kind === "hard" ? "hard load" : "soft route";
  return `<span class="vp-transport" data-kind="${kind}" title="${kind === "hard" ? "Full document navigation" : "In-app route — no full page reload"}">${label}</span>`;
}

function routeLine(node: DecisionNode): string {
  return `<p class="vp-route"><code>${escapeHtml(node.route)}</code> ${transportBadge(node)}</p>`;
}

function breadcrumbHtml(path: DecisionPath): string {
  return `<nav class="vp-crumb" aria-label="Decision path">${path
    .map((n, i) => {
      const last = i === path.length - 1;
      if (last) {
        return `<span class="vp-crumb-here" aria-current="page">${escapeHtml(n.shortTitle)}</span>`;
      }
      return `<button type="button" class="vp-crumb-link" data-goto="${n.id}">${escapeHtml(n.shortTitle)}</button><span class="vp-crumb-sep" aria-hidden="true">/</span>`;
    })
    .join("")}</nav>`;
}

function choiceList(node: DecisionNode): string {
  const choices = node.choices ?? [];
  if (!choices.length) {
    return `<p class="vp-leaf-note">Leaf step — climb with the breadcrumb or a parent edge.</p>`;
  }
  return `<ul class="vp-choices">${choices
    .map(
      (c) =>
        `<li><button type="button" class="vp-choice" data-choose="${c.childId}">` +
        `<span class="vp-choice-label">${escapeHtml(c.label)}</span>` +
        (c.hint ? `<span class="vp-choice-hint">${escapeHtml(c.hint)}</span>` : "") +
        `</button></li>`,
    )
    .join("")}</ul>`;
}

function pageFace(node: DecisionNode, path: DecisionPath): string {
  return `<div class="vp-page-face" data-tone="${node.tone ?? "branch"}">
    ${breadcrumbHtml(path)}
    ${routeLine(node)}
    <p class="vp-prompt">${escapeHtml(node.prompt)}</p>
    <h2 class="vp-page-title">${escapeHtml(node.title)}</h2>
    <p class="vp-body">${escapeHtml(node.body)}</p>
    ${choiceList(node)}
  </div>`;
}

/** Visible parent edges: last 1–2 ancestors only. */
function edgeParents(path: DecisionPath): DecisionPath {
  if (path.length <= 1) return [];
  const parents = path.slice(0, -1);
  return parents.slice(-2);
}

/** Facsimile app frame — virtual pages stay inside this clip, not over the HCI demo hub. */
export function facsimileShell(inner: string): string {
  return `<div class="facsimile-desk">
  <p class="facsimile-caption">Simulated app viewport — virtual pages are clipped here, not over the demo hub</p>
  <div class="facsimile-bezel">
    <div class="market-shell">
      <header class="market-top">
        <span class="market-mark">Northbazaar</span>
        <span class="market-links">Deals · Cart · Help</span>
        <span class="market-note">Marketing chrome — outside the armed zone</span>
      </header>
      ${inner}
    </div>
  </div>
</div>`;
}

export function edgeStageShell(): string {
  return facsimileShell(`<div class="armed-zone" aria-label="Armed virtual-pages subtree">
    <p class="armed-label">Armed subtree · decision backbone · parent edges only</p>
    <div class="edge-stage" id="edge-stage"></div>
  </div>`);
}

export function renderEdgeStack(cursor: DecisionCursor, mount: HTMLElement) {
  const paint = (path: DecisionPath) => {
    const current = path[path.length - 1];
    const parents = edgeParents(path);
    const layers = parents
      .map((n, i) => {
        const depthFromFront = parents.length - i;
        return `<button type="button" class="vp-edge-layer" data-goto="${n.id}" data-depth="${depthFromFront}" title="Back to ${escapeHtml(n.title)}" aria-label="Back to ${escapeHtml(n.title)}">
          <span class="vp-edge-tab">${escapeHtml(n.shortTitle)}</span>
          <span class="vp-edge-sheet" aria-hidden="true" data-tone="${n.tone ?? "branch"}"></span>
        </button>`;
      })
      .join("");

    const peekCount = parents.length;
    mount.innerHTML = `<div class="vp-edge-stack" data-depth="${path.length}" data-peeks="${peekCount}">
      <div class="vp-edge-rail" aria-hidden="${peekCount ? "false" : "true"}">${layers}</div>
      <div class="vp-edge-front" data-tone="${current.tone ?? "branch"}">
        ${pageFace(current, path)}
        ${
          cursor.canUp()
            ? `<button type="button" class="vp-up-strip" data-up="1" aria-label="Go up one level">Up</button>`
            : ""
        }
      </div>
    </div>`;

    mount.querySelectorAll<HTMLElement>("[data-goto]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const id = el.getAttribute("data-goto");
        if (id) cursor.upTo(id);
      });
    });
    mount.querySelectorAll<HTMLElement>("[data-choose]").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-choose");
        if (id) cursor.choose(id);
      });
    });
    mount.querySelectorAll<HTMLElement>("[data-up]").forEach((el) => {
      el.addEventListener("click", () => cursor.up(1));
    });
  };

  paint(cursor.stack);
  return cursor.subscribe(paint);
}
