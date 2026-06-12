export const ROUTES = {
  HOME: "/",
  CODING: "/coding",
  SETTINGS: "/settings",
  LOGIN: "/login",
  REGISTER: "/register",
  RESULTS: "/results",
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];

export const ROUTE_TO_TAB: Record<string, string> = {
  [ROUTES.HOME]: "home",
  [ROUTES.CODING]: "coding",
  [ROUTES.SETTINGS]: "settings",
  [ROUTES.LOGIN]: "login",
  [ROUTES.REGISTER]: "register",
  [ROUTES.RESULTS]: "results",
};

export function pathToTabName(path: string): string {
  return ROUTE_TO_TAB[path] || "home";
}
