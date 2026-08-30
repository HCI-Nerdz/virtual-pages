import type { DecisionTree } from "../core/types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Flat mega-panel: same destinations, maximum simultaneous context bleed. */
export function contrastHtml(tree: DecisionTree): string {
  const nodes = Object.values(tree.nodes);
  const sections = nodes
    .map((n) => {
      const links = (n.choices ?? [])
        .map((c) => `<li>${escapeHtml(c.label)}${c.hint ? ` <em>(${escapeHtml(c.hint)})</em>` : ""}</li>`)
        .join("");
      return `<section class="flat-card">
        <h3>${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.body)}</p>
        ${links ? `<ul>${links}</ul>` : ""}
      </section>`;
    })
    .join("");

  return `<div class="market-shell">
  <header class="market-top">
    <span class="market-mark">Northbazaar</span>
    <span class="market-links">Deals · Cart · Help</span>
    <span class="market-note">Same tree — flat presentation</span>
  </header>
  <div class="flat-bleed" aria-label="Flat settings contrast">
    <p class="flat-warn">Contrast mode: every node visible at once — the mega-directory pattern. Same destinations can be soft-routed as virtual pages without multiplying full document loads; hard loads (PDF, armed-zone entry) still join the same stack.</p>
    <div class="flat-grid">${sections}</div>
  </div>
</div>`;
}
