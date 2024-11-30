import zod from "zod";

export interface Analytics {
  analyticsOverSomeTime: AnalyticsOverSomeTime;
  countries: {
    country: string;
    count: number;
  }[];
  referrers: {
    referrer: string;
    count: number;
  }[];
  devices: {
    type: string | null;
    count: number;
  }[];
  avg_visit_time: number | null;
  unique_visits_count: number;
  total_visits_count: number;
}

export type AnalyticsOverSomeTime = {
  visits_per_day: DayAnalytics[];
  analytics: PeriodAnalytics | null;
  timePeriod: AnalyticsTimeOptionsType;
};

export type DayAnalytics = {
  date: string;
  visits_count: number;
  visiters_count: number;
};

export type PeriodAnalytics = {
  top_referrer: string | null;
  top_referrer_count: number | null;
  top_device: string | null;
  top_device_count: number | null;
  avg_visit_time: number | null;
  visitors_count: number | null;
  visits_count: number | null;
  new_visitors_count: number | null;
};

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

export const AnalyticsTimeOptions = [7, 30, 365] as const;
export type AnalyticsTimeOptionsType = (typeof AnalyticsTimeOptions)[number];
