# virtual-pages

Deploy (repo Pages): https://hci-nerdz.github.io/virtual-pages/

Org catalog: https://hci-nerdz.github.io/demos/

## Vocabulary

- **virtual pages** — chrome (edge layers / preview stack)
- **decision backbone** — armed route subtree + cursor model (`src/core/`)
- **soft / hard** — SPA vs document transport; chrome is transport-agnostic
- **vpages** — aspirational browser feature name (see `docs/browser-vpages.adoc`)

## Related ideas

Sibling HCI-Nerdz desk: **Edge Bar** (repo `context-rails`) — edge-summoned ecosystem nav. A possible umbrella name for both is **context edges** (edge as persistent context chrome). Repos stay separate; do not rename.

## Hub UX (multi-variant)

Tab bar + compact per-variant mockups (clickable); demo zone stays a placeholder until chosen. Pattern recorded in skill `demo-site-wiring`.

## Stakeholders

| Org | Role |
| --- | --- |
| HCI-Nerdz | Idea + interactive demo (this repo) |
| DevCentr | Framework / product wiring notes when apps adopt the backbone |
| dlang-supplemental | Future **dui/dew** component port — not required for this web desk |

## Demo routes

- `#/` — hub only (placeholder until a variant is chosen)
- `#/edge` — edge layers
- `#/preview` — preview stack
- `#/contrast` — flat mega-panel

Default deep link path in interactive variants: return flow under Orders (`return-1042`).
