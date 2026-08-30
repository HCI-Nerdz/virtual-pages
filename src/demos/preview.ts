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
  return `<div class="market-shell">
  <header class="market-top">
    <span class="market-mark">Northbazaar</span>
    <span class="market-links">Deals · Cart · Help</span>
    <span class="market-note">Marketing chrome — outside the armed zone</span>
  </header>
  <div class="armed-zone" aria-label="Armed virtual-pages subtree">
    <p class="armed-label">Armed subtree · preview stack in the top bar</p>
    <div class="preview-stage" id="preview-stage"></div>
  </div>
</div>`;
}

function previewCard(node: DecisionNode, index: number, total: number): string {
  const z = index + 1;
  const offset = index * 14;
  return `<button type="button" class="vp-preview-card" data-goto="${node.id}" data-index="${index}" style="--z:${z};--x:${offset}px" aria-label="Jump to ${escapeHtml(node.title)}">
    <span class="vp-preview-title">${escapeHtml(node.shortTitle)}</span>
    <span class="vp-preview-mini" data-tone="${node.tone ?? "branch"}">
      <span class="vp-preview-mini-h">${escapeHtml(node.title)}</span>
      <span class="vp-preview-mini-p">${escapeHtml(node.prompt)}</span>
      <span class="vp-preview-lines" aria-hidden="true"></span>
    </span>
  </button>`;
}

export function renderPreviewStack(cursor: DecisionCursor, mount: HTMLElement) {
  const paint = (path: DecisionPath) => {
    const current = path[path.length - 1];
    const ancestors = path.slice(0, -1);
    const cards = ancestors.map((n, i) => previewCard(n, i, ancestors.length)).join("");

    mount.innerHTML = `<div class="vp-preview-layout">
      <div class="vp-preview-bar" id="preview-bar" aria-label="Ancestor page previews">
        <div class="vp-preview-stack">${cards || `<span class="vp-preview-empty">At armed root — no ancestors</span>`}</div>
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

    const bar = mount.querySelector("#preview-bar");
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
  return cursor.subscribe(paint);
}
