export default function Burger({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <div
      onClick={() => {
        onClick();
      }}
      className={`${
        isOpen ? "translate-x-[3px]" : ""
      } cursor-pointer flex flex-col items-end gap-[5px] justify-center opacity-70 [transition:transform_0.5s_cubic-bezier(0.5,0,0,1.3)] p-2`}
    >
      <div
        className={`${
          isOpen ? "rotate-[45deg]" : ""
        } w-[20px] h-[2px] bg-white rounded-full origin-left [transition:transform_0.5s_cubic-bezier(0.5,0,0,1.3)]`}
      ></div>
      <div
        className={`${
          isOpen ? "opacity-0 scale-0" : ""
        } w-[14px] h-[2px] bg-white rounded-full [transition:transform_0.5s_cubic-bezier(0.5,0,0,1.3),opacity_0.5s_cubic-bezier(0.5,0,0,1.3)]`}
      ></div>
      <div
        className={`${
          isOpen ? "rotate-[-45deg]" : ""
        } w-[20px] h-[2px] bg-white rounded-full origin-left [transition:transform_0.5s_cubic-bezier(0.5,0,0,1.3)]`}
      ></div>
    </div>
  );
}
