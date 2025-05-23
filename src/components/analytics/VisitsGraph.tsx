import {
  AnalyticsOverSomeTime,
  AnalyticsTimeOptions,
  AnalyticsTimeOptionsType,
} from "@/backend/apiTypes";
import { Card } from "./Components";
import { Line } from "react-chartjs-2";
import { useGetTimeFromSeconds } from "@/hooks/useGetTimeFromSeconds";
import { getDomainName } from "./ReferrersCard";
import { KeyboardArrowDown, TrendingUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatDate = (str: string, dataLen: number) => {
  const date = new Date(str);
  if (dataLen >= 365) {
    return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
};

const fillMissingGraphDays = (
  analytics: AnalyticsOverSomeTime
): AnalyticsOverSomeTime => {
  const timePeriod = analytics.timePeriod;

  const lastNDays = Array(timePeriod)
    .fill(0)
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (timePeriod - 1 - i));
      return date.toDateString();
    });

  analytics.visits_per_day = analytics.visits_per_day.map((v) => {
    return {
      ...v,
      date: new Date(v.date)?.toDateString(),
    };
  });

  analytics.visits_per_day = lastNDays.map((day) => {
    const visitsThatDay = analytics.visits_per_day.find((v) => day === v.date);
    if (visitsThatDay) {
      return visitsThatDay;
    }
    return {
      date: day,
      visitors_count: 0,
      visits_count: 0,
    };
  });

  return analytics;
};

export const VisitsGraph = ({
  analytics,
}: {
  analytics: AnalyticsOverSomeTime;
}) => {
  const avg_visit_time = useGetTimeFromSeconds(analytics.avg_visit_time ?? 0);
  const [timeOption, setTimeOption] = useState<
    AnalyticsTimeOptionsType | undefined
  >(undefined);
  const queryClient = useQueryClient();
  const router = useRouter();

  const analyticsQuery = useQuery<AnalyticsOverSomeTime, AxiosError>({
    queryKey: ["analytics-time-option", timeOption],
    queryFn: async () => {
      const res = await axios.get<AnalyticsOverSomeTime>(
        `/api/analytics?time=${timeOption}`
      );
      return res.data;
    },
    enabled: !!timeOption,
    placeholderData: (prev) => prev ?? analytics,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 1,
    select: (data) => fillMissingGraphDays(data),
  });

  useEffect(() => {
    queryClient.setQueryData(
      ["analytics-time-option", analytics.timePeriod],
      analytics
    );
  }, [analytics, queryClient]);

  useEffect(() => {
    if (analyticsQuery.error?.status === 401) {
      router.push("/login");
    }
  }, [analyticsQuery.error, router]);

  const graphData = analyticsQuery.data?.visits_per_day;

  if (!graphData || !analyticsQuery.data) {
    return null;
  }

  return (
    <Card>
      {analyticsQuery.isFetching && (
        <div className="h-full w-full flex items-center justify-center absolute top-0 left-0 bg-black bg-opacity-30 animate-fade-in-basic">
          <div className="loader"></div>
        </div>
      )}

      <div className="-m-5 px-5 py-3 border-b border-white border-opacity-10 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp fontSize="small" />
          <h1 className="opacity-text text-xs font-medium uppercase">
            Visits in the last
          </h1>

          <div className="relative flex items-center">
            <select
              className="bg-transparent cursor-pointer outline-none border border-white border-opacity-10 text-white text-xs px-2 pr-[22px] py-1 rounded-md appearance-none"
              defaultValue={timeOption ?? "30"}
              name="time"
              id=""
              disabled={analyticsQuery.isFetching}
              onChange={(e) => {
                const timePeriod = Number(e.target.value);
                if (AnalyticsTimeOptions.includes(timePeriod as any)) {
                  setTimeOption(timePeriod as AnalyticsTimeOptionsType);
                }
              }}
            >
              <option className="uppercase" value="7">
                WEEK
              </option>
              <option value="30">30 DAYS</option>
              <option value="365">YEAR</option>
            </select>

            <div className="absolute right-[2px] pointer-events-none">
              <KeyboardArrowDown fontSize="small" />
            </div>
          </div>
        </div>

        <div className="border-t border-white border-opacity-10 pt-3 overflow-x-scroll -mx-5">
          <div className="flex gap-4 items-center justify-evenly min-w-[550px] mx-5">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold leading-tight">
                +{analyticsQuery.data.visits_count ?? 0}
              </h1>
              <span className="font-normal opacity-text text-xs">Visits</span>
            </div>

            <div className="w-[1px] h-[20px] bg-white bg-opacity-10"></div>

            <div className="flex flex-col">
              <h1 className="text-lg font-semibold leading-tight">
                +{analyticsQuery.data.new_visitors_count ?? 0}
              </h1>
              <span className="font-normal opacity-text text-xs">
                New visitors
              </span>
            </div>

            <div className="w-[1px] h-[20px] bg-white bg-opacity-10"></div>

            <div className="flex flex-col text-lg font-semibold">
              <div className="leading-tight">
                {analyticsQuery.data.avg_visit_time !== null ? (
                  <>
                    {avg_visit_time.hours ? (
                      <span>
                        {avg_visit_time.hours}
                        <span className="text-sm">h</span>
                      </span>
                    ) : null}{" "}
                    {avg_visit_time.minutes ? (
                      <span>
                        {avg_visit_time.minutes}
                        <span className="text-sm">m</span>
                      </span>
                    ) : null}{" "}
                    {avg_visit_time.seconds ? (
                      <span>
                        {avg_visit_time.seconds}
                        <span className="text-sm">s</span>
                      </span>
                    ) : null}{" "}
                  </>
                ) : (
                  "No data"
                )}
              </div>
              <span className="font-normal opacity-text text-xs">
                Avg. visit time
              </span>
            </div>

            <div className="w-[1px] h-[20px] bg-white bg-opacity-10"></div>

            <div className="flex flex-col">
              <h1 className="text-lg font-semibold leading-tight">
                {analyticsQuery.data.top_referrer
                  ? getDomainName(analyticsQuery.data.top_referrer)
                  : "No data"}
              </h1>
              <span className="font-normal opacity-text text-xs">
                Top traffic src.{" "}
                {analyticsQuery.data.top_referrer_count !== null &&
                  `(${Math.floor(
                    (analyticsQuery.data.top_referrer_count /
                      (analyticsQuery.data.visits_count ?? 1)) *
                      100
                  )}%)`}
              </span>
            </div>

            <div className="w-[1px] h-[20px] bg-white bg-opacity-10"></div>

            <div className="flex flex-col">
              <h1 className="text-lg font-semibold leading-tight">
                {analyticsQuery.data.top_device ?? "No data"}
              </h1>
              <span className="font-normal opacity-text text-xs">
                Mostly used{" "}
                {analyticsQuery.data.top_device_count !== null &&
                  `(${Math.floor(
                    (analyticsQuery.data.top_device_count /
                      (analyticsQuery.data.visits_count ?? 1)) *
                      100
                  )}%)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Line
        data={{
          labels: graphData.map((d) => d.date),
          datasets: [
            {
              label: "Visits",
              data: graphData.map((d) => d.visits_count),
              tension: 0.05,
              borderWidth: 2,
              borderColor: "rgb(30 100 200)",
            },
            {
              label: "Visitors",
              data: graphData.map((d) => d.visitors_count),
              tension: 0.05,
              borderWidth: 0,
              fill: true,
              backgroundColor: "rgba(30,100,200,0.2)",
            },
          ],
        }}
        options={{
          elements: {
            point: {
              radius: 0,
              hitRadius: 20,
            },
          },

          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                title: (d) => {
                  const date = new Date(d[0].label);
                  return date.toDateString();
                },
              },
              cornerRadius: 10,
              bodySpacing: 10,
              usePointStyle: true,
              titleColor: "rgba(255,255,255,0.5)",
              titleFont: {
                size: 12,
                weight: "normal",
              },
              borderColor: "rgba(255,255,255,0.1)",
              borderWidth: 1,
              backgroundColor: "rgba(0,0,0,1)",
              padding: 10,
            },
          },
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grace: "30%",
              ticks: {
                maxTicksLimit: 5,
              },
              grid: {
                color: "rgba(255,255,255,0.05)",
              },
            },
            x: {
              ticks: {
                padding: 0,
                maxRotation: 0,
                callback: function (_, i) {
                  const n_labels = window.innerWidth < 600 ? 4 : 5;
                  const modulo = Math.ceil(graphData.length / n_labels);
                  const offset = Math.round(graphData.length * 0.1);
                  if ((i + offset) % modulo === 0) {
                    return formatDate(graphData[i].date, graphData.length);
                  }
                  return null;
                },
              },
              grid: {
                display: false,
              },
            },
          },
        }}
      />
    </Card>
  );
};
