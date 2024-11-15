import { useEffect, useRef, useState } from "react";

const useTypeWriter = ({
  originalText,
  hideCursor,
}: {
  originalText: string;
  hideCursor?: boolean;
}) => {
  const [isDone, setIsDone] = useState(false);
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [startWriting, setStartWriting] = useState(false);
  const showCursorIntervalId = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStartWriting(true);
    }, 1500);

    showCursorIntervalId.current = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearTimeout(timeoutId);

      if (showCursorIntervalId.current) {
        clearInterval(showCursorIntervalId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!startWriting) return;

    const intervalId = setInterval(() => {
      if (text.length === originalText.length) {
        if (hideCursor) {
          setShowCursor(false);
          clearInterval(showCursorIntervalId.current);
        }

        setIsDone(true);
        clearInterval(intervalId);
      }

      setText((prev) => {
        return originalText.slice(0, prev.length + 1);
      });
    }, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [text, startWriting, originalText, hideCursor]);

  return [showCursor, text, isDone];
};

export const TypeWriterText = ({ ogText }: { ogText: string }) => {
  const [showCursor, text, isDone] = useTypeWriter({
    originalText: ogText,
    hideCursor: false,
  });
  const [dimensions, setDimensions] = useState<
    { width: number; height: number } | undefined
  >(undefined);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
        observer.disconnect();
      });
    });

    observer.observe(textRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {!dimensions && (
        <div ref={textRef} className="[visibility:hidden]">
          <span className={`font-mono top-0 left-0`}>{ogText}</span>
          <span
            className="bg-[rgb(255,255,255)] text-[rgba(0,0,0,0)]"
            style={{
              opacity: showCursor ? 1 : 0,
            }}
          >
            0
          </span>
        </div>
      )}

      <div
        style={{
          display: dimensions ? "block" : "none",
          width: !isDone ? dimensions?.width : "auto",
          height: !isDone ? dimensions?.height : "auto",
        }}
      >
        <span className="font-mono">{text}</span>
        <span
          className="bg-[rgb(255,255,255)] text-[rgba(0,0,0,0)]"
          style={{
            opacity: showCursor ? 1 : 0,
          }}
        >
          0
        </span>
      </div>
    </div>
  );
};
