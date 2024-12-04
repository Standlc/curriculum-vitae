import { Language } from "@mui/icons-material";
import { Card, ListItem } from "./Components";

export const CountriesCard = ({
  countries,
  total_visits_count,
}: {
  countries: { count: number; country: string }[];
  total_visits_count: number;
}) => {
  return (
    <Card className="flex-1 min-w-[300px]">
      <div className="-m-5 -mb-0 px-5 py-3 border-b border-white border-opacity-10 flex items-center gap-2">
        <Language fontSize="small" />
        <h1 className="text-xs font-medium uppercase opacity-text">
          Countries
        </h1>
      </div>

      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-scroll -mx-2 -mb-2 pt-3">
        {!countries.length ? (
          <div className="opacity-text text-lg min-h-[inherit] w-full flex items-center justify-center">
            No data
          </div>
        ) : (
          countries.map((c) => (
            <ListItem
              key={c.country}
              name={c.country}
              count={`${Math.floor((c.count / total_visits_count) * 100)}%`}
              percentage={() => (c.count / total_visits_count) * 100}
            />
          ))
        )}
      </div>
    </Card>
  );
};
