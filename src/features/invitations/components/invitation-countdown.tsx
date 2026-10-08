/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

type Props = {
  targetDate: Date | string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetDate: Date | string): TimeLeft {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const difference = Math.max(target - now, 0);

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function InvitationCountdown({ targetDate }: Props) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);

    const update = () => {
      setTimeLeft(getTimeLeft(targetDate));
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [targetDate]);

  const items = [
    {
      value: timeLeft.days,
      label: "DÍAS",
    },
    {
      value: timeLeft.hours,
      label: "HORAS",
    },
    {
      value: timeLeft.minutes,
      label: "MINUTOS",
    },
    {
      value: timeLeft.seconds,
      label: "SEGUNDOS",
    },
  ];

  return (
    <div className="w-full">
      <div className="mx-auto grid max-w-3xl grid-cols-4">
        {items.map(item => (
          <div
            key={item.label}
            className="flex flex-col items-center text-center"
          >
            <span className="font-script text-[clamp(1.8rem,4vw,3.4rem)] leading-none">
              {mounted ? pad(item.value) : "--"}
            </span>

            <span className="mt-2 font-altivo text-[clamp(0.5rem,1vw,0.75rem)] uppercase tracking-[0.14em]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}