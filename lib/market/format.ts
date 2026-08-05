export function formatPrice(value: number | null | undefined, digits = 2) {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatChange(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

export function changeTone(value: number | null | undefined) {
  if (value == null || value === 0) return "text-muted";
  return value > 0 ? "text-success" : "text-danger";
}

function formatCompact(value: number) {
  return value.toLocaleString(undefined, {
    notation: "compact",
    maximumFractionDigits: 2,
  });
}

export function formatVolume(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return formatCompact(value);
}

export function formatMarketCap(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return formatCompact(value);
}

/** Yahoo trailingAnnualDividendYield is often a fraction (0.005 → 0.50%). */
export function formatDividendYield(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  const pct = value > 0 && value < 1 ? value * 100 : value;
  return `${pct.toFixed(2)}%`;
}
