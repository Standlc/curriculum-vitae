import { useAnimateOnScreen } from "@/useAnimateOnScreen";

export default function Background() {
  const { element } = useAnimateOnScreen({ entranceRatio: 0.8, unique: true });

  return (
    <div
      className="min-h-screen py-20 w-full flex justify-center flex-col gap-10"
      id="background"
    >
      <h1 ref={element as any} className="font-bold text-3xl">
        A Bit Of Backgound
      </h1>
      <div className="font-mono opacity-text flex flex-col gap-5 text-base">
        {[
          "I was born in Paris in 2001. I currently reside in Chambéry in France\
          and study computer science at school 42 in Paris.",
          " After high school, I initially studied design in Lyon in 2020 but quit\
          in the first year to pursue coding. The following year I was able to\
          find a job as a front-end developer in a French company and worked for\
          half a year, getting professional experience and discovering how real\
          world applications function.",
          " After successfully passing the 'Piscine' entrance concour in Paris, I\
          entered 42 in November 2022 hoping to learn more about software\
          engineering and meeting more people with the same passion as mine.",
          "I now aspire to leave my mark in the world by building usefull\
          software to people.",
        ].map((text, i) => (
          <Paragraph key={i} text={text} />
        ))}
      </div>
    </div>
  );
}

const Paragraph = ({ text }: { text: string }) => {
  const { element } = useAnimateOnScreen({
    entranceRatio: 0.8,
    unique: true,
  });

  return <p ref={element as any}>{text}</p>;
};
