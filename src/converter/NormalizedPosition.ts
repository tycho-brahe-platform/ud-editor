class NormalizedPosition {
  private xRelativeToRoot: number;
  private yRelativeToRoot: number;

  constructor(xRelativeToRoot: number, yRelativeToRoot: number) {
    this.xRelativeToRoot = xRelativeToRoot;
    this.yRelativeToRoot = yRelativeToRoot;
  }

  getX(boundsLeft: number): number {
    return this.xRelativeToRoot - boundsLeft;
  }

  getY(boundsTop: number): number {
    return this.yRelativeToRoot - boundsTop;
  }
}

export default NormalizedPosition;
