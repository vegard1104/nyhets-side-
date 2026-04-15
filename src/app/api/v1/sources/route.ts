import type { NextRequest } from "next/server";
import { sources } from "../_data";

export async function GET(_request: NextRequest) {
  return Response.json(sources);
}
