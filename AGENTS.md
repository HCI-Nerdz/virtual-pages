# virtual-pages

Deploy (repo Pages): https://hci-nerdz.github.io/virtual-pages/

Org catalog: https://hci-nerdz.github.io/demos/

## Vocabulary

- **virtual pages** — chrome (edge layers / preview stack)
- **decision backbone** — armed route subtree + cursor model (`src/core/`)
- **soft / hard** — SPA vs document transport; chrome is transport-agnostic
- **vpages** — aspirational browser feature name (see `docs/browser-vpages.adoc`)

## Related ideas

Sibling HCI-Nerdz desk: **Context Edge** (repo `context-edge`) — edge-summoned ecosystem nav. A possible umbrella name for both is **context edges** (edge as persistent context chrome). Repos stay separate; do not rename.

## Hub UX (multi-variant)

Selector landing with clickable mockup tiles → **separate variant pages** (`/edge/`, `/preview/`, `/contrast/`). No interactive desk on the hub. Pattern in skill `demo-site-wiring` (Context Edge–style).

Identity strip trail: `HCI Nerdz / Demos / virtual-pages [/ variant]`.

## Stakeholders

| Org | Role |
| --- | --- |
| HCI-Nerdz | Idea + interactive demo (this repo) |
| DevCentr | Framework / product wiring notes when apps adopt the backbone |
| dlang-supplemental | Future **dui/dew** component port — not required for this web desk |

## Demo routes

- `/` — selector hub only
- `/edge/` — edge layers
- `/preview/` — preview stack
- `/contrast/` — flat mega-panel

Legacy `#/edge` (etc.) hashes redirect to the real pages.

Default deep link path in interactive variants: return flow under Orders (`return-1042`).
