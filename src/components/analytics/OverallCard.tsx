import { Analytics } from "@/backend/apiTypes";
import { Card } from "./Components";
import { Equalizer } from "@mui/icons-material";
import { getDomainName } from "./ReferrersCard";
import { useGetTimeFromSeconds } from "@/hooks/useGetTimeFromSeconds";

export const OverallCard = ({ analytics }: { analytics: Analytics }) => {
  const avg_visit_time = useGetTimeFromSeconds(analytics.avg_visit_time ?? 0);

  return (
    <Card className="">
      <div className="-m-5 -mb-0 px-5 py-3 border-b border-white border-opacity-10 flex items-center gap-2">
        <Equalizer fontSize="small" />
        <h1 className="opacity-text text-xs font-medium uppercase">
          All Time Analytics
        </h1>
      </div>

      <div className="overflow-x-scroll">
        <div className="flex gap-5 justify-evenly items-center pt-5 min-w-[700px]">
          <div className="flex flex-col gap-0 h-full justify-center">
            <span className="text-xl font-semibold">
              {analytics.total_visits_count ?? 0}
            </span>
            <span className="opacity-text">Total visits</span>
          </div>

          <div className="w-[1px] h-[30px] bg-white bg-opacity-10"></div>

          <div className="flex flex-col gap-0 h-full justify-center">
            <span className="text-xl font-semibold">
              {analytics.unique_visits_count}
            </span>
            <span className="opacity-text">Unique visiters</span>
          </div>

          <div className="w-[1px] h-[30px] bg-white bg-opacity-10"></div>

          <div className="flex flex-col gap-0 h-full justify-center">
            <span className="text-xl font-semibold">
              {analytics.avg_visit_time !== null ? (
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
                  ) : null}
                </>
              ) : (
                "No data"
              )}
            </span>
            <span className="opacity-text">Average visit time</span>
          </div>

          <div className="w-[1px] h-[30px] bg-white bg-opacity-10"></div>

          <div className="flex flex-col gap-0 h-full justify-center">
            <span className="text-xl font-semibold">
              {analytics.referrers[0]
                ? getDomainName(analytics.referrers[0].referrer)
                : "No data"}
            </span>
            <span className="opacity-text">
              Top traffic source{" "}
              {!!analytics.referrers[0] &&
                `(${Math.floor(
                  (analytics.referrers[0].count /
                    analytics.total_visits_count) *
                    100
                )}%)`}
            </span>
          </div>

          <div className="w-[1px] h-[30px] bg-white bg-opacity-10"></div>

          <div className="flex flex-col gap-0 h-full justify-center">
            <span className="text-xl font-semibold capitalize">
              {analytics.devices[0]?.type ?? "No data"}
            </span>
            <span className="opacity-text">
              Mostly used{" "}
              {!!analytics.devices[0] &&
                `(${Math.floor(
                  (analytics.devices[0].count / analytics.total_visits_count) *
                    100
                )}%)`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
