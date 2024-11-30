import { Devices } from "@mui/icons-material";
import { Card, ListItem } from "./Components";

export const DevicesCard = ({
  devices,
  total_visits_count,
}: {
  devices: { type: string | null; count: number }[];
  total_visits_count: number;
}) => {
  return (
    <Card>
      <div className="w-full h-full">
        <div className="-m-5 -mb-0 px-5 py-3 border-b border-white border-opacity-10 flex items-center gap-2">
          <Devices fontSize="small" />
          <h1 className="opacity-text text-xs font-medium uppercase">
            Devices
          </h1>
        </div>

        <div className="flex flex-col gap-2 max-h-[400px] h-full overflow-y-scroll -mx-2 -mb-2 pt-3">
          {!devices.length ? (
            <div className="opacity-text text-lg h-full w-full flex items-center justify-center">
              No data
            </div>
          ) : (
            devices.map((d) => (
              <ListItem
                key={d.type}
                name={d.type ?? "Unknown"}
                count={`${Math.floor((d.count / total_visits_count) * 100)}%`}
                percentage={() => (d.count / total_visits_count) * 100}
              />
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
