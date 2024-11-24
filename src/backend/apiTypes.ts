export interface Analytics {
  last_30_days: {
    date: string;
    count: number;
  }[];
  top_countries: {
    country: string;
    count: number;
  }[];
  top_referrers: {
    referrer: string;
    count: number;
  }[];
  unique_visits_count: number;
  total_visits_count: number;
}
