export const Card = ({
  children,
  className,
}: {
  children: any;
  className?: string;
}) => {
  return (
    <div
      className={`overflow-hidden w-full border relative border-[rgba(255,255,255,0.1)] rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.5)] p-5 bg-white bg-opacity-[0] ${className}`}
    >
      {children}
    </div>
  );
};

export const ListItem = ({
  name,
  icon,
  count,
  percentage,
  className,
}: {
  name: string;
  count: number | string;
  percentage: () => void;
  className?: string;
  icon?: any;
}) => {
  return (
    <div
      className={`flex items-center justify-between py-1 px-2 relative hover:bg-[rgba(255,255,255,0.05)] cursor-pointer rounded-[4px] transition-colors ${className}`}
    >
      <div
        className="bg-[white] bg-opacity-[0.07] h-full w-full absolute left-0 top-0 rounded-[4px]"
        style={{ width: `${percentage()}%` }}
      ></div>

      <div className="flex items-center justify-between relative w-full h-full">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm">{name}</span>
        </div>
        <span className="text-sm">{count}</span>
      </div>
    </div>
  );
};
