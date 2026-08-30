import type { DecisionTree } from "./types";

/**
 * Marketplace-style settings sub-hierarchy.
 * Marketing chrome sits *outside* the armed zone; only this tree uses virtual pages.
 */
export const marketplaceSettingsTree: DecisionTree = {
  rootId: "account",
  nodes: {
    account: {
      id: "account",
      title: "Your account",
      shortTitle: "Account",
      route: "/account",
      transport: "hard",
      tone: "root",
      prompt: "What do you need to manage?",
      body:
        "One decision at a time. Sibling account areas stay off-screen until you pick a path — " +
        "so Orders does not compete with Payment methods for attention. " +
        "Entering this armed zone can be a real document load; steps below can stay soft.",
      choices: [
        { label: "Your orders", childId: "orders", hint: "Track, return, or buy again · soft route" },
        { label: "Login & security", childId: "security", hint: "Password, 2FA, devices · soft route" },
        { label: "Payment methods", childId: "payments", hint: "Cards and wallets · soft route" },
        { label: "Addresses", childId: "addresses", hint: "Shipping and billing · soft route" },
      ],
    },
    orders: {
      id: "orders",
      title: "Your orders",
      shortTitle: "Orders",
      route: "/account/orders",
      transport: "soft",
      tone: "branch",
      prompt: "Which order?",
      body:
        "Recent orders only — same payload a mega-page would ship, but addressed as its own route. " +
        "Opening an order replaces this list; the list stays a virtual page behind you. No full reload.",
      choices: [
        { label: "Order #1042 — ceramic mug set", childId: "order-1042", hint: "Delivered Aug 12 · soft" },
        { label: "Order #1038 — desk lamp", childId: "order-1038", hint: "Delivered Aug 3 · soft" },
        { label: "Order #1021 — notebook pack", childId: "order-1021", hint: "Delivered Jul 22 · soft" },
      ],
    },
    "order-1042": {
      id: "order-1042",
      title: "Order #1042",
      shortTitle: "#1042",
      route: "/account/orders/1042",
      transport: "soft",
      tone: "branch",
      prompt: "What next for this order?",
      body: "Mug set · delivered Aug 12 · $42.18. Pick an action — do not scan every account feature from here.",
      choices: [
        { label: "Return or replace items", childId: "return-1042", hint: "Start a return · soft" },
        { label: "Buy again", childId: "buy-again-1042", hint: "Add to cart · soft" },
        {
          label: "Invoice PDF",
          childId: "invoice-1042",
          hint: "Hard nav to download endpoint (still one stack)",
        },
      ],
    },
    "order-1038": {
      id: "order-1038",
      title: "Order #1038",
      shortTitle: "#1038",
      route: "/account/orders/1038",
      transport: "soft",
      tone: "leaf",
      prompt: "Order detail",
      body: "Desk lamp · delivered Aug 3 · $68.00. (Stub leaf for the demo path — use #1042 to go deeper.)",
    },
    "order-1021": {
      id: "order-1021",
      title: "Order #1021",
      shortTitle: "#1021",
      route: "/account/orders/1021",
      transport: "soft",
      tone: "leaf",
      prompt: "Order detail",
      body: "Notebook pack · delivered Jul 22 · $18.40. (Stub leaf — use #1042 for the full stack.)",
    },
    "return-1042": {
      id: "return-1042",
      title: "Return items — #1042",
      shortTitle: "Return",
      route: "/account/orders/1042/return",
      transport: "soft",
      tone: "leaf",
      prompt: "Which items go back?",
      body:
        "Four decisions deep, still one document cost profile after the armed-zone entry. " +
        "Parent pages stay as edges or preview cards — climb without reloading a mega-settings wall.",
      choices: [
        { label: "Both mugs — wrong color", childId: "return-done", hint: "Refund to original payment" },
        { label: "One mug — chipped", childId: "return-done", hint: "Replace" },
      ],
    },
    "buy-again-1042": {
      id: "buy-again-1042",
      title: "Buy again",
      shortTitle: "Buy again",
      route: "/account/orders/1042/buy-again",
      transport: "soft",
      tone: "leaf",
      prompt: "Confirm cart add",
      body: "Ceramic mug set added to cart (demo). Climb the stack to leave this leaf.",
    },
    "invoice-1042": {
      id: "invoice-1042",
      title: "Invoice",
      shortTitle: "Invoice",
      route: "/account/orders/1042/invoice.pdf",
      transport: "hard",
      tone: "leaf",
      prompt: "Download ready",
      body:
        "Hard navigation to a downloadable document — still appears in the same decision backbone. " +
        "Soft and hard steps share chrome so the user never learns two nav languages.",
    },
    "return-done": {
      id: "return-done",
      title: "Return started",
      shortTitle: "Done",
      route: "/account/orders/1042/return/done",
      transport: "soft",
      tone: "leaf",
      prompt: "You’re set",
      body: "Return label queued (demo). Use the breadcrumb or parent edge to walk back up the decision backbone.",
    },
    security: {
      id: "security",
      title: "Login & security",
      shortTitle: "Security",
      route: "/account/security",
      transport: "soft",
      tone: "leaf",
      prompt: "Security settings",
      body: "Password, 2FA, and trusted devices would live here. Stub leaf — Orders is the deep path.",
    },
    payments: {
      id: "payments",
      title: "Payment methods",
      shortTitle: "Payments",
      route: "/account/payments",
      transport: "soft",
      tone: "leaf",
      prompt: "Payment methods",
      body: "Cards and wallets (stub). The armed zone still keeps marketing chrome outside this hierarchy.",
    },
    addresses: {
      id: "addresses",
      title: "Addresses",
      shortTitle: "Addresses",
      route: "/account/addresses",
      transport: "soft",
      tone: "leaf",
      prompt: "Shipping addresses",
      body: "Address book stub. Virtual pages only arm where decision depth beats a flat icon grid.",
    },
  },
};
