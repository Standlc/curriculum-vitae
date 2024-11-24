/**
 * - Unique viewers
 * - Total views
 * - Average watch time
 * - views by country
 * - last 30 days views per day
 * - referer
 */

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Doughnut, Line } from "react-chartjs-2";
import "chart.js/auto";
import { Analytics as AnalyticsType } from "@/backend/apiTypes";
import { ReactElement } from "react";
import AnalyticsLayout from "@/components/AnalyticsLayout";

const Analytics = () => {
  const anaylytics = useQuery<AnalyticsType>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await axios.get("/api/analytics");
      console.log(res.data);
      return res.data;
    },
  });

  if (anaylytics.isLoading || !anaylytics.data) {
    return null;
  }

  return (
    <div className="font-mono max-w-[800px] m-auto min-h-screen p-10 flex flex-col gap-5">
      <h1 className="font-bold text-3xl">Analytics</h1>
      <div className="border border-[rgba(255,255,255,0.1)] rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.3)] p-5 bg-[rgba(255,255,255,0.02)] aspect-[5/3]">
        <Line
          data={{
            labels: anaylytics.data.last_30_days.map((d: any) => d.date),
            datasets: [
              {
                label: "Views",
                data: anaylytics.data.last_30_days.map((d: any) => d.count),
                tension: 0.1,
                // backgroundColor: "rgba(75,192,192,0.4)",
                // borderColor: "rgba(75,192,192,1)",
                // borderWidth: 4,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            responsive: true,
            aspectRatio: 5 / 3,
            scales: {
              y: {
                beginAtZero: true,
                grace: "200%",
                ticks: {
                  stepSize: 1,
                },
                grid: {
                  color: "rgba(255,255,255,0.05)",
                },
              },
              x: {
                ticks: {
                  // display: false,
                  // stepSize: 1,
                  // autoSkipPadding: 50,
                },
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      </div>

      <div className="flex gap-5">
        <div className="border border-[rgba(255,255,255,0.1)] flex-1 aspect-square rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.3)] p-5 bg-[rgba(255,255,255,0.02)]">
          <Doughnut
            data={{
              labels: anaylytics.data.top_countries
                .map((c) => c.country)
                .concat("Rest"),
              datasets: [
                {
                  data: anaylytics.data.top_countries.map((c) => c.count),
                  label: "Views by country",
                  borderColor: "rgba(255,255,255,0)",
                  backgroundColor: [
                    "rgba(255,99,132,1)",
                    "rgba(54,162,235,1)",
                    "rgba(255,206,86,1)",
                    "rgba(75,192,192,1)",
                    "rgba(153,102,255,1)",
                    "rgba(255,255,255,0.5)",
                  ],
                },
              ],
            }}
          />
        </div>
        <div className="border border-[rgba(255,255,255,0.1)] flex-1 aspect-square rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.3)] p-5 bg-[rgba(255,255,255,0.02)]">
          <Doughnut
            data={{
              labels: anaylytics.data.top_referrers.map((c) => c.referrer),
              datasets: [
                {
                  data: anaylytics.data.top_referrers.map((c) => c.count),
                  label: "Visits by referrer",
                  borderColor: "rgba(255,255,255,0)",
                  backgroundColor: [
                    "rgba(255,99,132,1)",
                    "rgba(54,162,235,1)",
                    "rgba(255,206,86,1)",
                    "rgba(75,192,192,1)",
                    "rgba(153,102,255,1)",
                  ],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

Analytics.getLayout = function getLayout(page: ReactElement) {
  return <AnalyticsLayout>{page}</AnalyticsLayout>;
};

export default Analytics;
