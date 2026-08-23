"use client";

import { useEffect, useState } from "react";
import { formatUsd, liveValue, remainingFraction } from "@/lib/decay";

type Props = {
  lastValue: number;
  lastPaidAt: string;
  showBar?: boolean;
  low?: boolean;
};

export function BurnValue({ lastValue, lastPaidAt, showBar = true, low = false }: Props) {
  const [current, setCurrent] = useState(() => liveValue(lastValue, lastPaidAt));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => setCurrent(liveValue(lastValue, lastPaidAt));
    update();
    if (reduce) return;
    let frame = 0;
    const loop = () => {
      update();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [lastValue, lastPaidAt]);

  const width = remainingFraction(lastValue, current);

  return (
    <div className="burnwrap">
      <div className={`val${low ? " val-low" : ""}`}>{formatUsd(current)}</div>
      {showBar ? (
        <div className="burn">
          <div className="track">
            <div
              className={`fill${low ? " fill-low" : ""}`}
              style={{ width: `${width * 100}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
