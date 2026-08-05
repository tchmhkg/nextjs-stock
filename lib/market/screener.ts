import { z } from "zod";

/** Yahoo predefined screener ids we expose. */
export const SCREENER_LIST_IDS = [
  "day_gainers",
  "day_losers",
  "most_actives",
] as const;

export type ScreenerListId = (typeof SCREENER_LIST_IDS)[number];

export const DEFAULT_SCREENER_COUNT = 8;

export const screenerListSchema = z.enum(SCREENER_LIST_IDS);
