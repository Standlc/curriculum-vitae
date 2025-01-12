import { useAnimateOnScreen } from "@/hooks/useAnimateOnScreen";

export default function Background() {
  const { element } = useAnimateOnScreen({ entranceRatio: 0.8, unique: true });

  return (
    <div
      className="min-h-screen py-20 w-full flex justify-center flex-col gap-10"
      id="background"
    >
      <h1 ref={element as unknown as undefined} className="font-bold text-3xl">
        A Bit Of Background
      </h1>
      <div className="font-mono opacity-text flex flex-col gap-5 text-base">
        {[
          "I currently live in Paris, where I study computer science at School 42 and work as a software engineer at <https://getnao.io|nao labs>, building a code editor for data work.",
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
  const hasLink = text.includes("<https://");

  if (!hasLink) {
    return <p ref={element as unknown as undefined}>{text}</p>;
  }

  const linkStart = text.indexOf("<https://");
  const linkEnd = text.indexOf("|", linkStart);
  const link = text.substring(linkStart + 1, linkEnd);
  const linkLabel = text.substring(linkEnd + 1, text.indexOf(">", linkEnd));

  return (
    <p ref={element as unknown as undefined}>
      <span>{text.slice(0, linkStart)}</span>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {linkLabel}
      </a>
      <span>{text.slice(text.indexOf(">", linkEnd) + 1)}</span>
    </p>
  );
};
