/** Decision-backbone model — route-subtree friendly, framework-agnostic. */

export interface DecisionChoice {
  label: string;
  childId: string;
  hint?: string;
}

/** How this step was (or would be) delivered — chrome treats both as one stack. */
export type NavTransport = "soft" | "hard";

export interface DecisionNode {
  id: string;
  title: string;
  /** Short line for breadcrumbs / stack previews */
  shortTitle: string;
  /** Route-shaped id for shareable URLs (SPA or real document). */
  route: string;
  /** What this step is asking the user to decide */
  prompt: string;
  /** Body copy when this node is current */
  body: string;
  choices?: DecisionChoice[];
  /**
   * soft = in-app route (no full document load); hard = real navigation.
   * Virtual-pages chrome should look the same either way.
   */
  transport?: NavTransport;
  /** Preview tone for stack cards (CSS token key) */
  tone?: "root" | "branch" | "leaf";
}

/** Path from armed root → current node (inclusive). */
export type DecisionPath = DecisionNode[];

export interface DecisionTree {
  /** First node inside the armed sub-hierarchy (not the marketing shell). */
  rootId: string;
  nodes: Record<string, DecisionNode>;
}

export function getNode(tree: DecisionTree, id: string): DecisionNode {
  const n = tree.nodes[id];
  if (!n) throw new Error(`Unknown decision node: ${id}`);
  return n;
}

/** Build path from armed root to `leafId` by walking parent links encoded in choices. */
export function pathTo(tree: DecisionTree, leafId: string): DecisionPath {
  const parentOf = new Map<string, string>();
  for (const node of Object.values(tree.nodes)) {
    for (const c of node.choices ?? []) {
      parentOf.set(c.childId, node.id);
    }
  }
  const ids: string[] = [];
  let cur: string | undefined = leafId;
  while (cur) {
    ids.unshift(cur);
    if (cur === tree.rootId) break;
    cur = parentOf.get(cur);
  }
  if (ids[0] !== tree.rootId) {
    throw new Error(`Node ${leafId} is outside the armed tree rooted at ${tree.rootId}`);
  }
  return ids.map((id) => getNode(tree, id));
}

export function parentId(tree: DecisionTree, id: string): string | null {
  if (id === tree.rootId) return null;
  for (const node of Object.values(tree.nodes)) {
    for (const c of node.choices ?? []) {
      if (c.childId === id) return node.id;
    }
  }
  return null;
}
