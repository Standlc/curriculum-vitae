import { Share } from "@mui/icons-material";
import { Card, ListItem } from "./Components";

export const getDomainName = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname;
  } catch (err) {
    console.error(err);
    return url;
  }
};

export const ReferrersCard = ({
  referrers,
  total_visits_count,
}: {
  referrers: { count: number; referrer: string }[];
  total_visits_count: number;
}) => {
  return (
    <Card className="flex-1 min-w-[300px]">
      <div className="-m-5 -mb-0 px-5 py-3 border-b border-white border-opacity-10 flex items-center gap-2">
        <Share fontSize="small" />
        <h1 className="opacity-text text-xs font-medium uppercase">
          Referrers
        </h1>
      </div>

      <div className="flex flex-col gap-2 max-h-[300px] min-h-[200px] overflow-y-scroll -mx-2 -mb-2 pt-3">
        {!referrers.length ? (
          <div className="opacity-text text-lg min-h-[inherit] w-full flex items-center justify-center">
            No data
          </div>
        ) : (
          referrers.map((r) => (
            <ListItem
              key={r.referrer}
              name={getDomainName(r.referrer)}
              count={r.count}
              percentage={() => (r.count / total_visits_count) * 100}
              // icon={
              //   <div className="h-[16px] w-[16px]">
              //     <img src={`${r.referrer}/favicon.ico`} alt="favicon" />
              //   </div>
              // }
            />
          ))
        )}
      </div>
    </Card>
  );
};
