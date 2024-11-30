import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "chart.js/auto";
import { Analytics as AnalyticsType } from "@/backend/apiTypes";
import { ReactElement } from "react";
import AnalyticsLayout from "@/components/AnalyticsLayout";
import { ReferrersCard } from "@/components/analytics/ReferrersCard";
import { CountriesCard } from "@/components/analytics/CountriesCard";
import { OverallCard } from "@/components/analytics/OverallCard";
import { DevicesCard } from "@/components/analytics/DevicesCard";
import { VisitsGraph } from "@/components/analytics/VisitsGraph";

const Analytics = () => {
  const anaylytics = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await axios.get<AnalyticsType>("/api/analytics");
      return res.data;
    },
  });

  if (anaylytics.isLoading || !anaylytics.data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center animate-fade-in-basic">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="font-mono max-w-[900px] m-auto min-h-screen p-5 flex flex-col gap-5 text-sm animate-fade-in">
      <h1 className="font-bold text-2xl">Analytics</h1>

      <OverallCard analytics={anaylytics.data} />

      <DevicesCard
        devices={anaylytics.data.devices}
        total_visits_count={anaylytics.data.total_visits_count}
      />

      <VisitsGraph analytics={anaylytics.data.analyticsOverSomeTime} />

      <div className="flex gap-5">
        <CountriesCard
          countries={anaylytics.data.countries}
          total_visits_count={anaylytics.data.total_visits_count}
        />

        <ReferrersCard
          referrers={anaylytics.data.referrers}
          total_visits_count={anaylytics.data.total_visits_count}
        />
      </div>
    </div>
  );
};

Analytics.getLayout = function getLayout(page: ReactElement) {
  return <AnalyticsLayout>{page}</AnalyticsLayout>;
};

export default Analytics;
