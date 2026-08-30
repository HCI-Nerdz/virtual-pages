import type { DecisionCursor } from "../core/cursor";
import type { DecisionNode, DecisionPath } from "../core/types";
import { facsimileShell } from "./edge";

export type PreviewContentMode = "snippets" | "shots";

const CARD_W = 118;
const CARD_GAP = 12;
/** Minimum left-edge step when the bar is packed (near-vertical Cover Flow spines). */
const MIN_STEP = 16;
/** Last N ancestors keep a wider visible strip when overlapping. */
const NEAR_VISIBLE = 3;
const MAX_ROTATE_Y = 58;

let contentMode: PreviewContentMode = "snippets";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function transportBadge(node: DecisionNode): string {
  const kind = node.transport ?? "soft";
  const label = kind === "hard" ? "Hard" : "Soft";
  return `<span class="vp-transport" data-kind="${kind}">${label}</span>`;
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
    return `<p class="vp-leaf-note">Leaf step — use the preview stack or breadcrumb to climb.</p>`;
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

export function previewStageShell(): string {
  return facsimileShell(`<div class="armed-zone" aria-label="Account settings">
    <div class="preview-stage" id="preview-stage"></div>
  </div>`);
}

/** Pack cards: line up when there is room; overlap + Cover Flow rotateY when the bar fills. */
export function packPreviewCards(
  count: number,
  barWidth: number,
  cardW = CARD_W,
): { x: number; rotateY: number }[] {
  if (count <= 0) return [];

  const nearStep = Math.round(cardW * 0.52);
  const lined = count * cardW + Math.max(0, count - 1) * CARD_GAP;
  if (lined <= barWidth) {
    return Array.from({ length: count }, (_, i) => ({
      x: i * (cardW + CARD_GAP),
      rotateY: 0,
    }));
  }

  const steps: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    const fromEnd = count - 2 - i;
    steps.push(fromEnd < NEAR_VISIBLE - 1 ? nearStep : MIN_STEP);
  }

  const maxSpan = Math.max(barWidth - cardW, MIN_STEP * (count - 1));
  let span = steps.reduce((a, b) => a + b, 0);
  if (span > maxSpan && span > 0) {
    const scale = maxSpan / span;
    for (let i = 0; i < steps.length; i++) steps[i] *= scale;
    span = maxSpan;
  }

  const denom = Math.max(count - 1, 1);
  const out: { x: number; rotateY: number }[] = [];
  let x = 0;
  for (let i = 0; i < count; i++) {
    const depthFromRight = count - 1 - i;
    const rotateY = -((depthFromRight / denom) * MAX_ROTATE_Y);
    out.push({ x: Math.round(x * 10) / 10, rotateY: Math.round(rotateY * 10) / 10 });
    if (i < count - 1) x += steps[i];
  }
  return out;
}

function snippetSurface(node: DecisionNode): string {
  return `<span class="vp-preview-surface vp-preview-snippet" data-tone="${node.tone ?? "branch"}">
    <span class="vp-preview-mini-h">${escapeHtml(node.title)}</span>
    <span class="vp-preview-mini-p">${escapeHtml(node.prompt)}</span>
    <span class="vp-preview-lines" aria-hidden="true"></span>
  </span>`;
}

/**
 * Faux page-preview “screenshot”: CSS mock of the page face with a focus region
 * standing in for the product heuristic (capture around last click).
 */
function shotSurface(node: DecisionNode, index: number, total: number): string {
  const focusTop = 28 + ((index * 17) % 22);
  const focusLeft = 8 + ((index * 11) % 18);
  const tone = node.tone ?? "branch";
  return `<span class="vp-preview-surface vp-preview-shot" data-tone="${tone}" aria-hidden="true">
    <span class="vp-shot-chrome">
      <span class="vp-shot-dot"></span><span class="vp-shot-dot"></span><span class="vp-shot-dot"></span>
      <span class="vp-shot-url">${escapeHtml(node.route)}</span>
    </span>
    <span class="vp-shot-body">
      <span class="vp-shot-title">${escapeHtml(node.shortTitle)}</span>
      <span class="vp-shot-block"></span>
      <span class="vp-shot-block vp-shot-block-short"></span>
      <span class="vp-shot-row"></span>
      <span class="vp-shot-focus" style="--fx:${focusLeft}%;--fy:${focusTop}%" title="Mock: region around last click"></span>
    </span>
    <span class="vp-shot-caption">${index + 1}/${total}</span>
  </span>`;
}

function previewCard(
  node: DecisionNode,
  index: number,
  layout: { x: number; rotateY: number },
  mode: PreviewContentMode,
  total: number,
): string {
  const z = index + 1;
  const surface = mode === "shots" ? shotSurface(node, index, total) : snippetSurface(node);
  return `<button type="button" class="vp-preview-card" data-goto="${node.id}" data-index="${index}" data-mode="${mode}" style="--z:${z};--x:${layout.x}px;--ry:${layout.rotateY}deg" aria-label="Jump to ${escapeHtml(node.title)}">
    <span class="vp-preview-title">${escapeHtml(node.shortTitle)}</span>
    ${surface}
  </button>`;
}

function modeToggleHtml(mode: PreviewContentMode): string {
  const snip = mode === "snippets" ? "active" : "";
  const shots = mode === "shots" ? "active" : "";
  return `<div class="vp-preview-modes" role="group" aria-label="Preview card content">
    <button type="button" class="vp-preview-mode ${snip}" data-preview-mode="snippets" aria-pressed="${mode === "snippets"}">Snippets</button>
    <button type="button" class="vp-preview-mode ${shots}" data-preview-mode="shots" aria-pressed="${mode === "shots"}">Screenshots</button>
  </div>`;
}

function applyPack(stackEl: HTMLElement, count: number) {
  const first = stackEl.querySelector(".vp-preview-card") as HTMLElement | null;
  const cardW = first?.offsetWidth || CARD_W;
  const width = Math.max(cardW, stackEl.clientWidth || 480);
  const layouts = packPreviewCards(count, width, cardW);
  const lined = layouts.every((l) => l.rotateY === 0);
  stackEl.querySelectorAll<HTMLElement>(".vp-preview-card").forEach((card, i) => {
    const L = layouts[i];
    if (!L) return;
    card.style.setProperty("--x", `${L.x}px`);
    card.style.setProperty("--ry", `${L.rotateY}deg`);
  });
  stackEl.querySelectorAll<HTMLElement>(".vp-preview-arrow").forEach((arrow) => {
    const i = Number(arrow.getAttribute("data-after") ?? "-1");
    const left = layouts[i];
    const right = layouts[i + 1];
    if (!left || !right) {
      arrow.style.opacity = "0";
      return;
    }
    const mid = lined ? left.x + cardW + (right.x - left.x - cardW) / 2 : left.x + Math.max(10, (right.x - left.x) * 0.55);
    arrow.style.setProperty("--ax", `${mid}px`);
    arrow.style.opacity = lined || right.x - left.x > 28 ? "1" : "0.35";
  });
  stackEl.setAttribute("data-packed", lined ? "line" : "overlap");
}

export function renderPreviewStack(cursor: DecisionCursor, mount: HTMLElement) {
  let resizeObs: ResizeObserver | undefined;

  const paint = (path: DecisionPath) => {
    resizeObs?.disconnect();
    resizeObs = undefined;

    const current = path[path.length - 1];
    const ancestors = path.slice(0, -1);
    const mode = contentMode;
    const provisional = packPreviewCards(ancestors.length, 480);
    const stackInner = ancestors.length
      ? ancestors
          .map((n, i) => {
            const card = previewCard(n, i, provisional[i] ?? { x: i * 14, rotateY: 0 }, mode, ancestors.length);
            const arrow =
              i < ancestors.length - 1
                ? `<span class="vp-preview-arrow" aria-hidden="true" data-after="${i}">›</span>`
                : "";
            return card + arrow;
          })
          .join("")
      : `<span class="vp-preview-empty">At account root — no ancestors</span>`;

    mount.innerHTML = `<div class="vp-preview-layout">
      ${modeToggleHtml(mode)}
      <div class="vp-preview-bar" id="preview-bar" aria-label="Ancestor page previews">
        <div class="vp-preview-stack" id="preview-stack">${stackInner}</div>
        <span class="vp-preview-flow" aria-hidden="true">→</span>
        <span class="vp-preview-now">${escapeHtml(current.shortTitle)}</span>
      </div>
      <div class="vp-preview-front" data-tone="${current.tone ?? "branch"}">
        ${breadcrumbHtml(path)}
        <p class="vp-route"><code>${escapeHtml(current.route)}</code> ${transportBadge(current)}</p>
        <p class="vp-prompt">${escapeHtml(current.prompt)}</p>
        <h2 class="vp-page-title">${escapeHtml(current.title)}</h2>
        <p class="vp-body">${escapeHtml(current.body)}</p>
        ${choiceList(current)}
      </div>
    </div>`;

    const bar = mount.querySelector<HTMLElement>("#preview-bar");
    const stack = mount.querySelector<HTMLElement>("#preview-stack");

    const relayout = () => {
      if (stack && ancestors.length) applyPack(stack, ancestors.length);
    };
    requestAnimationFrame(relayout);
    if (stack && ancestors.length) {
      resizeObs = new ResizeObserver(() => relayout());
      resizeObs.observe(stack);
    }

    mount.querySelectorAll<HTMLElement>("[data-preview-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-preview-mode") as PreviewContentMode | null;
        if (!next || next === contentMode) return;
        contentMode = next;
        paint(cursor.stack);
      });
    });

    mount.querySelectorAll<HTMLElement>(".vp-preview-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        bar?.setAttribute("data-peek", card.getAttribute("data-index") ?? "");
      });
      card.addEventListener("mouseleave", () => {
        bar?.removeAttribute("data-peek");
      });
      card.addEventListener("focus", () => {
        bar?.setAttribute("data-peek", card.getAttribute("data-index") ?? "");
      });
      card.addEventListener("blur", () => {
        bar?.removeAttribute("data-peek");
      });
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-goto");
        if (id) cursor.upTo(id);
      });
    });

    mount.querySelectorAll<HTMLElement>("[data-goto]").forEach((el) => {
      if (el.classList.contains("vp-preview-card")) return;
      el.addEventListener("click", () => {
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
  };

  paint(cursor.stack);
  const unsub = cursor.subscribe(paint);
  return () => {
    resizeObs?.disconnect();
    unsub();
  };
}
