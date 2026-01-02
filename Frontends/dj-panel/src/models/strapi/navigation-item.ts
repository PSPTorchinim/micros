import type { PageAuthStateEnum1, PageMenuEnum1, PageNavigationActionEnum1 } from "../api/strapi/apiMap";

export type NavigationItem = {
  id: number;
  text: string;
  url: string;
  children?: NavigationItem[];
  NavigationOrder: number;
  Menu: PageMenuEnum1;
  AuthState: PageAuthStateEnum1;
  NavigationAction?: PageNavigationActionEnum1;
};