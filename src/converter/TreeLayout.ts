import { AlignmentInLevel, Configuration, Location } from './Configuration';
import NodeBounds from './NodeBounds';
import NodeCalculation from './NodeCalculation';
import NormalizedPosition from './NormalizedPosition';

class TreeLayout {
  public static MIN_NODE_WIDTH: number = 70;
  public static MIN_NODE_HEIGHT: number = 50;

  private configuration: Configuration;
  private boundsLeft: number = Number.MAX_VALUE;
  private boundsTop: number = Number.MAX_VALUE;
  private boundsRight: number = Number.MIN_VALUE;
  private boundsBottom: number = Number.MIN_VALUE;
  private sizeOfLevel: number[] = [];

  private nodeBounds: Map<string, NodeBounds> = new Map();
  private mod: Map<string, number> = new Map();
  private thread: Map<string, NodeCalculation> = new Map();
  private prelim: Map<string, number> = new Map();
  private change: Map<string, number> = new Map();
  private shift: Map<string, number> = new Map();
  private ancestor: Map<string, NodeCalculation> = new Map();
  private number: Map<string, number> = new Map();
  private positions: Map<string, NormalizedPosition> = new Map();

  constructor(root: NodeCalculation) {
    this.configuration = new Configuration();

    const r: NodeCalculation = root;
    this.firstWalk(r, null);
    this.calcSizeOfLevels(r, 0);
    this.secondWalk(r, -this.getPrelim(r), 0, 0);
  }

  getNodeBounds(): Map<string, NodeBounds> {
    this.nodeBounds = new Map();
    for (const [node, pos] of this.positions.entries()) {
      const w: number = this.getNodeWidth();
      const h: number = this.getNodeHeight();
      const x: number = pos.getX(this.boundsLeft) - w / 2;
      const y: number = pos.getY(this.boundsTop) - h / 2;
      this.nodeBounds.set(node, { x, y, w, h });
    }
    return this.nodeBounds;
  }

  private getSizeOfLevel(level: number): number {
    if (level < 0 || level >= this.getLevelCount()) {
      throw new Error('level must be >= 0 and < levelCount');
    }

    return this.sizeOfLevel[level];
  }

  private getMod(node: NodeCalculation | null): number {
    if (!node) return 0;
    return this.mod.get(node.id) || 0;
  }

  private setMod(node: NodeCalculation | null, d: number): void {
    if (!node) return;
    this.mod.set(node.id, d);
  }

  private getThread(node: NodeCalculation): NodeCalculation | null {
    const n: NodeCalculation | undefined = this.thread.get(node.id);
    return n !== undefined ? n : null;
  }

  private setThread(
    node: NodeCalculation | null,
    thread: NodeCalculation
  ): void {
    if (!node) return;
    this.thread.set(node.id, thread);
  }

  private getAncestor(node: NodeCalculation): NodeCalculation {
    return this.ancestor.get(node.id) || node;
  }

  private setAncestor(
    node: NodeCalculation | null,
    ancestor: NodeCalculation
  ): void {
    if (!node) return;
    this.ancestor.set(node.id, ancestor);
  }

  private getPrelim(node: NodeCalculation | null): number {
    if (!node) return 0;
    return this.prelim.get(node.id) || 0;
  }

  private setPrelim(node: NodeCalculation, d: number): void {
    this.prelim.set(node.id, d);
  }

  private getChange(node: NodeCalculation): number {
    return this.change.get(node.id) || 0;
  }

  private setChange(node: NodeCalculation, d: number): void {
    this.change.set(node.id, d);
  }

  private getShift(node: NodeCalculation): number {
    return this.shift.get(node.id) || 0;
  }

  private setShift(node: NodeCalculation, d: number): void {
    this.shift.set(node.id, d);
  }

  private getDistance(v: NodeCalculation, w: NodeCalculation): number {
    const sizeOfNodes: number = this.getNodeSize(v) + this.getNodeSize(w);
    const distance: number =
      sizeOfNodes / 2 + this.configuration.gapBetweenNodes;
    return distance;
  }

  private nextLeft(v: NodeCalculation | null): NodeCalculation | null {
    if (!v) return null;
    return this.isLeaf(v) ? this.getThread(v) : this.getFirstChild(v);
  }

  private nextRight(v: NodeCalculation | null): NodeCalculation | null {
    if (!v) return null;
    return this.isLeaf(v) ? this.getThread(v) : this.getLastChild(v);
  }

  private getNumber(
    node: NodeCalculation,
    parentNode: NodeCalculation
  ): number {
    const n: number | undefined = this.number.get(node.id);
    if (!n) {
      let i: number = 1;
      for (const child of this.getChildren(parentNode)) {
        this.number.set(child.id, i);
        i += 1;
      }
      return this.number.get(node.id) || 0;
    }

    return n;
  }

  private getChildren(node: NodeCalculation): NodeCalculation[] {
    return node.children || [];
  }

  private detectAncestor(
    vIMinus: NodeCalculation,
    parentOfV: NodeCalculation,
    defaultAncestor: NodeCalculation
  ): NodeCalculation {
    const ancestor: NodeCalculation = this.getAncestor(vIMinus);
    return this.isChildOfParent(ancestor, parentOfV)
      ? ancestor
      : defaultAncestor;
  }

  private moveSubtree(
    wMinus: NodeCalculation,
    wPlus: NodeCalculation,
    parent: NodeCalculation,
    shift: number
  ): void {
    const subtrees: number =
      this.getNumber(wPlus, parent) - this.getNumber(wMinus, parent);
    this.setChange(wPlus, this.getChange(wPlus) - shift / subtrees);
    this.setShift(wPlus, this.getShift(wPlus) + shift);
    this.setChange(wMinus, this.getChange(wMinus) + shift / subtrees);
    this.setPrelim(wPlus, this.getPrelim(wPlus) + shift);
    this.setMod(wPlus, this.getMod(wPlus) + shift);
  }

  private apportion(
    v: NodeCalculation,
    defaultAncestor: NodeCalculation,
    leftSibling: NodeCalculation | null,
    parentOfV: NodeCalculation
  ): NodeCalculation {
    const w: NodeCalculation | null = leftSibling;

    if (w === null) {
      return defaultAncestor;
    }

    let vOPlus: NodeCalculation | null = v;
    let vIPlus: NodeCalculation = v;
    let vIMinus: NodeCalculation = w;
    let vOMinus: NodeCalculation | null = this.getFirstChild(parentOfV);

    let sIPlus: number = this.getMod(vIPlus);
    let sOPlus: number = this.getMod(vOPlus);
    let sIMinus: number = this.getMod(vIMinus);
    let sOMinus: number = this.getMod(vOMinus);

    let nextRightVIMinus: NodeCalculation | null = this.nextRight(vIMinus);
    let nextLeftVIPlus: NodeCalculation | null = this.nextLeft(vIPlus);

    while (nextRightVIMinus !== null && nextLeftVIPlus !== null) {
      vIMinus = nextRightVIMinus;
      vIPlus = nextLeftVIPlus;
      vOMinus = this.nextLeft(vOMinus);
      vOPlus = this.nextRight(vOPlus);

      this.setAncestor(vOPlus, v);
      const shift: number =
        this.getPrelim(vIMinus) +
        sIMinus -
        (this.getPrelim(vIPlus) + sIPlus) +
        this.getDistance(vIMinus, vIPlus);

      if (shift > 0) {
        this.moveSubtree(
          this.detectAncestor(vIMinus, parentOfV, defaultAncestor),
          v,
          parentOfV,
          shift
        );
        sIPlus += shift;
        sOPlus += shift;
      }

      sIMinus += this.getMod(vIMinus);
      sIPlus += this.getMod(vIPlus);
      sOMinus += this.getMod(vOMinus);
      sOPlus += this.getMod(vOPlus);

      nextRightVIMinus = this.nextRight(vIMinus);
      nextLeftVIPlus = this.nextLeft(vIPlus);
    }

    if (nextRightVIMinus !== null && this.nextRight(vOPlus) === null) {
      this.setThread(vOPlus, nextRightVIMinus);
      this.setMod(vOPlus, this.getMod(vOPlus) + sIMinus - sOPlus);
    }

    if (nextLeftVIPlus !== null && this.nextLeft(vOMinus) === null) {
      this.setThread(vOMinus, nextLeftVIPlus);
      this.setMod(vOMinus, this.getMod(vOMinus) + sIPlus - sOMinus);
      defaultAncestor = v;
    }

    return defaultAncestor;
  }

  private executeShifts(v: NodeCalculation): void {
    let shift: number = 0;
    let change: number = 0;

    for (const w of this.getChildrenReverse(v)) {
      change += this.getChange(w);
      this.setPrelim(w, this.getPrelim(w) + shift);
      this.setMod(w, this.getMod(w) + shift);
      shift += this.getShift(w) + change;
    }
  }

  private cloneMap<K, V>(originalMap: Map<K, V>): Map<K, V> {
    const clonedMap = new Map<K, V>();

    // Add all entries from the original map to the cloned map
    for (const [key, value] of originalMap.entries()) {
      clonedMap.set(key, value);
    }

    return clonedMap;
  }

  private firstWalk(
    v: NodeCalculation,
    leftSibling: NodeCalculation | null
  ): void {
    if (this.isLeaf(v)) {
      const w: NodeCalculation | null = leftSibling;
      if (w !== null) {
        this.setPrelim(v, this.getPrelim(w) + this.getDistance(v, w));
      }
    } else {
      let defaultAncestor: NodeCalculation | null = this.getFirstChild(v);
      let previousChild: NodeCalculation | null = null;

      if (!defaultAncestor) throw new Error('chunk.children.empty');

      for (const w of this.getChildren(v)) {
        this.firstWalk(w, previousChild);
        defaultAncestor = this.apportion(w, defaultAncestor, previousChild, v);
        previousChild = w;
      }

      this.executeShifts(v);

      const midpoint: number =
        (this.getPrelim(this.getFirstChild(v)) +
          this.getPrelim(this.getLastChild(v))) /
        2.0;

      const w: NodeCalculation | null = leftSibling;
      if (w !== null) {
        this.setPrelim(v, this.getPrelim(w) + this.getDistance(v, w));
        this.setMod(v, this.getPrelim(v) - midpoint);
      } else {
        this.setPrelim(v, midpoint);
      }
    }
  }

  private secondWalk(
    v: NodeCalculation,
    m: number,
    level: number,
    levelStart: number
  ): void {
    const levelChangeSign: number = this.getLevelChangeSign();
    const levelChangeOnYAxis: boolean = this.isLevelChangeInYAxis();
    const levelSize: number = this.getSizeOfLevel(level);

    let x: number = this.getPrelim(v) + m;

    let y: number;
    const alignment: AlignmentInLevel = this.configuration.alignmentInLevel;
    if (alignment === AlignmentInLevel.Center) {
      y = levelStart + levelChangeSign * (levelSize / 2);
    } else if (alignment === AlignmentInLevel.TowardsRoot) {
      y = levelStart + levelChangeSign * (this.getNodeThickness(v) / 2);
    } else {
      y =
        levelStart +
        levelSize -
        levelChangeSign * (this.getNodeThickness(v) / 2);
    }

    if (!levelChangeOnYAxis) {
      const t: number = x;
      x = y;
      y = t;
    }

    this.positions.set(v.id, new NormalizedPosition(x, y));

    this.updateBounds(x, y);

    if (!this.isLeaf(v)) {
      const nextLevelStart: number =
        levelStart +
        (levelSize + this.configuration.gapBetweenLevels) * levelChangeSign;

      for (const w of this.getChildren(v)) {
        this.secondWalk(w, m + this.getMod(v), level + 1, nextLevelStart);
      }
    }
  }

  private getNodeHeight(): number {
    return TreeLayout.MIN_NODE_HEIGHT;
  }

  private getNodeWidth(): number {
    return TreeLayout.MIN_NODE_WIDTH;
  }

  private getWidthOrHeightOfNode(returnWidth: boolean): number {
    return returnWidth ? this.getNodeWidth() : this.getNodeHeight();
  }

  private getNodeThickness(treeNode: NodeCalculation): number {
    return this.getWidthOrHeightOfNode(!this.isLevelChangeInYAxis());
  }

  private getNodeSize(treeNode: NodeCalculation): number {
    return this.getWidthOrHeightOfNode(this.isLevelChangeInYAxis());
  }

  private isLevelChangeInYAxis(): boolean {
    const rootLocation: Location = this.configuration.location;
    return rootLocation === Location.Top || rootLocation === Location.Bottom;
  }

  private getLevelChangeSign(): number {
    const rootLocation: Location = this.configuration.location;
    return rootLocation === Location.Bottom || rootLocation === Location.Right
      ? -1
      : 1;
  }

  private updateBounds(centerX: number, centerY: number): void {
    const width: number = this.getNodeWidth();
    const height: number = this.getNodeHeight();
    const left: number = centerX - width / 2;
    const right: number = centerX + width / 2;
    const top: number = centerY - height / 2;
    const bottom: number = centerY + height / 2;

    if (this.boundsLeft > left) {
      this.boundsLeft = left;
    }

    if (this.boundsRight < right) {
      this.boundsRight = right;
    }

    if (this.boundsTop > top) {
      this.boundsTop = top;
    }

    if (this.boundsBottom < bottom) {
      this.boundsBottom = bottom;
    }
  }

  private calcSizeOfLevels(node: NodeCalculation, level: number): void {
    let oldSize: number;
    if (this.sizeOfLevel.length <= level) {
      this.sizeOfLevel.push(0);
      oldSize = 0;
    } else {
      oldSize = this.sizeOfLevel[level];
    }

    const size: number = this.getNodeThickness(node);
    if (oldSize < size) {
      this.sizeOfLevel[level] = size;
    }

    if (!this.isLeaf(node)) {
      for (const child of this.getChildren(node)) {
        this.calcSizeOfLevels(child, level + 1);
      }
    }
  }

  private getLevelCount(): number {
    return this.sizeOfLevel.length;
  }

  private isLeaf(node: NodeCalculation): boolean {
    return this.getChildren(node).length === 0;
  }

  private isChildOfParent(
    node: NodeCalculation,
    parentNode: NodeCalculation
  ): boolean {
    return node.parent === parentNode;
  }

  private getChildrenReverse(node: NodeCalculation): Iterable<NodeCalculation> {
    const list: NodeCalculation[] = [...this.getChildren(node)];
    list.reverse();
    return list;
  }

  private getFirstChild(parentNode: NodeCalculation): NodeCalculation | null {
    const list = this.getChildren(parentNode);
    return list.length > 0 ? list[0] : null;
  }

  private getLastChild(parentNode: NodeCalculation): NodeCalculation | null {
    const list = this.getChildren(parentNode);
    return list.length > 0 ? list[list.length - 1] : null;
  }
}

export default TreeLayout;
