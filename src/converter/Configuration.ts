// eslint-disable-next-line no-shadow
enum Location {
  Top = 'Top',
  Left = 'Left',
  Bottom = 'Bottom',
  Right = 'Right',
}

// eslint-disable-next-line no-shadow
enum AlignmentInLevel {
  Center = 'Center',
  TowardsRoot = 'TowardsRoot',
  AwayFromRoot = 'AwayFromRoot',
}

class Configuration {
  gapBetweenLevels: number = 50.0;
  gapBetweenNodes: number = 50.0;
  location: Location = Location.Top;
  alignmentInLevel: AlignmentInLevel = AlignmentInLevel.Center;
}

export { Configuration, Location, AlignmentInLevel };
