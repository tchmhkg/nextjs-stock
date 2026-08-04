import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function jsonError(
  status: number,
  error: string,
  init?: ResponseInit,
) {
  return NextResponse.json({ success: false, error }, { status, ...init });
}

export function zodErrorResponse(error: ZodError) {
  return jsonError(400, error.issues[0]?.message ?? "Invalid request");
}

export function upstreamErrorResponse(err: unknown) {
  console.error("[market]", err instanceof Error ? err.message : err);
  return jsonError(502, "Market data unavailable");
}
