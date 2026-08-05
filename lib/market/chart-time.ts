import { TickMarkType, type Time } from "lightweight-charts";

function asDate(time: Time): Date | null {
  if (typeof time === "number") return new Date(time * 1000);
  if (typeof time === "string") return new Date(time);
  return new Date(Date.UTC(time.year, time.month - 1, time.day));
}

function formatClock(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatChartDayTime(date: Date) {
  return `${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} ${formatClock(date)}`;
}

export function formatChartDay(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Axis labels always carry the calendar day — US hours in HK span midnight. */
export function intradayTickMark(
  time: Time,
  tickMarkType: TickMarkType,
): string | null {
  const date = asDate(time);
  if (!date || Number.isNaN(date.getTime())) return null;

  if (
    tickMarkType === TickMarkType.Year ||
    tickMarkType === TickMarkType.Month ||
    tickMarkType === TickMarkType.DayOfMonth
  ) {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  return formatChartDayTime(date);
}

export function intradayCrosshairLabel(time: Time): string {
  const date = asDate(time);
  if (!date || Number.isNaN(date.getTime())) return "";
  return formatChartDayTime(date);
}

export function dailyCrosshairLabel(time: Time): string {
  const date = asDate(time);
  if (!date || Number.isNaN(date.getTime())) return "";
  return formatChartDay(date);
}

export function asChartDate(time: Time): Date | null {
  const date = asDate(time);
  if (!date || Number.isNaN(date.getTime())) return null;
  return date;
}
