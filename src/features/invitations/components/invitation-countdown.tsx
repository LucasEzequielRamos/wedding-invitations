"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string | Date;
};

function calculateCountdown(targetDate: string | Date) {
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
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => {
      setCountdown(calculateCountdown(targetDate));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div>
      {countdown.days} días {countdown.hours} horas {countdown.minutes} minutos{" "}
      {countdown.seconds} segundos
    </div>
  );
}
