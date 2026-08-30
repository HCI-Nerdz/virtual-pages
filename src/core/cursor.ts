import type { DecisionPath, DecisionTree } from "./types";
import { getNode, parentId, pathTo } from "./types";

export type NavListener = (path: DecisionPath) => void;

/** Mutable cursor along a decision backbone (armed subtree). */
export class DecisionCursor {
  private path: DecisionPath;
  private listeners = new Set<NavListener>();

  constructor(
    readonly tree: DecisionTree,
    startId?: string,
  ) {
    this.path = pathTo(tree, startId ?? tree.rootId);
  }

  get current() {
    return this.path[this.path.length - 1];
  }

  get stack(): DecisionPath {
    return this.path.slice();
  }

  depth(): number {
    return this.path.length;
  }

  subscribe(fn: NavListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    const snap = this.stack;
    for (const fn of this.listeners) fn(snap);
  }

  goTo(id: string) {
    this.path = pathTo(this.tree, id);
    this.emit();
  }

  choose(childId: string) {
    const allowed = (this.current.choices ?? []).some((c) => c.childId === childId);
    if (!allowed) throw new Error(`${childId} is not a choice of ${this.current.id}`);
    this.path = [...this.path, getNode(this.tree, childId)];
    this.emit();
  }

  up(levels = 1) {
    const next = Math.max(1, this.path.length - levels);
    this.path = this.path.slice(0, next);
    this.emit();
  }

  upTo(id: string) {
    const idx = this.path.findIndex((n) => n.id === id);
    if (idx < 0) throw new Error(`${id} is not on the current path`);
    this.path = this.path.slice(0, idx + 1);
    this.emit();
  }

  canUp(): boolean {
    return parentId(this.tree, this.current.id) !== null;
  }
}
