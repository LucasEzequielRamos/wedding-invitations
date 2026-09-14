"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string;
};

function calculateCountdown(targetDate: string) {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const seconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export function InvitationCountdown({ targetDate }: CountdownProps) {
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(targetDate),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div>
      {countdown.days} días {countdown.hours} horas {countdown.minutes} minutos{" "}
      {countdown.seconds} segundos
    </div>
  );
}
