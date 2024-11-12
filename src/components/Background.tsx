export default function Background() {
  return (
    <div className="h-screen w-full flex justify-center flex-col gap-5">
      <h1 className="font-sans font-bold text-3xl">A Bit Of Backgound</h1>
      <div className="font-mono opacity-85 flex flex-col gap-5 text-base">
        <p>
          I was born in Paris in 2001. I currently reside in Chambéry in France
          and study computer science at school 42 in Paris.
        </p>
        <p>
          After high school, I initially studied design in Lyon in 2020 but quit
          in the first year to pursue coding. The following year I was able to
          find a job as a front-end developer in a French company and worked for
          half a year, getting professional experience and discovering how real
          world applications function.
        </p>
        <p>
          After successfully passing the 'Piscine' entrance concour in Paris, I
          entered 42 in November 2022 hoping to learn more about software
          engineering and meeting more people with the same passion as mine.
        </p>
        <p>
          I now aspire to leave my mark in the world by building usefull
          software to people.
        </p>
      </div>
    </div>
  );
}
