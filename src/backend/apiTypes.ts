import zod from "zod";

export interface Analytics {
  last_30_days: {
    date: string;
    count: number;
  }[];
  countries: {
    country: string;
    count: number;
  }[];
  referrers: {
    referrer: string;
    count: number;
  }[];
  unique_visits_count: number;
  total_visits_count: number;
}

export const VisitCreateSchema = zod.object({
  time: zod.string(),
  referrer: zod.string(),
});

export const VisitUpdateSchema = zod.object({
  time: zod.string(),
});

export const VisiterSchema = zod.object({
  id: zod.string(),
  sessionId: zod.number().or(zod.undefined()),
});

export type VisitCreateType = zod.infer<typeof VisitCreateSchema>;
export type VisitUpdateType = zod.infer<typeof VisitUpdateSchema>;
export type VisiterType = zod.infer<typeof VisiterSchema>;
