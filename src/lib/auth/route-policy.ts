export const ROUTE_POLICIES = [
  "public",
  "guest_only",
  "onboarding",
  "protected",
  "locale_entry",
  "workspace_entry",
] as const;

export type RoutePolicy = (typeof ROUTE_POLICIES)[number];
