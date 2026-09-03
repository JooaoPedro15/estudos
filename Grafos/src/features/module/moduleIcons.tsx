import { Waypoints, Grid3x3, Shuffle, Search, Route, BookOpen, type LucideIcon } from 'lucide-react';

export const MODULE_ICON: Record<string, LucideIcon> = {
  graph: Waypoints,
  matrix: Grid3x3,
  shuffle: Shuffle,
  search: Search,
  route: Route,
};

export function moduleIcon(icon: string): LucideIcon {
  return MODULE_ICON[icon] ?? BookOpen;
}
