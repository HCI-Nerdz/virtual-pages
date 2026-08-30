import type { DecisionTree } from "../core/types";
import { facsimileShell } from "./edge";

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

  return facsimileShell(`<div class="flat-bleed" aria-label="Account settings directory">
    <div class="flat-grid">${sections}</div>
  </div>`);
}
